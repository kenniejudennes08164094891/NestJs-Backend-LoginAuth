import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty({ message: 'refreshToken is required' })
  refreshToken: string;
}
