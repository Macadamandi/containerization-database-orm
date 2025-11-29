import { IsString, IsBoolean, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateArtistDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  @MinLength(2)
  name: string;

  @Type(() => Boolean)
  @IsBoolean()
  grammy: boolean;
}
