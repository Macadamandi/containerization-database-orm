import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findById(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    return album;
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    const album = this.albumRepository.create({
      name: dto.name,
      year: dto.year,
      artist: dto.artistId ? { id: dto.artistId } : null,
    });
    return this.albumRepository.save(album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const album = await this.albumRepository.preload({
      id,
      name: dto.name,
      year: dto.year,
      artist: dto.artistId ? ({ id: dto.artistId } as any) : null,
    });

    if (!album) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }

    return this.albumRepository.save(album);
  }

  async deleteById(id: string): Promise<void> {
    const album = await this.findById(id);

    const tracks = await this.trackRepository.find({
      where: { album: { id } },
      relations: ['album'],
    });

    for (const track of tracks) {
      track.album = null;
      await this.trackRepository.save(track);
    }

    await this.albumRepository.remove(album);
  }
}
