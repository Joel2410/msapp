import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectionPool } from 'mssql';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Product, Tenant } from 'src/database/entities';
import { DB_MASTER, DB_TYPE, getError } from 'src/helpers';
import { DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from 'src/config';

@Injectable()
export class TenantService {
  dataSources: DataSource[] = [];

  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) {
    this.find()
      .then((tenants) => {
        tenants.forEach(async (tenant) => {
          await this.addDataSource(tenant.id);
        });
      })
      .catch((error) => new InternalServerErrorException(error));
  }

  find() {
    return this.tenantsRepository.find();
  }

  findOne(id: string) {
    return this.tenantsRepository.findOneBy({ id });
  }

  async create(userId: number, tenantId: string) {
    let tenant = await this.findOne(tenantId);

    if (tenant) {
      throw new BadRequestException({ message: 'This tenant has been used' });
    }

    tenant = this.tenantsRepository.create({
      id: tenantId,
      userId,
      isActive: true,
    });

    try {
      tenant = await this.tenantsRepository.save(tenant);
    } catch (error: any) {
      throw new BadRequestException(
        getError(error, [
          { error: 2627, message: 'This tenant has been used' },
        ]),
      );
    }

    try {
      const pool = new ConnectionPool({
        server: DB_HOST,
        port: DB_PORT,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_MASTER,
        options: { trustServerCertificate: true },
      });

      await pool.connect();
      await pool.query(`CREATE DATABASE ${tenantId}`);
      await pool.close();

      await this.addDataSource(tenantId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return tenant;
  }

  async addDataSource(tenantId: string) {
    const appDataSource = new DataSource({
      name: tenantId,
      type: DB_TYPE,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: tenantId,
      entities: [Product],
      synchronize: true,
      options: { trustServerCertificate: true },
    });

    this.dataSources.push(await appDataSource.initialize());
  }

  findDataSource(tenantId: string) {
    const dataSource = this.dataSources.find(
      (dataSource) =>
        (dataSource.options.database as string).toLowerCase() ===
        tenantId.toLowerCase(),
    );

    if (!dataSource?.isInitialized) {
      throw new BadRequestException({
        message: `Tenant: ${tenantId} is not available`,
      });
    }

    return dataSource;
  }

  getRepository(tenantId: string, model: EntityTarget<ObjectLiteral>) {
    const dataSource = this.findDataSource(tenantId);
    return dataSource.getRepository(model);
  }

  shutDown() {
    this.dataSources.forEach(async (dataSource) => {
      await dataSource.destroy();
    });
  }

  async removeDataSource(name: string) {
    let index = -1;
    const dataSource = this.dataSources.find((dataSource, i) => {
      index = i;
      return (
        (dataSource.options.database as string).toLowerCase() ===
        name.toLowerCase()
      );
    });

    await dataSource.destroy();
    this.dataSources.splice(index, 1);
  }
}
