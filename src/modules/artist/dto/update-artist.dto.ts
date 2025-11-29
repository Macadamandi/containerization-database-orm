import { IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateArtistDto {
  @Transform(({ value }) => value?.trim())
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
