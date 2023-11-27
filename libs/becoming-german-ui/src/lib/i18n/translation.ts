import {
  BedroomSituation,
  bedroomSituationType,
  ChildhoodAge,
  ChildhoodProfile,
  DwellingSituation,
  dwellingSituationType,
  Gender,
  genderType,
  GermanState,
  HomeMoves,
  homeMovesType,
  ParentalSituation,
  parentalSituationType,
  Person,
  SiblingPosition,
  siblingPositionType,
  SiblingState,
  siblingStateType,
} from '@becoming-german/model';
import { pipe } from 'fp-ts/function';
import { toEntries } from 'fp-ts/Record';
import { contramap, Ord } from 'fp-ts/Ord';
import * as A from 'fp-ts/Array';
import { LiteralMeta } from '@becoming-german/tools';

export type LiteralTranslation<T extends string> = () => Record<T, string>;

export const siblings: LiteralTranslation<SiblingState> = () => ({
  none: $localize`:@@childhood.siblings.none:keine`,
  one: $localize`:@@childhood.siblings.one:eins`,
  two: $localize`:@@childhood.siblings.two:zwei`,
  three: $localize`:@@childhood.siblings.three:drei`,
  four: $localize`:@@childhood.siblings.four:vier`,
  five: $localize`:@@childhood.siblings.five:fünf`,
  more: $localize`:@@childhood.siblings.more:mehr als fünf`,
});

export const state: LiteralTranslation<GermanState> = () => ({
  BB: $localize`:@@germany.state.BB:Brandenburg`,
  BE: $localize`:@@germany.state.be:Berlin`,
  BW: $localize`:@@germany.state.bw:Baden-Württemberg`,
  BY: $localize`:@@germany.state.by:Bayern`,
  HB: $localize`:@@germany.state.hb:Bremen`,
  HE: $localize`:@@germany.state.he:Hesse`,
  HH: $localize`:@@germany.state.hh:Hamburg`,
  MV: $localize`:@@germany.state.mv:Mecklenburg-Vorpommern`,
  NI: $localize`:@@germany.state.ni:Niedersachsen`,
  NW: $localize`:@@germany.state.nw:Nordrhinewestfalen`,
  RP: $localize`:@@germany.state.rp:Rhinelandpfalz`,
  SH: $localize`:@@germany.state.sh:Schleswig-Holstein`,
  SL: $localize`:@@germany.state.sl:Saarland`,
  SN: $localize`:@@germany.state.sn:Sachsen`,
  ST: $localize`:@@germany.state.st:Sachsen-Anhalt`,
  TH: $localize`:@@germany.state.th:Thüringen`,
});

const siblingPosition: LiteralTranslation<SiblingPosition> = () => ({
  only: $localize`:@@childhood.siblings.only:Einzelkind`,
  eldest: $localize`:@@childhood.siblings.eldest:das älteste Kind`,
  middle: $localize`:@@childhood.siblings.middle:das mittlere Kind`,
  youngest: $localize`:@@childhood.siblings.youngest:das jüngste Kind`,
});

const bedroomSituation: LiteralTranslation<BedroomSituation> = () => ({
  brother: $localize`:@@childhood.bedroom.with-brother:mit Bruder geteilt`,
  several: $localize`:@@childhood.bedroom.with-several siblings:mit mehreren Geschwistern geteilt`,
  sister: $localize`:@@childhood.bedroom.with-sister:mit Schwester geteilt`,
  own: $localize`:@@childhood.bedroom.own:eigenes`,
  various: $localize`:@@childhood.bedroom.various:Unterschiedlich`,
});

const dwellingSituation: LiteralTranslation<DwellingSituation> = () => ({ 
  city: $localize`:@@childhood.dwelling.city:in einer Großstadt`,
  country: $localize`:@@childhood.dwelling.country:auf dem Land`,
  small_town: $localize`:@@childhood.dwelling.small_town:in einer Stadt`,
  suburb: $localize`:@@childhood.dwelling.suburb:in einer Vorstadt`,
  town: $localize`:@@childhood.dwelling.town:in einer Kleinstadt`,
  village: $localize`:@@childhood.dwelling.village:in einem Dorf`,
  other: $localize`:@@childhood.dwelling.other:irgendwo anders ...`,
});

const gender: LiteralTranslation<Gender> = () => ({
  female: $localize`:@@gender.female:Weiblich`,
  male: $localize`:@@gender.male:Männlich`,
  diverse: $localize`:@@gender.diverse:Divers`,
});

const moves: LiteralTranslation<HomeMoves> = () => ({
  '0': $localize`:@@childhood.moves.never:nie`,
  '1': $localize`:@@childhood.moves.once:einmal`,
  '2': $localize`:@@childhood.moves.twice:zweimal`,
  '2+': $localize`:@@childhood.moves.more_than_twice:mehr als zweimal`,
});

const parents: LiteralTranslation<ParentalSituation> = () => ({
  father: $localize`:@@childhood.parents.father:beim Vater`,
  mother: $localize`:@@childhood.parents.mother:bei der Mutter`,
  other: $localize`:@@childhood.parents.other:nicht bei den Eltern`,
  parents: $localize`:@@childhood.parents.parents:beiden Eltern`,
});

const childhoodAge: LiteralTranslation<ChildhoodAge> = () => ({
  '<5': $localize`:@@childhoodAge.under5:jünger als 5`,
  '5-6': $localize`:@@childhoodAge.5-6:ca. 5 bis 6`,
  '7-8': $localize`:@@childhoodAge.7-8:ca. 7 bis 8`,
  '9-10': $localize`:@@childhoodAge.9-10:ca. 9 bis 10`,
  '10-11': $localize`:@@childhoodAge.10-11:ca. 10 bis 11`,
  '12-13': $localize`:@@childhoodAge.12-13:ca. 12 bis 13`,
  '>13': $localize`:@@childhoodAge.>13:älter als 13`,
});

const translationSort = <T>(o: Ord<T>) => A.sort(contramap((i: [T, string]) => i[0])(o));
export type LiteralPropertyType<T> = T extends string ? T : never;
export type LiteralPropertiesRecord<T> = {
  [K in keyof T]: [LiteralPropertyType<T[K]>, string][];
};

const transFor = <Y extends string>(meta: LiteralMeta<Y>, tr: LiteralTranslation<Y>): [Y, string][] =>
  pipe(tr(), toEntries, translationSort(meta.ord));

export const childhoodProfileTranslations: LiteralPropertiesRecord<
  Omit<ChildhoodProfile, 'id' | 'birthYear' | 'hobby' | 'favoriteColor'>
> = {
  siblings: transFor(siblingStateType, siblings),
  siblingPosition: transFor(siblingPositionType, siblingPosition),
  bedroomSituation: transFor(bedroomSituationType, bedroomSituation),
  dwellingSituation: transFor(dwellingSituationType, dwellingSituation),
  gender: transFor(genderType, gender),
  moves: transFor(homeMovesType, moves),
  parents: transFor(parentalSituationType, parents),
};
// germanState: transFor(germanStateType, state),

export const labels: () => Record<keyof Person, string> = () => ({
  birthYear: $localize`:@@label.birthDate:Geburtsjahr`,
  gender: $localize`:@@label.gender:Geschlecht`,
  siblings: $localize`:@@label.siblings:Geschwister`,
  siblingPosition: $localize`:@@label.siblingPosition:Ich war`,
  bedroomSituation: $localize`:@@label.bedroom:Zimmer`,
  dwellingSituation: $localize`:@@label.dwelling:Wohnsituation`,
  moves: $localize`:@@label.moves:Umgezogen`,
  parents: $localize`:@@label.parents:bei`,
  germanState: $localize`:@@label.state:Wo bist du aufgewachsen?`,
  hobby: '',
  favoriteColor: '',
  book: '',
  grandparents: '',
  holidays: '',
  memory: '',
  party: '',
  song: '',
  speaking_book: '',
  dwellingSituationComment: '',
  id: '',
});

export type TranslationCategory =
  | 'siblings'
  | 'siblingPosition'
  | 'state'
  | 'bedroomSituation'
  | 'dwellingSituation'
  | 'gender'
  | 'moves'
  | 'parents'
  | 'childhoodAge';

const TransTable: Record<TranslationCategory, () => Record<string, string>> = {
  siblings,
  siblingPosition,
  state,
  bedroomSituation,
  dwellingSituation,
  gender,
  moves,
  parents,
  childhoodAge,
};

const keyExistsInRecord =
  (record: Record<string, unknown>) =>
  (key: string): key is keyof typeof record =>
    key in record;

export const fieldTranslation = (category: TranslationCategory, key: string) => {
  const r = TransTable[category]();
  return keyExistsInRecord(r)(key) ? r[key] : '';
};
