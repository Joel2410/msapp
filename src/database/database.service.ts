import { DataSource, EntityManager, EntityTarget } from 'typeorm';
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
import { Company } from '@entities/msapp';
import { dataSource } from './data-source';

@Injectable()
export class DatabaseService {
  private dataSources: DataSource[] = [];

  public get dataSource() {
    return dataSource;
  }

  constructor() {
    dataSource
      .initialize()
      .then(async () => {
        const companies = await this.exec<Company[]>(`select * from company`);

        if (!companies?.length) {
          Logger.warn('No databases found');
        }

        for (const company of companies) {
          await this.addDataSource(company.tenant);
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
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async createDatabase(
    tenant: string,
    transactionalEntityManager: EntityManager,
  ): Promise<void> {
    try {
      await transactionalEntityManager.query(`CREATE DATABASE ${tenant}`);
      await this.addDataSource(tenant, true);
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  public async addDataSource(tenant: string, synchronize?: boolean) {
    const appDataSource = new DataSource({
      name: tenant,
      type: DB_TYPE,
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: tenant,
      entities: [DB_SYSTEM_ENTIIES_PATH],
      options: { trustServerCertificate: true },
      synchronize,
    });

    this.dataSources.push(await appDataSource.initialize());
  }

  public findDataSource(tenant: string) {
    const dataSource = this.dataSources.find(
      (dataSource) =>
        (dataSource.options.database as string).toLowerCase() ===
        tenant.toLowerCase(),
    );

    if (!dataSource?.isInitialized) {
      throw new BadRequestException({
        show: true,
        message: `Tenant: ${tenant} is not available`,
      });
    }

    return dataSource;
  }

  public getRepository<T>(tenant: string, model: EntityTarget<T>) {
    const dataSource = this.findDataSource(tenant);
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

  public runMigrations(): void {
    this.dataSources?.forEach((dataSource) => {
      dataSource.runMigrations();
    });
  }
}
