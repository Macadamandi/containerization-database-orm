import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  findAll(): Artist[] {
    return this.artists;
  }

  findById(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist;
  }

  create(dto: CreateArtistDto): Artist {
    const { name, grammy } = dto;
    const artist: Artist = {
      id: randomUUID(),
      name,
      grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  update(id: string, dto: UpdateArtistDto): Artist {
    const artist = this.findById(id);
    if (dto.name !== undefined) artist.name = dto.name;
    if (dto.grammy !== undefined) artist.grammy = dto.grammy;
    return artist;
  }

  delete(id: string): boolean {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1)
      throw new NotFoundException(`Artist with id ${id} not found`);
    this.artists.splice(index, 1);
    return true;
  }
}
