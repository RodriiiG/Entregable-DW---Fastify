import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Usuario } from "../model/usuarios-model.ts";
import { errorFaltanPermisos } from "../model/errors-model.ts";
import * as err from "../model/errors-model.ts";
import * as func from "../services/usuariorepository.ts";
import { ErrorSchema } from "../model/shared-model.ts";
import { usuarios } from "../services/usuariorepository.ts";
import type { SignOptions } from "@fastify/jwt";
import jwt from "../plugins/jwt.ts";


const tokenPrueba = Buffer.from(JSON.stringify(usuarios)).toString("base64");

export const auth: FastifyPluginAsyncTypebox = async (
  fastify,
  options: object
): Promise<void> => {
  fastify.post(
    "/login",
    {
      schema: {
        summary: "Login",
        description: "Hacer login",
        tags: ["auth"],
        body: Usuario,
        security: [{ bearerAuth: [] }],
      },
    },
    async function handler(request, reply) {
      const payload : Usuario = {
        nombre: "Rodrigo",
        id_usuario: 1,
        isAdmin: true
      }

      const signOptions: SignOptions = {
        expiresIn: "8h",
        notBefore: 1,
      }
      const token = fastify.jwt.sign(payload, signOptions)
      return {token};
    }
  );
  fastify.get(
    "/profile",
    {
      schema: {
        summary: "Ruta Principal",
        description: "Descripcion de la ruta principal",
        tags: ["auth"],
        headers: Type.Object({
          authorization: Type.String(),
        }),
        response: {
          200: Usuario
        },
        security: [{ bearerAuth: [] }],
      },
      onRequest: async(request, reply) => {
        await request.jwtVerify();
      },
    },
    async (request, reply) => {
      return request.user;
    }
  );
};

export default auth;
