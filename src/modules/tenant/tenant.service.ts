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
import { Tenant, User, UserToTenant, UserToTenantType } from '@entities/msapp';
import { DatabaseService } from '@database/database.service';
import { UserDTO } from '@modules/user/dtos';
import { USER_TO_TENANT_TYPE } from '@enums';

@Injectable()
export class TenantService {
  //TODO: refactor form to get repositories or replace it for his services
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
    @InjectRepository(UserToTenant)
    private readonly userTotenantsRepository: Repository<UserToTenant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserToTenantType)
    private readonly userToTenantTypeRepository: Repository<UserToTenantType>,
    private readonly databaseService: DatabaseService,
  ) {}

  find(user: UserDTO) {
    return this.tenantsRepository
      .createQueryBuilder('tenant')
      .innerJoinAndSelect('tenant.userToTenants', 'userToTenant')
      .innerJoinAndSelect('userToTenant.type', 'type')
      .innerJoin('userToTenant.user', 'user', 'user.id = :userId', {
        userId: user.userId,
      })
      .getMany();
  }

  findOneById(id: string) {
    return this.tenantsRepository.findOneBy({ id });
  }

  async create(userId: number, tenantId: string) {
    let tenant = await this.findOneById(tenantId);

    if (tenant) {
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

    const userToTenantType = await this.userToTenantTypeRepository.findOneBy({
      slug: USER_TO_TENANT_TYPE.OWNER,
    });

    tenant = this.tenantsRepository.create({
      id: tenantId,
      isActive: true,
    });

    let userToTenant = this.userTotenantsRepository.create({
      tenant,
      user,
      type: userToTenantType,
    });

    try {
      await this.tenantsRepository.manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          tenant = await transactionalEntityManager.save(tenant);
          userToTenant = await transactionalEntityManager.save(userToTenant);

          await this.databaseService.createDatabase(tenant.id);
        },
      );
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException();
    }

    return tenant;
  }

  async isUserTenantValid(tenantId: string, userId: number): Promise<void> {
    const tenant = await this.findOneById(tenantId);

    if (!tenant) {
      throw new UnauthorizedException({
        show: true,
        message: `Tenant: ${tenantId} does not exists`,
      });
    }

    const userToTenant = await this.userTotenantsRepository.findOneBy({
      tenantId,
      userId,
    });

    if (!userToTenant) {
      throw new UnauthorizedException({
        show: true,
        message: `User: ${userId} does not have the tenant: ${tenantId}`,
      });
    }
  }
}
