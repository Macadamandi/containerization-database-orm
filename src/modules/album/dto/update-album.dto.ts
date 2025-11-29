import { IsString, IsUUID, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateAlbumDto {
  @Transform(({ value }) => value.trim())
  @IsString()
  name: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  year: number;

  @IsOptional()
  @IsUUID()
  artistId?: string | null;
}
