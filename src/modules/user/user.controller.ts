import { BadRequestException, Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { TenantService } from '../tenant/tenant.service';
import { Product } from 'src/database/entities';
import { CurrentTenatId, CurrentUser } from 'src/decorators';
import { UserDTO } from './dtos';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private tenantService: TenantService,
  ) {}

  @Get('profile')
  getProfile(@CurrentUser() user: UserDTO) {
    return this.userService.findOne(user.userId, true);
  }

  @Get('products')
  getProducts(@CurrentTenatId() tenantId: string) {
    const dataSource = this.tenantService.findDataSource(tenantId);

    if (!dataSource)
      throw new BadRequestException({ message: `Unknown tenant: ${tenantId}` });

    const productRepository = dataSource.getRepository(Product);

    return productRepository.find();
  }
}
