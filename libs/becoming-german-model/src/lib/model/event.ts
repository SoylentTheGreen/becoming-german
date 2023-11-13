import * as t from 'io-ts';
import { v4 as uuid } from 'uuid';
import { UUID } from 'io-ts-types';

// Define a generic type for Event Data
export const WithIdC = t.type({id: UUID});
export type WithId = t.TypeOf<typeof WithIdC> & t.Mixed;

export const EventData = <T extends t.Mixed>(dataType: T) => dataType;

// Define the EventStoreEntry type
export const EventStoreEntry = <T extends t.Mixed>(dataType: T) =>
  t.type({
    eventType: t.string,
    aggregateId: t.union([t.string, t.number]),
    aggregateType: t.string,
    eventTimestamp: t.number, // Assuming ISO date string format
    eventData: EventData(dataType),
    version: t.number,
  });

// Example of a specific event data type

// Specific event type
type EventStoreEntryType<T> = {
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  eventTimestamp: string;
  eventData: T; // Assuming UserData is the passed type
  version: number;
  metadata: Record<string, unknown> | undefined;
};
export const creationEventFactory = <T extends WithId>(dataType: T, eventType: string = `${dataType.name}:created`) => {
  const codec = EventStoreEntry(dataType);
  return (eventData: t.TypeOf<T>) => {
    const fields = {
      eventType,
      aggregateId: eventData.id,
      eventTimestamp: Date.now(),
      aggregateType : dataType.name,
      eventData,
      version: 1,
    };
    return codec.decode(fields);
  }
};
