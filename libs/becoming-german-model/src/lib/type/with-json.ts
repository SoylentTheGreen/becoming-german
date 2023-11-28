import * as t from 'io-ts';
import { left } from 'fp-ts/Either';

export function withJSON<T extends t.Mixed>(codec: T): t.Type<T['_A'], string, unknown> {
  return new t.Type<T['_A'], string, unknown>(
    `withJSON(${codec.name})`,
    codec.is,
    (u, c) => {
      try {
        // Parse the JSON string before decoding
        const json = typeof u === 'string' ? JSON.parse(u) : u;
        return codec.validate(json, c);
      } catch (error) {
        return left<t.Errors, T['_A']>([
          {
            value: u,
            context: c,
            message: error instanceof Error ? error.message : String(error),
          },
        ]);
      }
    },
    (a) => JSON.stringify(codec.encode(a)), // Encode and then JSON.stringify
  );
}
