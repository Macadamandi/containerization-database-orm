import { IsString, IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateAlbumDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  @IsUUID()
  artistId?: string | null;
}
