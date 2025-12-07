import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { validate as isUUID } from 'uuid';

type PublicAlbum = {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
};

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<PublicAlbum[]> {
    return await this.albumService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findById(@Param('id') id: string): Promise<PublicAlbum> {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    return await this.albumService.findById(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateAlbumDto): Promise<PublicAlbum> {
    return await this.albumService.create(dto);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAlbumDto,
  ): Promise<PublicAlbum> {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    return await this.albumService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(@Param('id') id: string): Promise<void> {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    await this.albumService.deleteById(id);
  }
}
