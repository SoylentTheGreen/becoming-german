import * as t from 'io-ts';
import { literalStringArrayTyping } from "@becoming-german/tools";

export const siblingPositions = ['only', 'eldest', 'middle', 'youngest'] as const;

export type SiblingPosition = (typeof siblingPositions)[number];

export const siblingPositionType = literalStringArrayTyping<SiblingPosition>('SiblingPosition', [...siblingPositions]);
