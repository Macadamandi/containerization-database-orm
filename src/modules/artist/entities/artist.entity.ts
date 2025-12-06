import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ default: false })
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];
}
