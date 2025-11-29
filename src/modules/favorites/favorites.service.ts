import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Favorites, FavoritesResponse } from './interfaces/favorites.interface';
import { Artist } from '../artist/interfaces/artist.interface';
import { Album } from '../album/interfaces/album.interface';
import { Track } from '../track/interfaces/track.interface';
import { validate as isUUID } from 'uuid';

@Injectable()
export class FavoritesService {
  private favorites: Favorites = { artists: [], albums: [], tracks: [] };

  constructor(
    private artistsData: Artist[] = [],
    private albumsData: Album[] = [],
    private tracksData: Track[] = [],
  ) {}

  getAll(): FavoritesResponse {
    return {
      artists: this.artistsData.filter((a) =>
        this.favorites.artists.includes(a.id),
      ),
      albums: this.albumsData.filter((a) =>
        this.favorites.albums.includes(a.id),
      ),
      tracks: this.tracksData.filter((t) =>
        this.favorites.tracks.includes(t.id),
      ),
    };
  }

  addTrack(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    const trackExists = this.tracksData.some((t) => t.id === id);
    if (!trackExists)
      throw new NotFoundException(`Track with id ${id} does not exist`);
    if (!this.favorites.tracks.includes(id)) this.favorites.tracks.push(id);
  }

  removeTrack(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) throw new NotFoundException('Track is not in favorites');
    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    const albumExists = this.albumsData.some((a) => a.id === id);
    if (!albumExists)
      throw new NotFoundException(`Album with id ${id} does not exist`);
    if (!this.favorites.albums.includes(id)) this.favorites.albums.push(id);
  }

  removeAlbum(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) throw new NotFoundException('Album is not in favorites');
    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    const artistExists = this.artistsData.some((a) => a.id === id);
    if (!artistExists)
      throw new NotFoundException(`Artist with id ${id} does not exist`);
    if (!this.favorites.artists.includes(id)) this.favorites.artists.push(id);
  }

  removeArtist(id: string): void {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) throw new NotFoundException('Artist is not in favorites');
    this.favorites.artists.splice(index, 1);
  }
}
