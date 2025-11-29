import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as isUUID } from 'uuid';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    const artist = this.artistService.findById(id);
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist;
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateArtistDto) {
    return this.artistService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    const artist = this.artistService.update(id, dto);
    if (!artist) throw new NotFoundException(`Artist with id ${id} not found`);
    return artist;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    this.artistService.delete(id);
  }
}
