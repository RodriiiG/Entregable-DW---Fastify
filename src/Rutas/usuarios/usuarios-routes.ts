import type { FastifyInstance, FastifySchema } from "fastify";
import { Type } from "@sinclair/typebox";
import type {
  FastifyPluginAsyncTypebox,
  Static,
} from "@fastify/type-provider-typebox";
import { Usuario } from "../../model/usuarios-model.ts";
import {getAll, getById, getOneBy, findAll} from "../../services/usuariorepository.ts"

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
      const query = request.query;
      if (query.nombre) return findAll(query);
      return getAll();
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
      const { nombre, isAdmin } = request.body;
      const usuario = {
        nombre,
        isAdmin,
        id_usuario: ultimoId++,
      };
      usuarios.push(usuario);
      return reply.code(201).send(usuario);
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
      const { id_usuario } = request.params;
      const index = usuarios.findIndex((u) => u.id_usuario == id_usuario);
      if (index === -1) {
        return reply.code(404).send();
      }
      usuarios.splice(index, 1);
      return reply.code(204).send();
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
    async function handler(request, reply) {
      const { id_usuario } = request.params;
      reply.code(200)
      return getById(id_usuario);
    });
};

export default usuariosRoutes;
