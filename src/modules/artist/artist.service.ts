import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

export type PublicArtist = {
  id: string;
  name: string;
  grammy: boolean;
};

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  private mapArtist(artist: Artist): PublicArtist {
    return {
      id: artist.id,
      name: artist.name,
      grammy: artist.grammy,
    };
  }

  async findAll(): Promise<PublicArtist[]> {
    const artists = await this.artistRepository.find();
    return artists.map(this.mapArtist);
  }

  async findById(id: string): Promise<PublicArtist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return this.mapArtist(artist);
  }

  async create(dto: CreateArtistDto): Promise<PublicArtist> {
    const artist = this.artistRepository.create(dto);
    try {
      const saved = await this.artistRepository.save(artist);
      return this.mapArtist(saved);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === '23505') {
        throw new BadRequestException(
          `Artist with name '${dto.name}' already exists`,
        );
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateArtistDto): Promise<PublicArtist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);

    Object.assign(artist, dto);

    try {
      const saved = await this.artistRepository.save(artist);
      return this.mapArtist(saved);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === '23505') {
        throw new BadRequestException(
          `Artist with name '${dto.name}' already exists`,
        );
      }
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);

    const tracks = await this.trackRepository.find({
      where: { artist: { id } },
      relations: ['artist'],
    });
    for (const t of tracks) {
      t.artist = null;
      await this.trackRepository.save(t);
    }

    const albums = await this.albumRepository.find({
      where: { artist: { id } },
      relations: ['artist'],
    });
    for (const a of albums) {
      a.artist = null;
      await this.albumRepository.save(a);
    }

    const result = await this.artistRepository.delete(id);
    const affectedNum = Number((result as any).affected ?? 0);
    if (!affectedNum)
      throw new NotFoundException(`Artist with id ${id} not found`);
  }
}
