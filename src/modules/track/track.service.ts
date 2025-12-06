import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,

    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find({ relations: ['artist', 'album'] });
  }

  async findById(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    const track = new Track();
    track.name = dto.name;
    track.duration = dto.duration;

    if (dto.artistId) {
      const artist = await this.artistRepository.findOne({
        where: { id: dto.artistId },
      });
      if (!artist)
        throw new NotFoundException(`Artist with id ${dto.artistId} not found`);
      track.artist = artist;
    }

    if (dto.albumId) {
      const album = await this.albumRepository.findOne({
        where: { id: dto.albumId },
      });
      if (!album)
        throw new NotFoundException(`Album with id ${dto.albumId} not found`);
      track.album = album;
    }

    return this.trackRepository.save(track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.findById(id);

    if (dto.name !== undefined) track.name = dto.name;
    if (dto.duration !== undefined) track.duration = dto.duration;

    if (dto.artistId !== undefined) {
      if (dto.artistId === null) {
        track.artist = null;
      } else {
        const artist = await this.artistRepository.findOne({
          where: { id: dto.artistId },
        });
        if (!artist)
          throw new NotFoundException(
            `Artist with id ${dto.artistId} not found`,
          );
        track.artist = artist;
      }
    }

    if (dto.albumId !== undefined) {
      if (dto.albumId === null) {
        track.album = null;
      } else {
        const album = await this.albumRepository.findOne({
          where: { id: dto.albumId },
        });
        if (!album)
          throw new NotFoundException(`Album with id ${dto.albumId} not found`);
        track.album = album;
      }
    }

    return this.trackRepository.save(track);
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`Track with id ${id} not found`);
  }
}
