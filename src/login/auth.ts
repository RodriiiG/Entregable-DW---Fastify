/*import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Usuario } from "../model/usuarios-model.ts";
import { errorFaltanPermisos } from "../model/errors-model.ts";

const usuarios: Usuario[] = [
  { id_usuario: 1, nombre: "Jorge", isAdmin: true },
  { id_usuario: 2, nombre: "Rodrigo", isAdmin: false },
  { id_usuario: 3, nombre: "Gastón", isAdmin: false },
];

const tokenPrueba = Buffer.from(JSON.stringify(usuarios)).toString("base64");

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
        security: [{ bearerAuth: [] }],
      },
    },
    async function handler(request, reply) {
      const { usuario, password } = request.body as {
        usuario: string;
        password: string;
      };

      const usuarioExiste = usuarios.find((u) => u.nombre === usuario);
      if (password == "contraseña" && usuarioExiste)
        return { token: tokenPrueba };
      reply.code(401);
      return { message: "No autorizado" };
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
    },
    async (request, reply) => {
      const token = request.headers.authorization!.slice(7);
      if (!token) throw new errorFaltanPermisos("Falta TOKEN");
      const usuario = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
      return usuario;
    }
  );
};
export default auth;

onRequest: async function (request, reply) {
      const token = request.headers.authorization?.slice(7);
      if (!token) {
        reply.code(401);
        return { message: "No autorizado" };
      }
      const usuario = JSON.parse(
        Buffer.from(token, "base64").toString("utf-8")
      );
      request.user = usuario;
    },*/
