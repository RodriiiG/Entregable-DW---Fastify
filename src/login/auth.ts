import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Usuario } from "../model/usuarios-model.ts";
import { errorFaltanPermisos } from "../model/errors-model.ts";
import * as err from "../model/errors-model.ts";
import * as func from "../services/usuariorepository.ts";
import { ErrorSchema } from "../model/shared-model.ts";
import { usuarios } from "../services/usuariorepository.ts";
import type { SignOptions } from "@fastify/jwt";

//const tokenPrueba = Buffer.from(JSON.stringify(usuarios)).toString("base64");

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
        body: Type.Object({
          usuario: Type.String(),
          //password: Type.String(),
        }),
        //security: [{ bearerAuth: [] }],
      },
    },
    async function handler(request, reply) {
      /*const { usuario, password } = request.body as {
        usuario: string;
        password: string;
        isAdmin: boolean;
      };*/

      const payload: Usuario = {
        nombre: "Gasti",
        id_usuario: 5,
        isAdmin: true,
      };

      const signOptions: SignOptions = {
        expiresIn: "8h",
        notBefore: 0,
      };
      const token = fastify.jwt.sign(payload, signOptions);
      //if (password == "contraseña") return { token };
      //reply.code(401);
      return { token };
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
        security: [{ bearerAuth: [] }],
      },
      onRequest: async (request, reply) => {
        await request.jwtVerify();
      },
    },
    async (request, reply) => {
      await request.jwtVerify();
      return request.user;
      /*const token = request.headers.authorization!.slice(7);
      if (!token) throw new err.errorFaltanPermisos("Falta TOKEN");
      const usuario = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
      return usuario;*/
    }
  );
};

export default auth;
