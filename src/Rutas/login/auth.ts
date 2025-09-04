import fastify from "fastify";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import type { FastifyInstance, FastifySchema } from "fastify";
import { Usuario } from "../../model/usuarios-model.ts";
import {
  errorDesconocido,
  errorNoEncontrado,
  errorNoAutenticado,
  errorFaltanPermisos,
  bdConnectionError,
} from "../../model/errors-model.ts";
const usuarioPrueba = {
  nombre: "Gaston",
  roles: ["usuario", "admin"],
};

const tokenPrueba = Buffer.from(JSON.stringify(usuarioPrueba)).toString(
  "base64"
);

export const auth: FastifyPluginAsyncTypebox = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post(
    "/login",
    {
      schema: {
        summary: "Login",
        description: "Hacer login",
        tags: ["auth"],
        body: Type.Object({
          usuario: Type.String(),
          password: Type.String(),
        }),
        response: {
          200: { token: Type.String() },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const usuario: Usuario = {
        nombre: "Rodrigo",
        id_usuario: 1,
        isAdmin: true,
      };
      const token = Buffer.from(JSON.stringify(usuario)).toString("base64");
      return token;
    }
  );

  fastify.get(
    "/profile",
    {
      schema: {
        summary: "Ruta Principal",
        description: "Descripción de la ruta principal",
        tags: ["auth"],
        headers: Type.Object({
          authorization: Type.String(),
        }),
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const token = request.headers.authorization?.slice(7);
      if (!token) throw new errorNoAutenticado("Falta token ");
      const usuario = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
      return usuario;
    }
  );
};
export default auth;
