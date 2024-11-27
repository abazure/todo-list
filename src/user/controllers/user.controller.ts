import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserLoginRequest, UserRegisterRequest } from '../dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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

  @Get('/current')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async current(@Req() req): Promise<any> {
    const result = await this.userService.get(req.user.id);
    return {
      data: result,
    };
  }
}
