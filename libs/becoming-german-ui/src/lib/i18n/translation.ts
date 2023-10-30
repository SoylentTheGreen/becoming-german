import {
  BedroomSituation,
  bedroomSituationType,
  ChildhoodProfile,
  DwellingSituation,
  dwellingSituationType,
  Gender,
  genderType,
  GermanState,
  germanStateType,
  HomeMoves,
  homeMovesType,
  ParentalSituation,
  parentalSituationType,
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


export type LiteralTranslation<T extends string> = Record<T, string>;

export const siblings: LiteralTranslation<SiblingState> = {
  none: $localize`:@@childhood.siblings.none:none`,
  one: $localize`:@@childhood.siblings.one:one`,
  two: $localize`:@@childhood.siblings.two:two`,
  three: $localize`:@@childhood.siblings.three:three`,
  four: $localize`:@@childhood.siblings.four:four`,
  five: $localize`:@@childhood.siblings.five:five`,
  more: $localize`:@@childhood.siblings.more:more than five`,
};

export const state: Record<GermanState, string> = {
  BB: $localize`:@@germany.state.BB:Brandenburg`,
  BE: $localize`:@@germany.state.be:Berlin`,
  BW: $localize`:@@germany.state.bw:Baden Wurttemberg`,
  BY: $localize`:@@germany.state.by:Bavaria`,
  HB: $localize`:@@germany.state.hb:Bremen`,
  HE: $localize`:@@germany.state.he:Hesse`,
  HH: $localize`:@@germany.state.hh:Hamburg`,
  MV: $localize`:@@germany.state.mv:Mecklenburg-Western Pomerania`,
  NI: $localize`:@@germany.state.ni:Lower Saxony`,
  NW: $localize`:@@germany.state.nw:North Rhine-Westphalia`,
  RP: $localize`:@@germany.state.rp:Rhineland-Palatinate`,
  SH: $localize`:@@germany.state.sh:Schleswig-Holstein`,
  SL: $localize`:@@germany.state.sl:Saarland`,
  SN: $localize`:@@germany.state.sn:Saxony`,
  ST: $localize`:@@germany.state.st:Saxony-Anhalt`,
  TH: $localize`:@@germany.state.th:Thuringia`,
} as const;

const siblingPosition: LiteralTranslation<SiblingPosition> = {
  only: $localize`:@@childhood.siblings.only:only child`,
  eldest: $localize`:@@childhood.siblings.eldest:eldest child`,
  middle: $localize`:@@childhood.siblings.eldest:middle child`,
  youngest: $localize`:@@childhood.siblings.eldest:youngest child`,
};

const bedroomSituation: LiteralTranslation<BedroomSituation> = {
  brother: $localize`:@@childhood.bedroom.with-brother:shared with brother`,
  several: $localize`:@@childhood.bedroom.with-several siblings:shared with several siblings`,
  sister: $localize`:@@childhood.bedroom.with-sister:shared with sister`,
  own: $localize`:@@childhood.bedroom.own:own`,
  various: $localize`:@@childhood.bedroom.various:various`,
};

const dwellingSituation: LiteralTranslation<DwellingSituation> = {
  city: $localize`:@@childhood.dwelling.city:in a city`,
  country: $localize`:@@childhood.dwelling.country:in a country`,
  small_town: $localize`:@@childhood.dwelling.small_town:in a small town`,
  suburb: $localize`:@@childhood.dwelling.suburb:in a suburb`,
  town: $localize`:@@childhood.dwelling.town:in a town`,
  village: $localize`:@@childhood.dwelling.village:in a village`,
};

const gender: LiteralTranslation<Gender> = {
  female: $localize`:@@gender.female:Female`,
  male: $localize`:@@gender.male:Male`,
};

const moves: LiteralTranslation<HomeMoves> = {
  '0': $localize`:@@childhood.moves.never:Never`,
  '1': $localize`:@@childhood.moves.once:Once`,
  '2': $localize`:@@childhood.moves.twice:Twice`,
  '2+': $localize`:@@childhood.moves.more_than_twice:More than twice`,
};

const parents: LiteralTranslation<ParentalSituation> = {
  father: $localize`:@@childhood.parents.father:Solo father`,
  mother: $localize`:@@childhood.parents.mother:Solo mother`,
  other: $localize`:@@childhood.parents.other:other`,
  parents: $localize`:@@childhood.parents.parents:Both parents`,
};

const translationSort = <T>(o: Ord<T>) => A.sort(contramap((i: [T, string]) => i[0])(o));
export type LiteralPropertyType<T> = T extends string ? T : never;
export type LiteralPropertiesRecord<T> = {
  [K in keyof T]: [LiteralPropertyType<T[K]>, string][];
};

const transFor = <Y extends string>(meta: LiteralMeta<Y>, tr: LiteralTranslation<Y>): [Y, string][] =>
  pipe(tr, toEntries, translationSort(meta.ord));

export const childhoodProfileTranslations: LiteralPropertiesRecord<Omit<ChildhoodProfile, 'birthDate' | 'hobby' | 'favoriteColor'>> = {
  siblings: transFor(siblingStateType, siblings),
  siblingPosition: transFor(siblingPositionType, siblingPosition),
  bedroomSituation: transFor(bedroomSituationType, bedroomSituation),
  dwellingSituation: transFor(dwellingSituationType, dwellingSituation),
  gender: transFor(genderType, gender),
  moves: transFor(homeMovesType, moves),
  parents: transFor(parentalSituationType, parents),
};
  // germanState: transFor(germanStateType, state),


export const labels = {
  gender: $localize`:@@label.gender:Gender`,
  siblings: $localize`:@@label.siblings:Siblings`,
  siblingPosition: $localize`:@@label.siblingPosition:Sibling Position`,
  bedroomSituation: $localize`:@@label.bedroom:Bedrooms Situation`,
  dwellingSituation: $localize`:@@label.dwelling:Dwelling Location`,
  moves: $localize`:@@label.moves:House Moves`,
  parents: $localize`:@@label.parents:Parental Situation`,
  germanState: $localize`:@@label.state:German State`,
}
