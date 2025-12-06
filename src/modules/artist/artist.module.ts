import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';

@Module({
  imports: [
    TrackModule,
    AlbumModule,
    TypeOrmModule.forFeature([Artist, Track, Album]),
  ],
  providers: [ArtistService],
  controllers: [ArtistController],
  exports: [ArtistService],
})
export class ArtistModule {}
