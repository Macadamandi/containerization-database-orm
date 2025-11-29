import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePasswordDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  oldPassword: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @MinLength(6)
  newPassword: string;
}
