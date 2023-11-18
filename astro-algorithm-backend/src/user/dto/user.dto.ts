import { Transform } from 'class-transformer';
import { IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
  @IsEmail({}, { message: 'Invalid email format' }) // Adding email format validation
  email: string;
}

export class UpdateUserDto extends CreateUserDto {
  @IsString()
  _id: string;
}