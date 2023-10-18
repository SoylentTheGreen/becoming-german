import {
  bedroomSituationType,
  genderType,
  Person,
  siblingPositionType,
  siblingStateType
} from "@becoming-german/model";

type PersonTable = {
  id: number;
  sex: number;
  birthDate: string;
  siblings: number | null;
  siblingPosition: number | null;
  bedroomSituation: number | null;
};

const numOrUnknown = <A, K extends keyof A, T>(key: K, mapper: (i: A[K]) => T) => (inp: A) => mapper(inp[key])


export const dbRowToPerson = (row: PersonTable): Partial<Person> => {
  return {
    id             : row.id.toString(),
    birthDate      : row.birthDate,
    gender         : genderType.fromNumber(row.sex),
    siblings       : siblingStateType.fromNumber(row.siblings),
    siblingPosition: siblingPositionType.fromNumber(row.siblingPosition),
    bedroomSituation: bedroomSituationType.fromNumber(row.bedroomSituation)
  };
};
