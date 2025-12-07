import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';

type PublicTrack = {
  id: string;
  name: string;
  duration: number;
  artistId: string | null;
  albumId: string | null;
};

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

  private mapTrack(track: Track): PublicTrack {
    return {
      id: track.id,
      name: track.name,
      duration: Number(track.duration),
      artistId: track.artist ? track.artist.id : null,
      albumId: track.album ? track.album.id : null,
    };
  }

  async findAll(): Promise<PublicTrack[]> {
    const tracks = await this.trackRepository.find({
      relations: ['artist', 'album'],
    });
    return tracks.map((t) => this.mapTrack(t));
  }

  async findById(id: string): Promise<PublicTrack> {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (!track) throw new NotFoundException(`Track with id ${id} not found`);
    return this.mapTrack(track);
  }

  async create(dto: CreateTrackDto): Promise<PublicTrack> {
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
    } else {
      track.artist = null;
    }

    if (dto.albumId) {
      const album = await this.albumRepository.findOne({
        where: { id: dto.albumId },
      });
      if (!album)
        throw new NotFoundException(`Album with id ${dto.albumId} not found`);
      track.album = album;
    } else {
      track.album = null;
    }

    const saved = await this.trackRepository.save(track);
    const persisted = await this.trackRepository.findOne({
      where: { id: saved.id },
      relations: ['artist', 'album'],
    });
    return this.mapTrack(persisted || saved);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<PublicTrack> {
    const entity = await this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (!entity) throw new NotFoundException(`Track with id ${id} not found`);

    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.duration !== undefined) entity.duration = dto.duration;

    if (dto.artistId !== undefined) {
      if (dto.artistId === null) {
        entity.artist = null;
      } else {
        const artist = await this.artistRepository.findOne({
          where: { id: dto.artistId },
        });
        if (!artist)
          throw new NotFoundException(
            `Artist with id ${dto.artistId} not found`,
          );
        entity.artist = artist;
      }
    }

    if (dto.albumId !== undefined) {
      if (dto.albumId === null) {
        entity.album = null;
      } else {
        const album = await this.albumRepository.findOne({
          where: { id: dto.albumId },
        });
        if (!album)
          throw new NotFoundException(`Album with id ${dto.albumId} not found`);
        entity.album = album;
      }
    }

    const saved = await this.trackRepository.save(entity);
    const persisted = await this.trackRepository.findOne({
      where: { id: saved.id },
      relations: ['artist', 'album'],
    });
    return this.mapTrack(persisted || saved);
  }

  async deleteById(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    const affectedNum = Number((result as any).affected ?? 0);
    if (Number.isNaN(affectedNum) || affectedNum === 0) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
  }
}
