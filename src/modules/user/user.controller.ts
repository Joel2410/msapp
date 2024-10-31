import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CurrentUser, Public } from 'src/decorators';
import { UserDTO } from './dtos';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Endpoint de prueba
  @Public()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  getProfile(@CurrentUser() user: UserDTO) {
    return this.userService.findOneById(user.userId);
  }
}
