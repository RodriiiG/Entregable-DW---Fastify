import type { FastifyInstance, FastifySchema } from "fastify";
import { Type } from "@sinclair/typebox";
import type {
  FastifyPluginAsyncTypebox,
  Static,
} from "@fastify/type-provider-typebox";
import { Usuario } from "../../model/usuarios-model.ts";
import {
  getAll,
  getById,
  getOneBy,
  findAll,
  create,
  erase,
  update,
} from "../../services/usuariorepository.ts";
import {
  errorDesconocido,
  errorNoEncontrado,
  errorNoAutenticado,
  errorFaltanPermisos,
  bdConnectionError,
} from "../../model/errors-model.ts";
import { ErrorSchema } from "../../model/shared-model.ts";

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
    async function handler(request, reply) {
      const nombre = request.query.nombre;
      if (nombre) {
        const usuarios = await findAll({ nombre });
        return reply.code(200).send(usuarios);
      }

      return reply.code(200).send(await getAll());
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
          404: ErrorSchema,
        },
      },
    },
    async function handler(request, reply) {
      const usuario = await getById(request.params.id_usuario);
      if (!usuario) throw new errorNoEncontrado();
      reply.code(200).send(usuario);
    }
  );

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
          404: ErrorSchema,
        },
      },
    },
    async function handler(request, reply) {
      const { id_usuario } = request.params;
      const body = request.body;
      const usuario = await update(id_usuario, body);
      if (!usuario) throw new errorNoEncontrado();
      reply.code(204).send();
    }
  );

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
      const nuevousuario = await create(request.body);
      return reply.code(201).send(nuevousuario);
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
          404: ErrorSchema,
        },
      },
    },
    async function handler(request, reply) {
      const usuario = await getById(request.params.id_usuario);
      if (!usuario) {
        throw new errorNoEncontrado();
      }
      await erase(request.params.id_usuario);
      return reply.code(204).send();
    }
  );
};

export default usuariosRoutes;
