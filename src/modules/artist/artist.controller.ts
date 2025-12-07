import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import { ArtistService, PublicArtist } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { validate as isUUID } from 'uuid';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @HttpCode(200)
  async findAll(): Promise<PublicArtist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  async findById(@Param('id') id: string): Promise<PublicArtist> {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    return this.artistService.findById(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateArtistDto): Promise<PublicArtist> {
    return this.artistService.create(dto);
  }

  @Put(':id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArtistDto,
  ): Promise<PublicArtist> {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    return this.artistService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    if (!isUUID(id)) throw new BadRequestException('Invalid artist id');
    await this.artistService.delete(id);
  }
}
