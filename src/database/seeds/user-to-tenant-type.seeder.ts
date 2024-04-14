import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserToTenantType } from '../entities/user-to-tenant-type.entity';

export default class UserToTenantTypeSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserToTenantType);

    // Truncar la tabla antes de insertar nuevos registros
    await repository.query(`DELETE FROM user_to_tenant_type;`);

    // Reiniciar el contador del identity
    await repository.query(
      `DBCC CHECKIDENT ('user_to_tenant_type', RESEED, 0);`,
    );

    // Insertar registros
    await repository.insert([
      {
        slug: 'OWNER',
        name: 'Dueño',
      },
      {
        slug: 'ADMIN',
        name: 'Administrador',
      },
      {
        slug: 'MEMBER',
        name: 'miembro',
      },
    ]);
  }
}
