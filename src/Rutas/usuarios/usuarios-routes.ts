import type { FastifyInstance, FastifySchema } from "fastify";
import { Type } from "@sinclair/typebox";
import type {
  FastifyPluginAsyncTypebox,
  Static,
} from "@fastify/type-provider-typebox";
import { Usuario } from "../../Model/usuarios-model.ts";

const usuarios: Usuario[] = [
  { id_usuario: 1, nombre: "Jorge", isAdmin: true },
  { id_usuario: 2, nombre: "Rodrigo", isAdmin: false },
  { id_usuario: 3, nombre: "Gastón", isAdmin: false },
];

let ultimoId = usuarios.length + 1;

const usuariosRoutes: FastifyPluginAsyncTypebox = async function (
  fastify: FastifyInstance,
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
      const query = request.query as { nombre: string };
      if (query.nombre) return usuarios.filter((u) => u.nombre == query.nombre);
      return usuarios;
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
          204: {
            type: "null",
          },
          404: {
            type: "null",
          },
        },
      },
    },
    async function handler(request, reply) {
      const { id_usuario } = request.params as { id_usuario: number };
      const body = request.body as { nombre: string; isAdmin: boolean };

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
      const { nombre, isAdmin } = request.body as {
        nombre: string;
        isAdmin: boolean;
      };
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
          204: { type: "null" },
          404: { type: "null" },
        },
      },
    },
    async function handler(request, reply) {
      const { id_usuario } = request.params as { id_usuario: number };
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
          404: {
            type: "null",
          },
        },
      },
    },
    async function handler(request, reply) {
      const { id_usuario } = request.params as { id_usuario: number };
      const usuario = usuarios.find((u) => u.id_usuario == id_usuario);
      if (!usuario) {
        return reply.code(404).send();
      }
      return reply.code(200).send(usuario);
    }
  );
};

export default usuariosRoutes;
