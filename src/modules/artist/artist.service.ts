import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';

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

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({ where: { id } });
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist;
  }

  async create(dto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create({
      name: dto.name,
      grammy: dto.grammy,
    });
    return this.artistRepository.save(artist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findById(id);

    if (dto.name !== undefined) artist.name = dto.name;
    if (dto.grammy !== undefined) artist.grammy = dto.grammy;

    return this.artistRepository.save(artist);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);

    await this.trackRepository
      .createQueryBuilder()
      .update()
      .set({ artist: null })
      .where('artistId = :id', { id })
      .execute();

    await this.albumRepository
      .createQueryBuilder()
      .update()
      .set({ artist: null })
      .where('artistId = :id', { id })
      .execute();

    await this.artistRepository.delete(id);
  }
}
