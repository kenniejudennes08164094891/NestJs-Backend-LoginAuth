import { IsByteLength, IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsNotEmpty({ message: 'username is required' })
  @IsByteLength(3, 50, {
    message: 'username must be between 3 to 50 characters',
  })
  username: string;

  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsByteLength(8, 100, {
    message: 'password must be between 8 to 100 characters',
  })
  password: string;
}
