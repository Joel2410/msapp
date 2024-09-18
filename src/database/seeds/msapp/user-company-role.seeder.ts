import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserCompanyRole } from '../../entities/msapp/user-company-role.entity';

export default class UserCompanyRoleSeeder implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UserCompanyRole);

    // Truncar la tabla antes de insertar nuevos registros
    await repository.query(`DELETE FROM user_company_role;`);

    // Reiniciar el contador del identity
    await repository.query(`DBCC CHECKIDENT ('user_company_role', RESEED, 0);`);

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
