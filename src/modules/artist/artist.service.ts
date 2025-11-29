import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Artist } from './interfaces/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  constructor(
    private readonly tracksService: TrackService,
    private readonly albumsService: AlbumService,
  ) {}

  findAll(): Artist[] {
    return this.artists;
  }

  findById(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist;
  }

  create(dto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
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

  delete(id: string): void {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1)
      throw new NotFoundException(`Artist with id ${id} not found`);

    this.tracksService.findAll().forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });

    this.albumsService.findAll().forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });

    this.artists.splice(index, 1);
  }
}
