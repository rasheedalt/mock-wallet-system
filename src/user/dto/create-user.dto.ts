import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'firstName must have atleast 2 characters.' })
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'lastName must have atleast 2 characters.' })
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide valid Email.' })
  email: string;

  @IsNotEmpty()
  @MinLength(11, { message: 'phoneNumber must have atleast 11 characters.' })
  phoneNumber: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'password must have atleast 6 characters.' })
  @IsAlphanumeric(null, {
    message: 'password does not allow other than alpha numeric chars.',
  })
  password: string;
}
