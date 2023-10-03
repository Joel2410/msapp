import { Controller, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { DataSource } from 'typeorm';
import { Public } from 'src/decorators';
import { Product } from 'src/database/entities';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req: { user: { sub: number } }) {
    return this.userService.findOne(req.user.sub, true);
  }

  @Public()
  @Get('products')
  async getProducts() {
    const AppDataSource = new DataSource({
      name: 'prueba-msapp',
      type: 'mssql',
      host: 'JJOEL2410',
      port: 2410,
      username: 'sa',
      password: 'jjstudios12',
      database: 'prueba-msapp',
      entities: [Product],
      synchronize: true,
      options: { trustServerCertificate: true },
    });

    const dataSource = await AppDataSource.initialize();

    const productRepository = dataSource.getRepository(Product);

    return productRepository.find();
  }
}
