import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

/**
 * Data Transfer Object (DTO) for creating a user.
 */
export class CreateUserDto {
  /**
   * Username of the user.
   * @example 'test1234'
   */
  @ApiProperty({
    example: 'test1234',
    required: true,
  })
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'Username must contain only letters and numbers',
  })
  username: string;

  /**
   * Email address of the user.
   * @example 'test@example.com'
   */
  @ApiProperty({
    example: 'test@example.com',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  /**
   * Password of the user.
   * @example '123456'
   */
  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
