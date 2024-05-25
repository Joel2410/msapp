import { DataSource, EntityTarget } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DB_TYPE,
  DB_SYSTEM_ENTIIES_PATH,
} from '@config';
import { Tenant } from '@entities/msapp';
import { dataSource } from './data-source';

@Injectable()
export class DatabaseService {
  private dataSources: DataSource[] = [];

  constructor() {
    dataSource
      .initialize()
      .then(async () => {
        const tenants = await this.exec<Tenant[]>(`select * from tenant`);

        if (!tenants?.length) {
          Logger.warn('No databases found');
        }

        for (const tenant of tenants) {
          await this.addDataSource(tenant.id);
        }

        Logger.log('Database service inicializated');
      })
      .catch((error) => {
        Logger.error(error);
      });
  }

  public async exec<T>(query: string): Promise<T> {
    try {
      return await dataSource.query<T>(query);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async creatDatabase(tenantId: string): Promise<void> {
    try {
      await this.exec(`CREATE DATABASE ${tenantId}`);
      await this.addDataSource(tenantId, true);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async addDataSource(tenantId: string, synchronize?: boolean) {
    const appDataSource = new DataSource({
      name: tenantId,
      type: DB_TYPE,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: tenantId,
      entities: [DB_SYSTEM_ENTIIES_PATH],
      options: { trustServerCertificate: true },
      synchronize,
    });

    this.dataSources.push(await appDataSource.initialize());
  }

  public findDataSource(tenantId: string) {
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

  public getRepository<T>(tenantId: string, model: EntityTarget<T>) {
    const dataSource = this.findDataSource(tenantId);
    return dataSource.getRepository(model);
  }

  public async shutDown() {
    this.dataSources.forEach(async (dataSource) => {
      await dataSource.destroy();
    });
  }

  public async removeDataSource(name: string) {
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
