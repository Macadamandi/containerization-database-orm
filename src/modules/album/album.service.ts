import { Injectable, NotFoundException } from '@nestjs/common';
import { TrackService } from '../track/track.service';
import { Album } from './interfaces/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  constructor(private trackService: TrackService) {}

  findAll(): Album[] {
    return this.albums;
  }

  findById(id: string): Album {
    const album = this.albums.find((album) => album.id === id);
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    return album;
  }

  create(dto: CreateAlbumDto): Album {
    const album: Album = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
    };
    this.albums.push(album);
    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album {
    const album = this.findById(id);
    album.name = dto.name;
    album.year = dto.year;
    album.artistId = dto.artistId ?? null;
    return album;
  }

  deleteById(id: string): boolean {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    this.trackService.findAll().forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });

    this.albums.splice(index, 1);
    return true;
  }
}
