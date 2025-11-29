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

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    return this.albumService.findById(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateAlbumDto) {
    return this.albumService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    return this.albumService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid album id');
    this.albumService.deleteById(id);
  }
}
