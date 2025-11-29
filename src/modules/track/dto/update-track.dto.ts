import { IsString, IsUUID, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsUUID()
  @IsOptional()
  artistId?: string | null;

  @IsUUID()
  @IsOptional()
  albumId?: string | null;

  @IsInt()
  @Min(1)
  @IsOptional()
  duration?: number;
}
