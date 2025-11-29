import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './interfaces/favorites.interface';

import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

import { validate as isUUID } from 'uuid';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = { artists: [], albums: [], tracks: [] };

  constructor(
    private artistService: ArtistService,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}

  getAll(): FavoritesResponse {
    return {
      artists: this.artistService
        .findAll()
        .filter((a) => this.favorites.artists.includes(a.id)),
      albums: this.albumService
        .findAll()
        .filter((a) => this.favorites.albums.includes(a.id)),
      tracks: this.trackService
        .findAll()
        .filter((t) => this.favorites.tracks.includes(t.id)),
    };
  }

  addTrack(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    try {
      this.trackService.findById(id);
    } catch (err) {
      if (err instanceof NotFoundException)
        throw new UnprocessableEntityException('Track does not exist');
      throw err;
    }
    if (!this.favorites.tracks.includes(id)) this.favorites.tracks.push(id);
  }

  removeTrack(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) throw new NotFoundException('Track not in favorites');
    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    try {
      this.albumService.findById(id);
    } catch (err) {
      if (err instanceof NotFoundException)
        throw new UnprocessableEntityException('Album does not exist');
      throw err;
    }
    if (!this.favorites.albums.includes(id)) this.favorites.albums.push(id);
  }

  removeAlbum(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) throw new NotFoundException('Album not in favorites');
    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    try {
      this.artistService.findById(id);
    } catch (err) {
      if (err instanceof NotFoundException)
        throw new UnprocessableEntityException('Artist does not exist');
      throw err;
    }
    if (!this.favorites.artists.includes(id)) this.favorites.artists.push(id);
  }

  removeArtist(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) throw new NotFoundException('Artist not in favorites');
    this.favorites.artists.splice(index, 1);
  }
}
