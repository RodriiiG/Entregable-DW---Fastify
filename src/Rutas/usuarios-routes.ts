import type { FastifyInstance, FastifySchema } from "fastify"

type Usuario = {
    id_usuario: number,
    nombre: string,
    isAdmin: boolean;
}

const usuarios : Usuario[] = [
    {id_usuario: 1, nombre: "Jorge", isAdmin: true},
    {id_usuario: 2, nombre: "Rodrigo", isAdmin: false},
    {id_usuario: 3, nombre: "Gastón", isAdmin: false},
];

const usuarioSchema ={
    type: "object",
    properties: {
        id_usuario : {type:"number", min:0},
        nombre : {type: "string", minLength:2},
        isAdmin: {type: "boolean"}

    },
    required : ["nombre", "id_usuario", "isAdmin"],
    additionalProperties: true
}

async function usuariosRoutes (fastify: FastifyInstance, options: object){
    fastify.get('/usuarios',{
        schema:{
            summary: "Ruta de usuarios",
            description: 'Descripción de la ruta de usuarios',
            tags: ["usuarios"],
            querystring: {
                type: "object",
                properties:{
                    nombre : {type: "string", minLength:2 },
                    id_usuario : {type: "number"}
                },
            },
            response: {
                200 : {
                    type : "array",
                    items: usuarioSchema
                }
            }
        },
    },
    async function handler (request,reply) {
        const query = request.query as {nombre:string}
        if(query.nombre) return usuarios.filter(u=>u.nombre==query.nombre)
        return usuarios
    });

    fastify.put('/usuarios/:id',{
        schema:{
            summary: "Editar completamente un usuario",
            description: 'Cambiar nombre de usuario',
            tags: ["usuarios"],
            params: {
                type: "object",
                properties: {
                id: {type: "number"},
                },
                required: ["id"],
                additionalProperties: false
            },
            body: {
                type: "object",
                properties: {
                    nombre: {type: "string"},
                    isAdmin: {type: "boolean"}
                },
                required: ["nombre", "isAdmin"],
                additionalProperties: false
            },
            response: {
                204 : {
                    type : "null",
                },
                404: {
                    type: "null"
                }
            }
        },
    },
    async function handler (request,reply) {
        const {id} = request.params as {id:number}
        const body = request.body as {nombre: string, isAdmin: boolean}

        const usuario = usuarios.find(u => u.id_usuario === id)

        if(!usuario){
            return reply.code(404).send();
        }

        usuario.nombre = body.nombre;
        usuario.isAdmin = body.isAdmin;

        return reply.code(204).send();
    });
};


export default usuariosRoutes;