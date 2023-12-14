import { ChildhoodSituation } from '@becoming-german/model';
import { contramap, Ord } from 'fp-ts/Ord';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as O from 'fp-ts/Option';

export const Translations = () => ({
  siblings: {
    none: $localize`:@@childhood.siblings.none:keine`,
    one: $localize`:@@childhood.siblings.one:eins`,
    two: $localize`:@@childhood.siblings.two:zwei`,
    three: $localize`:@@childhood.siblings.three:drei`,
    four: $localize`:@@childhood.siblings.four:vier`,
    five: $localize`:@@childhood.siblings.five:fünf`,
    more: $localize`:@@childhood.siblings.more:mehr als fünf`,
  },
  germanState: {
    BB: $localize`:@@germany.state.BB:Brandenburg`,
    BE: $localize`:@@germany.state.be:Berlin`,
    BW: $localize`:@@germany.state.bw:Baden-Württemberg`,
    BY: $localize`:@@germany.state.by:Bayern`,
    HB: $localize`:@@germany.state.hb:Bremen`,
    HE: $localize`:@@germany.state.he:Hessen`,
    HH: $localize`:@@germany.state.hh:Hamburg`,
    MV: $localize`:@@germany.state.mv:Mecklenburg-Vorpommern`,
    NI: $localize`:@@germany.state.ni:Niedersachsen`,
    NW: $localize`:@@germany.state.nw:Nordrhein-Westfalen`,
    RP: $localize`:@@germany.state.rp:Rhinelandpfalz`,
    SH: $localize`:@@germany.state.sh:Schleswig-Holstein`,
    SL: $localize`:@@germany.state.sl:Saarland`,
    SN: $localize`:@@germany.state.sn:Sachsen`,
    ST: $localize`:@@germany.state.st:Sachsen-Anhalt`,
    TH: $localize`:@@germany.state.th:Thüringen`,
  },

  siblingPosition: {
    only: $localize`:@@childhood.siblings.only:Einzelkind`,
    eldest: $localize`:@@childhood.siblings.the eldest:das älteste Kind`,
    middle: $localize`:@@childhood.siblings.middle:das mittlere Kind`,
    youngest: $localize`:@@childhood.siblings.youngest:das jüngste Kind`,
  },

  bedroomSituation: {
    brother: $localize`:@@childhood.bedroom.with-brother:mit Bruder geteilt`,
    several: $localize`:@@childhood.bedroom.with-several siblings:mit mehreren Geschwistern geteilt`,
    sister: $localize`:@@childhood.bedroom.with-sister:mit Schwester geteilt`,
    own: $localize`:@@childhood.bedroom.own:eigenes`,
    various: $localize`:@@childhood.bedroom.various:Unterschiedlich`,
  },

  dwellingSituation: {
    city: $localize`:@@childhood.dwelling.city:in einer Großstadt`,
    country: $localize`:@@childhood.dwelling.country:auf dem Land`,
    small_town: $localize`:@@childhood.dwelling.small_town:in einer Stadt`,
    suburb: $localize`:@@childhood.dwelling.suburb:in einer Vorstadt`,
    town: $localize`:@@childhood.dwelling.town:in einer Kleinstadt`,
    village: $localize`:@@childhood.dwelling.village:in einem Dorf`,
    other: $localize`:@@childhood.dwelling.other:irgendwo anders ...`,
  },

  gender: {
    female: $localize`:@@gender.female:weiblich`,
    male: $localize`:@@gender.male:männlich`,
    diverse: $localize`:@@gender.diverse:divers`,
  },

  moves: {
    '0': $localize`:@@childhood.moves.never:nie`,
    '1': $localize`:@@childhood.moves.once:einmal`,
    '2': $localize`:@@childhood.moves.twice:zweimal`,
    '2+': $localize`:@@childhood.moves.more_than_twice:mehr als zweimal`,
  },

  parents: {
    father: $localize`:@@childhood.parents.father:beim Vater`,
    mother: $localize`:@@childhood.parents.mother:bei der Mutter`,
    other: $localize`:@@childhood.parents.other:nicht bei den Eltern`,
    parents: $localize`:@@childhood.parents.parents:beiden Eltern`,
  },

  childhoodAge: {
    '<5': $localize`:@@childhoodAge.under5:jünger als 5`,
    '5-6': $localize`:@@childhoodAge.5-6:ca. 5 bis 6`,
    '7-8': $localize`:@@childhoodAge.7-8:ca. 7 bis 8`,
    '9-10': $localize`:@@childhoodAge.9-10:ca. 9 bis 10`,
    '10-11': $localize`:@@childhoodAge.10-11:ca. 10 bis 11`,
    '12-13': $localize`:@@childhoodAge.12-13:ca. 12 bis 13`,
    '>13': $localize`:@@childhoodAge.>13:älter als 13`,
  },
});
const translationSort = <T>(o: Ord<T>) => A.sort(contramap((i: [T, string]) => i[0])(o));
export type LiteralPropertyType<T> = T extends string ? T : never;

export type LiteralPropertiesEntries<T> = {
  [K in keyof T]: [LiteralPropertyType<T[K]>, string][];
};

// const transFor = <Y extends string>(meta: LiteralMeta<Y>, tr: LiteralTranslation<Y>): [Y, string][] =>
//   pipe(tr, toEntries, translationSort(meta.ord));

export type CPOptions = Omit<ChildhoodSituation, 'birthYear'>;
// export const childhoodProfileTranslations: LiteralPropertiesEntries<CPOptions> = {
//   siblings         : transFor(siblingStateType, siblings()),
//   siblingPosition  : transFor(siblingPositionType, siblingPosition),
//   bedroomSituation : transFor(bedroomSituationType, bedroomSituation),
//   dwellingSituation: transFor(dwellingSituationType, dwellingSituation),
//   gender           : transFor(genderType, gender()),
//   moves            : transFor(homeMovesType, moves),
//   parents          : transFor(parentalSituationType, parents),
//   germanState      : transFor(germanStateType, germanState),
// };
// export const childhoodProfileTranslationsMapped = {
//   siblings: siblings(),
//   siblingPosition,
//   bedroomSituation,
//   dwellingSituation,
//   gender  : gender(),
//   moves,
//   parents,
//   germanState,
// };
//
// export const OptionsTable = {
//   siblings,
//   siblingPosition  : () => siblingPosition,
//   bedroomSituation : () => bedroomSituation,
//   dwellingSituation: () => dwellingSituation,
//   moves            : () => moves,
//   parents          : () => parents,
//   germanState      : () => germanState,
//   gender,
// };

// germanState: transFor(germanStateType, state),

export const labels: () => Record<keyof ChildhoodSituation, string> = () => ({
  birthYear: $localize`:@@label.birthDate:Geburtsjahr`,
  gender: $localize`:@@label.gender:Geschlecht`,
  siblings: $localize`:@@label.siblings:Geschwister`,
  siblingPosition: $localize`:@@label.siblingPosition:Ich war`,
  bedroomSituation: $localize`:@@label.bedroom:Zimmer`,
  dwellingSituation: $localize`:@@label.dwelling:Wohnsituation`,
  moves: $localize`:@@label.moves:Umgezogen`,
  parents: $localize`:@@label.parents:bei`,
  germanState: $localize`:@@label.state:Wo bist du aufgewachsen?`,
  softToy: $localize`:@@label.softToy:Lieblingsstofftier`,
  hatedFood: $localize`:@@label.hatedFood:Hass-Essen`,
  hobby: $localize`:@@label.hobby:Hobby`,
  favoriteColor: $localize`:@@label.favoriteColor:Lieblingsfarbe`,
  book: '',
  grandparents: '',
  holidays: '',
  memory: '',
  party: '',
  song: '',
  audioBook: '',
  dwellingSituationComment: '',
  id: '',
});
// export const TestTrans = () => {
//   return childhoodProfileTranslationsMapped;
// };

export type TranslationCategory =
  | 'siblings'
  | 'siblingPosition'
  | 'bedroomSituation'
  | 'dwellingSituation'
  | 'gender'
  | 'moves'
  | 'parents'
  | 'childhoodAge'
  | 'germanState';

// const TransTable: Record<TranslationCategory, Record<string, string>> = {
//   siblings: siblings(),
//   siblingPosition,
//   germanState,
//   bedroomSituation,
//   dwellingSituation,
//   gender  : gender(),
//   moves,
//   parents,
//   childhoodAge,
// };




// export const fieldTranslation = (category: TranslationCategory, key: string) => {
//   const r = TransTable[category];
//   return keyExistsInRecord(r)(key) ? r[key] : '';
// };

export const getOpt = (key: string, field: string) =>
  pipe(
    Translations(),
    R.lookup(key),
    O.chain(R.lookup(field)),
    O.getOrElse(() => '--'),
  );

export const getOptions = (key: string): [string, string][] =>
  pipe(
    Translations(),
    R.lookup(key),
    O.map((v: Record<string, string>) => Object.entries(v)),
    O.fold(() => [], r => r)
  );


export const getLabel = (key: string): string => pipe(
  labels(),
  R.lookup(key),
  O.getOrElse(() => '')
)
