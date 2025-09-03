import type { FastifyInstance, FastifySchema } from "fastify";
import { Type } from "@sinclair/typebox";
import type {
  FastifyPluginAsyncTypebox,
  Static,
} from "@fastify/type-provider-typebox";

export const Usuario = Type.Object(
  {
    id_usuario: Type.Integer(),
    nombre: Type.String({ minLength: 2 }),
    isAdmin: Type.Boolean(),
  },
  { additionalProperties: false }
);

export type Usuario = Static<typeof Usuario>;
