import { BadRequestException, Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { TenantService } from '../tenant/tenant.service';
import { Product } from 'src/database/entities';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private tenantService: TenantService,
  ) {}

  @Get('profile')
  getProfile(@Request() req: { user: { userId: number } }) {
    return this.userService.findOne(req.user.userId, true);
  }

  @Get('products')
  getProducts(@Request() req: any) {
    const tenantId = req.tenantId;
    const dataSource = this.tenantService.findDataSource(tenantId);

    if (!dataSource)
      throw new BadRequestException({ message: `Unknown tenant: ${tenantId}` });

    const productRepository = dataSource.getRepository(Product);

    return productRepository.find();
  }
}
