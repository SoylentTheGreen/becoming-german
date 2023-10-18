import { typeUtil } from "@becoming-german/tools";

export const genders = ["male", "female"] as const;
export type Gender = (typeof genders)[number];
export const genderType = typeUtil(genders);
