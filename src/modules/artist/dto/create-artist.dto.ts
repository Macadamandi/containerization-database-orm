import { IsString, IsBoolean, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateArtistDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  name: string;

  @IsBoolean()
  grammy: boolean;
}
