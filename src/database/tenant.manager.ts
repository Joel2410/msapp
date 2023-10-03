import { DataSource } from 'typeorm';
import { Product } from './entities';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';

export const dataSources: DataSource[] = [];

export const addDataSource = async (
  dataSourceOptions: SqlServerConnectionOptions,
) => {
  const appDataSource = new DataSource({
    ...dataSourceOptions,
    name: dataSourceOptions.database,
    type: 'mssql',
    entities: [Product],
    synchronize: true,
    options: { trustServerCertificate: true },
  });
  dataSources.push(await appDataSource.initialize());
};

export const getDataSource = (name: string) => {
  const dataSource = dataSources.find(
    (dataSource) => dataSource.options.database === name,
  );
  return dataSource;
};

export const shutDown = () => {
  dataSources.forEach(async (dataSource) => {
    await dataSource.destroy();
  });
};

export const removeDataSource = async (name: string) => {
  let index = -1;
  const dataSource = dataSources.find((dataSource, i) => {
    index = i;
    return dataSource.options.database === name;
  });

  await dataSource.destroy();
  dataSources.splice(index, 1);
};
