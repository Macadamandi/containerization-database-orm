import { IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
