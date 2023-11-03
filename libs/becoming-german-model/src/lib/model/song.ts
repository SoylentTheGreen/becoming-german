import * as t from 'io-ts';
import { childhoodAgeType } from './childhood-age';

export const songProps = {
    title: t.string,
    artist: t.string,
    reason: t.string,
    text: t.string,
    melody: t.string,
    listeningSituation: t.string,
    ageWhenImportant: childhoodAgeType.literals,
};
export const Song = t.exact(t.type(songProps));

