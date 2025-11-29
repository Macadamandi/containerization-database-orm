import { Artist } from 'src/modules/artist/interfaces/artist.interface';
import { Album } from 'src/modules/album/interfaces/album.interface';
import { Track } from 'src/modules/track/interfaces/track.interface';

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
