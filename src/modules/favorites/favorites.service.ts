import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesResponse } from './interfaces/favorites.interface';
import { validate as isUUID } from 'uuid';

import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavoritesService {
  private favorites: { artists: string[]; albums: string[]; tracks: string[] } =
    {
      artists: [],
      albums: [],
      tracks: [],
    };

  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async getAll(): Promise<FavoritesResponse> {
    const artists =
      this.favorites.artists.length > 0
        ? await this.artistRepository.findBy({
            id: In(this.favorites.artists),
          })
        : [];

    const albumsEntities =
      this.favorites.albums.length > 0
        ? await this.albumRepository.find({
            where: { id: In(this.favorites.albums) },
            relations: ['artist'],
          })
        : [];

    const tracksEntities =
      this.favorites.tracks.length > 0
        ? await this.trackRepository.find({
            where: { id: In(this.favorites.tracks) },
            relations: ['artist', 'album'],
          })
        : [];

    const albums = albumsEntities.map((a) => ({
      id: a.id,
      name: a.name,
      year: a.year,
      artistId: a.artist ? a.artist.id : null,
    }));

    const tracks = tracksEntities.map((t) => ({
      id: t.id,
      name: t.name,
      duration: t.duration,
      albumId: t.album ? t.album.id : null,
      artistId: t.artist ? t.artist.id : null,
    }));

    return { artists, albums, tracks };
  }

  private validateId(id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid id');
  }

  async addTrack(id: string): Promise<void> {
    this.validateId(id);
    const track = await this.trackRepository.findOne({ where: { id } });
    if (!track) throw new UnprocessableEntityException('Track does not exist');
    if (!this.favorites.tracks.includes(id)) this.favorites.tracks.push(id);
  }

  async removeTrack(id: string): Promise<void> {
    this.validateId(id);
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) throw new NotFoundException('Track not in favorites');
    this.favorites.tracks.splice(index, 1);
  }

  async addAlbum(id: string): Promise<void> {
    this.validateId(id);
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) throw new UnprocessableEntityException('Album does not exist');
    if (!this.favorites.albums.includes(id)) this.favorites.albums.push(id);
  }

  async removeAlbum(id: string): Promise<void> {
    this.validateId(id);
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) throw new NotFoundException('Album not in favorites');
    this.favorites.albums.splice(index, 1);
  }

  async addArtist(id: string): Promise<void> {
    this.validateId(id);
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist)
      throw new UnprocessableEntityException('Artist does not exist');
    if (!this.favorites.artists.includes(id)) this.favorites.artists.push(id);
  }

  async removeArtist(id: string): Promise<void> {
    this.validateId(id);
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) throw new NotFoundException('Artist not in favorites');
    this.favorites.artists.splice(index, 1);
  }
}
