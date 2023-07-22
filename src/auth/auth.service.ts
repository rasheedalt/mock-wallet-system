import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dto/sign-in.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { TokenPayload } from 'src/util/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION_TIME}`;
  }

  async signUp(createUserDto: CreateUserDto) {
    const { phoneNumber } = createUserDto;

    try {
      const userExists = await this.userService.findByPhoneNumber(phoneNumber);

      if (userExists) {
        throw new HttpException(
          'Phone number already exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userService.create(createUserDto);
      user.password = undefined; //to hide password (not the cleanest way)
      return { user };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signIn(signInDTO: SignInDTO) {
    const { phoneNumber, password } = signInDTO;
    const user = await this.getAuthenticatedUser(phoneNumber, password);

    const payload = { sub: user.id, username: user.phoneNumber };
    const accessToken = this.jwtService.sign(payload);

    return {
      success: true,
      access_token: accessToken,
    };
  }

  async getAuthenticatedUser(
    phoneNumber: string,
    password: string,
  ): Promise<User> {
    try {
      const user = await this.userService.findByPhoneNumber(phoneNumber);
      await user.validatePassword(password);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
