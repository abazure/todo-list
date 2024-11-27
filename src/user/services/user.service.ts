import { UserRepository } from '../repositories/user.repository';
import { ValidationService } from '../../common/validation.service';
import {
  GetUserResponse,
  UserLoginRequest,
  UserLoginResponse,
  UserRegisterRequest,
} from '../dto/user.dto';
import { UserValidation } from '../validations/user.validation';
import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private validation: ValidationService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async register(request: UserRegisterRequest) {
    const registerRequest = this.validation.Validate(
      UserValidation.REGISTER,
      request,
    );
    const record = await this.userRepository.findByUsername(
      registerRequest.username,
    );
    if (record != null) {
      throw new HttpException('Username Already Exist', 400);
    }
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    registerRequest.id = uuidv4().toString();
    return await this.userRepository.create(registerRequest as User);
  }
  async login(request: UserLoginRequest): Promise<UserLoginResponse> {
    const loginRequest = this.validation.Validate(
      UserValidation.LOGIN,
      request,
    );
    const record = await this.userRepository.findByUsername(
      loginRequest.username,
    );
    if (record == null) {
      throw new HttpException('Email or Password wrong', 400);
    }
    const checkPassword = await bcrypt.compare(
      loginRequest.password,
      record.password,
    );
    if (!checkPassword) {
      throw new HttpException('Email or Password wrong', 400);
    }

    const token = await this.jwtService.signAsync(
      {
        id: record.id,
        username: record.username,
      },
      { secret: this.configService.get<string>('SECRET'), expiresIn: '1h' },
    );

    return {
      access_token: token,
    };
  }

  async get(request: string): Promise<GetUserResponse> {
    const record = await this.userRepository.findById(request);
    if (record == null) {
      throw new HttpException('User not found', 404);
    }
    delete record.password;
    return record;
  }
}
