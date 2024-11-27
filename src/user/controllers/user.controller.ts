import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserLoginRequest, UserRegisterRequest } from '../dto/user.dto';

@Controller('/api/v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async register(@Body() request: UserRegisterRequest): Promise<any> {
    await this.userService.register(request);
    return {
      message: 'User registered successfully',
    };
  }
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: UserLoginRequest): Promise<any> {
    const user = await this.userService.login(request);
    return {
      data: user,
    };
  }
}
