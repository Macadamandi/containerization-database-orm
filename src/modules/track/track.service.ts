import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from './interfaces/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  findAll(): Track[] {
    return this.tracks;
  }

  findById(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    return track;
  }

  create(dto: CreateTrackDto): Track {
    const track: Track = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId ?? null,
      albumId: dto.albumId ?? null,
      duration: dto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  update(id: string, dto: UpdateTrackDto): Track {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);

    if (dto.name !== undefined) track.name = dto.name;
    if (dto.artistId !== undefined) track.artistId = dto.artistId;
    if (dto.albumId !== undefined) track.albumId = dto.albumId;
    if (dto.duration !== undefined) track.duration = dto.duration;

    return track;
  }

  deleteById(id: string): boolean {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1)
      throw new NotFoundException(`Track with id ${id} not found`);
    this.tracks.splice(index, 1);
    return true;
  }
}
