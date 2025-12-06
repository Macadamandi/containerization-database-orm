import { Controller, Get, Post, Delete, Param, HttpCode } from '@nestjs/common';
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
  addTrack(@Param('id') id: string) {
    this.favoritesService.addTrack(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    this.favoritesService.removeTrack(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  addAlbum(@Param('id') id: string) {
    this.favoritesService.addAlbum(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    this.favoritesService.removeAlbum(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  addArtist(@Param('id') id: string) {
    this.favoritesService.addArtist(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    this.favoritesService.removeArtist(id);
  }
}
