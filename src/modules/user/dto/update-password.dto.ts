import { IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(1)
  @Transform(({ value }) =>
    value === null || value === undefined ? value : String(value).trim(),
  )
  oldPassword: string;

  @IsString()
  @MinLength(4)
  @Transform(({ value }) =>
    value === null || value === undefined ? value : String(value).trim(),
  )
  newPassword: string;
}
