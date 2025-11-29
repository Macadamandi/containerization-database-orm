import { IsString, IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateAlbumDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsInt()
  @Type(() => Number)
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  @IsUUID()
  artistId?: string | null;
}
