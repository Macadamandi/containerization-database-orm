import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Track } from '../../track/entities/track.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column()
  year: number;

  @ManyToOne(() => Artist, (artist) => artist.albums, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  artist: Artist | null;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];
}
