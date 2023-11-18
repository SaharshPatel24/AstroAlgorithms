import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test1234',
    required: true
 })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers',
  })
  username: string;

  @ApiProperty({
    example: 'test@example.com',
    required: true  
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: '123456',
    required: true  
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
