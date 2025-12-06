import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Album, Track])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
