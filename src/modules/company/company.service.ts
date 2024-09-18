import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Company, User, UserCompany, UserCompanyRole } from '@entities/msapp';
import { DatabaseService } from '@database/database.service';
import { UserDTO } from '@modules/user/dtos';
import { USER_COMPANY_ROLE } from '@enums';

@Injectable()
export class CompanyService {
  //TODO: refactor form to get repositories or replace it for his services
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(UserCompany)
    private readonly userCompanyRepository: Repository<UserCompany>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserCompanyRole)
    private readonly userCompanyRoleRepository: Repository<UserCompanyRole>,
    private readonly databaseService: DatabaseService,
  ) {}

  find(user: UserDTO) {
    return this.companyRepository
      .createQueryBuilder('company')
      .innerJoinAndSelect('company.userCompanies', 'userCompany')
      .innerJoinAndSelect('userCompany.role', 'role')
      .innerJoin('userCompany.user', 'user', 'user.id = :userId', {
        userId: user.userId,
      })
      .getMany();
  }

  findOneByTenant(tenant: string) {
    return this.companyRepository.findOneBy({ tenant });
  }

  async create(userId: number, tenant: string) {
    try {
      let company = await this.findOneByTenant(tenant);
      if (company) {
        throw new BadRequestException({
          show: true,
          message: 'This tenant has been used',
        });
      }

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new NotFoundException({
          show: true,
          message: `User not found with id: ${userId}`,
        });
      }

      const role = await this.userCompanyRoleRepository.findOneBy({
        slug: USER_COMPANY_ROLE.OWNER,
      });

      if (!role) {
        throw new NotFoundException({
          show: true,
          message: `Role not found`,
        });
      }

      await this.companyRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          company = await transactionalEntityManager.save(
            this.companyRepository.create({ tenant }),
          );

          await transactionalEntityManager.save(
            this.userCompanyRepository.create({
              company,
              user,
              role,
            }),
          );

          await this.databaseService.createDatabase(company.tenant);
        },
      );

      return company;
    } catch (error: any) {
      Logger.error(error);

      if (error?.response?.show) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }

  async isUserCompanyValid(tenant: string, userId: number): Promise<void> {
    const company = await this.findOneByTenant(tenant);

    if (!company) {
      throw new UnauthorizedException({
        show: true,
        message: `Tenant: ${tenant} does not exists`,
      });
    }

    const userCompany = await this.userCompanyRepository.findOneBy({
      userId,
      companyId: company.id,
    });

    if (!userCompany) {
      throw new UnauthorizedException({
        show: true,
        message: `User: ${userId} does not have the tenant: ${tenant}`,
      });
    }
  }
}
