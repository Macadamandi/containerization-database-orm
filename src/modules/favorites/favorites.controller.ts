import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './interfaces/favorites.interface';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAll(): Promise<FavoritesResponse> {
    return await this.favoritesService.getAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrack(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbum(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtist(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    await this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    await this.favoritesService.removeArtist(id);
  }
}
