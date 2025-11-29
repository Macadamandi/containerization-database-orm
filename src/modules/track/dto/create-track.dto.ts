import { IsString, IsUUID, IsInt, IsOptional, Min } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  artistId?: string;

  @IsUUID()
  @IsOptional()
  albumId?: string;

  @IsInt()
  @Min(1)
  duration: number;
}
