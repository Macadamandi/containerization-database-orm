import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Artist, { eager: true })
  @JoinTable({ name: 'favorites_artists' })
  artists: Artist[];

  @ManyToMany(() => Album, { eager: true })
  @JoinTable({ name: 'favorites_albums' })
  albums: Album[];

  @ManyToMany(() => Track, { eager: true })
  @JoinTable({ name: 'favorites_tracks' })
  tracks: Track[];
}
