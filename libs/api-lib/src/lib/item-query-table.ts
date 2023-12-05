import { itemJoinQuery } from './item-join-query';
import { BookItem } from './book-item';
import { SongItem } from './song-item';
import { Grandparents, Holiday, Item, Memory } from '@becoming-german/model';
import { PartyItem } from './party-item';
import { AudioBookItem } from './audio-book-item';

export const itemQueryTable: Record<Item, string> = {
  speaking_book: itemJoinQuery('speaking_book', AudioBookItem),
  book: itemJoinQuery('book', BookItem),
  grandparents: itemJoinQuery('grandparents', Grandparents),
  holidays: itemJoinQuery('holidays', Holiday),
  memory: itemJoinQuery('memory', Memory),
  song: itemJoinQuery('song', SongItem),
  party: itemJoinQuery('party', PartyItem),
};
