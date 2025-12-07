import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Album } from './entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Artist } from '../artist/entities/artist.entity';

type PublicAlbum = {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
};

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  private mapAlbum(album: Album): PublicAlbum {
    return {
      id: album.id,
      name: album.name,
      year: album.year,
      artistId: album.artist ? album.artist.id : null,
    };
  }

  async findAll(): Promise<PublicAlbum[]> {
    const albums = await this.albumRepository.find({ relations: ['artist'] });
    return albums.map((a) => this.mapAlbum(a));
  }

  async findById(id: string): Promise<PublicAlbum> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);
    return this.mapAlbum(album);
  }

  async create(dto: CreateAlbumDto): Promise<PublicAlbum> {
    let artist: Artist | null = null;
    if (dto.artistId) {
      artist = await this.artistRepository.findOne({
        where: { id: dto.artistId },
      });
      if (!artist)
        throw new UnprocessableEntityException(
          `Artist with id ${dto.artistId} does not exist`,
        );
    }

    const album = this.albumRepository.create({
      name: dto.name,
      year: dto.year,
      artist: artist ? ({ id: artist.id } as any) : null,
    });

    try {
      const saved = await this.albumRepository.save(album);
      const persisted = await this.albumRepository.findOne({
        where: { id: saved.id },
        relations: ['artist'],
      });
      return this.mapAlbum(persisted || saved);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === '23505') {
        throw new BadRequestException(
          `Album with given data conflicts with DB constraints`,
        );
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<PublicAlbum> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!album) throw new NotFoundException(`Album with id ${id} not found`);

    if (dto.name !== undefined) album.name = dto.name;
    if (dto.year !== undefined) album.year = dto.year;

    if (dto.artistId !== undefined) {
      if (dto.artistId === null) {
        album.artist = null;
      } else {
        const artist = await this.artistRepository.findOne({
          where: { id: dto.artistId },
        });
        if (!artist)
          throw new UnprocessableEntityException(
            `Artist with id ${dto.artistId} does not exist`,
          );
        album.artist = artist;
      }
    }

    try {
      const saved = await this.albumRepository.save(album);
      const persisted = await this.albumRepository.findOne({
        where: { id: saved.id },
        relations: ['artist'],
      });
      return this.mapAlbum(persisted || saved);
    } catch (err) {
      if (err instanceof QueryFailedError && (err as any).code === '23505') {
        throw new BadRequestException(
          `Album with given data conflicts with DB constraints`,
        );
      }
      throw err;
    }
  }

  async deleteById(id: string): Promise<void> {
    await this.findById(id);

    await this.trackRepository
      .createQueryBuilder()
      .update()
      .set({ album: null })
      .where('albumId = :id', { id })
      .execute();

    const result = await this.albumRepository.delete(id);
    const affectedNum = Number((result as any).affected ?? 0);
    if (Number.isNaN(affectedNum) || affectedNum === 0) {
      throw new NotFoundException(`Album with id ${id} not found`);
    }
  }
}
