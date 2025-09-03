import type { FastifyInstance, FastifySchema } from "fastify";
import { Type } from "@sinclair/typebox";
import type {
  FastifyPluginAsyncTypebox,
  Static,
} from "@fastify/type-provider-typebox";
import { Usuario } from "../../model/usuarios-model.ts";
import * as func from "../../services/uuuu.ts";

const usuariosRoutes: FastifyPluginAsyncTypebox = async function (
  fastify,
  options: object
) {
  fastify.get(
    "/usuarios",
    {
      schema: {
        summary: "Ruta de usuarios",
        description: "Descripción de la ruta de usuarios",
        tags: ["usuarios"],
        querystring: Type.Object({
          nombre: Type.Optional(Type.String({ minLength: 2 })),
        }),
        response: {
          200: Type.Array(Usuario),
        },
      },
    },
    async (request, reply) => {
      const { nombre } = request.query;
      return func.getOneBy({ nombre } as Omit<Usuario, "isAdmin" | >);
    }
  );

  fastify.get(
    "/usuarios/:id_usuario",
    {
      schema: {
        summary: "Encontrar usuario en específico",
        description: "Esta ruta permite encontrar un usuario por su ID",
        tags: ["usuarios"],
        params: Type.Pick(Usuario, ["id_usuario"]),
        response: {
          200: Usuario,
          404: Type.Null(),
        },
      },
    },
    async (request, reply) => {
      const busc = await func.getByID(request.params.id_usuario);
      return busc ? busc : reply.code(404).send();
    }
  );

  /*
  fastify.put(
    "/usuarios/:id_usuario",
    {
      schema: {
        summary: "Editar completamente un usuario",
        description: "Cambiar nombre de usuario y determinar isAdmin",
        tags: ["usuarios"],
        params: Type.Pick(Usuario, ["id_usuario"]),
        body: Type.Pick(Usuario, ["isAdmin", "nombre"]),
        response: {
          204: Type.Null(),
          404: Type.Null(),
        },
      },
    },
    async function handler(request, reply) {
      const { id_usuario } = request.params;
      const body = request.body;

      const usuario = usuarios.find((u) => u.id_usuario === id_usuario);

      if (!usuario) {
        return reply.code(404).send();
      }

      usuario.nombre = body.nombre;
      usuario.isAdmin = body.isAdmin;

      return reply.code(204).send();
    }
  );*/

  fastify.post(
    "/usuarios",
    {
      schema: {
        summary: "Crear usuario",
        description: "Esta ruta permite crear un nuevo usuario",
        tags: ["usuarios"],
        body: Type.Omit(Usuario, ["id_usuario"]),
        response: {
          201: Usuario,
        },
      },
    },
    async function handler(request, reply) {
      const nuevo = await func.create(request.body);
      return reply.code(201).send(nuevo);
    }
  );

  fastify.delete(
    "/usuarios/:id_usuario",
    {
      schema: {
        summary: "Eliminar usuario",
        description: "Esta ruta permite eliminar un usuario",
        tags: ["usuarios"],
        params: Type.Pick(Usuario, ["id_usuario"]),
        response: {
          204: Type.Null(),
          404: Type.Null(),
        },
      },
    },
    async function handler(request, reply) {
      const id_usuario = await func.getByID(request.params.id_usuario);
      await func.erase(request.params.id_usuario);
      return id_usuario ? reply.code(204).send() : reply.code(404).send();
    }
  );
};

export default usuariosRoutes;
