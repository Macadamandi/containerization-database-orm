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
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    return this.trackService.findById(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateTrackDto) {
    return this.trackService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrackDto) {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    return this.trackService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid track id');
    this.trackService.deleteById(id);
  }
}
