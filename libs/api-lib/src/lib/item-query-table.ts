import { BookItem } from './book-item';
import { SongItem } from './song-item';
import { Grandparents, Holiday } from '@becoming-german/model';
import { PartyItem } from './party-item';
import { AudioBookItem } from './audio-book-item';
import { itemJoinQuery } from './item-join-query';

export const itemQueryTable: Record<string, string> = {
  audioBook: itemJoinQuery('audioBook', AudioBookItem),
  book: itemJoinQuery('book', BookItem),
  grandparents: itemJoinQuery('grandparents', Grandparents),
  holidays: itemJoinQuery('holidays', Holiday),
  memory: `diverse`,
  song: itemJoinQuery('song', SongItem),
  party: itemJoinQuery('party', PartyItem),
};
