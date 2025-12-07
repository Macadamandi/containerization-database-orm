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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate as isUUID } from 'uuid';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    return await this.trackService.findById(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTrackDto): Promise<any> {
    return await this.trackService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrackDto,
  ): Promise<any> {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    return await this.trackService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(@Param('id') id: string): Promise<void> {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    await this.trackService.deleteById(id);
  }
}
