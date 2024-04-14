import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { ConnectionPool } from 'mssql';
import { Product, Tenant, UserToTenant } from '@entities';
import {
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DB_MASTER,
  DB_TYPE,
} from '@config';

@Injectable()
export class TenantService {
  dataSources: DataSource[] = [];

  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    @InjectRepository(UserToTenant)
    private userTotenantsRepository: Repository<UserToTenant>,
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

  findOneById(id: string) {
    return this.tenantsRepository.findOneBy({ id });
  }

  async create(userId: number, tenantId: string) {
    let tenant = await this.findOneById(tenantId);

    if (tenant) {
      throw new BadRequestException({ message: 'This tenant has been used' });
    }

    tenant = this.tenantsRepository.create({
      id: tenantId,
      isActive: true,
    });

    let userToTenant = this.userTotenantsRepository.create({
      tenantId,
      userId,
    });

    try {
      tenant = await this.tenantsRepository.save(tenant);
      userToTenant = await this.userTotenantsRepository.save(userToTenant);
    } catch (error) {
      //TODO manejar mensajes de errores
      throw error;
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

  async shutDown() {
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

  async isUserTenantValid(tenantId: string, userId: number): Promise<void> {
    const tenant = await this.findOneById(tenantId);

    if (!tenant) {
      throw new UnauthorizedException(`Tenant: ${tenantId} does not exists`);
    }

    const userToTenant = await this.userTotenantsRepository.findOneBy({
      tenantId,
      userId,
    });

    if (!userToTenant) {
      throw new UnauthorizedException(
        `User: ${userId} does not have the tenant: ${tenantId}`,
      );
    }
  }
}
