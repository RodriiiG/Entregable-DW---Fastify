import type { FastifyInstance, FastifySchema } from "fastify";

type Usuario = {
  id_usuario: number;
  nombre: string;
  isAdmin: boolean;
};

const usuarios: Usuario[] = [
  { id_usuario: 1, nombre: "Jorge", isAdmin: true },
  { id_usuario: 2, nombre: "Rodrigo", isAdmin: false },
  { id_usuario: 3, nombre: "Gastón", isAdmin: false },
];

let ultimoId = usuarios.length + 1;

const usuarioSchema = {
  type: "object",
  properties: {
    id_usuario: { type: "number", min: 0 },
    nombre: { type: "string", minLength: 2 },
    isAdmin: { type: "boolean" },
  },
  required: ["nombre"],
  additionalProperties: true,
};

const usuarioPostSchema = {
  type: "object",
  properties: {
    nombre: { type: "string", minLength: 2 },
    isAdmin: { type: "boolean", default: false },
  },
  required: ["nombre"],
  additionalProperties: true,
};

async function usuariosRoutes(fastify: FastifyInstance, options: object) {
  fastify.get(
    "/usuarios",
    {
      schema: {
        summary: "Ruta de usuarios",
        description: "Descripción de la ruta de usuarios",
        tags: ["usuarios"],
        querystring: {
          type: "object",
          properties: {
            nombre: { type: "string", minLength: 2 },
          },
        },
        response: {
          200: {
            type: "array",
            items: usuarioSchema,
          },
        },
      },
    },
    async function handler(request, reply) {
      const query = request.query as { nombre: string };
      if (query.nombre) return usuarios.filter((u) => u.nombre == query.nombre);
      return usuarios;
    }
  );

  fastify.post(
    "/usuarios",
    {
      schema: {
        summary: "Crear usuario",
        description: "Esta ruta permite crear un nuevo usuario",
        tags: ["usuarios"],
        body: usuarioPostSchema,
        response: {
          201: usuarioSchema,
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
    "/usuarios/:id",
    {
      schema: {
        summary: "Eliminar usuario",
        description: "Esta ruta permite eliminar un usuario",
        tags: ["usuarios"],
        params: {
            type: "object",
            properties: {
                id:{
                    type:"number"
                }
            },
            required: ["id"],
        },
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
      const { id } = request.params as { id: number };
      const index = usuarios.findIndex((u) => u.id_usuario == id);
      if (index === -1) {
        return reply.code(404).send();
      }
      usuarios.splice(index, 1);
      return reply.code(204).send();
    }
  );
    fastify.get(
    "/usuarios/:id",
    {
      schema: {
        summary: "Encontrar usuario en específico",
        description: "Esta ruta permite encontrar un usuario por su ID",
        tags: ["usuarios"],
        params: {
          type: "object",
          properties: {
            id: { 
                type: "number"},
          },
        },
        response: {
          200: usuarioSchema,
          404: {
            type: "null"
          },
        },
    },
},
    async function handler(request, reply) {
      const { id } = request.params as { id: number };
      const usuario = usuarios.find((u) => u.id_usuario == id);
      if (!usuario) {
        return reply.code(404).send();
      }
      return reply.code(200).send(usuario);
 
    }
  );
}

export default usuariosRoutes;
