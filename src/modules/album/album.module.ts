import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from './entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Track, Artist])],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
