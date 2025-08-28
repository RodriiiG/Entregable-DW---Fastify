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

let ultimoId = usuarios.length+1;

const usuarioSchema ={
    type: "object",
    properties: {
        id_usuario : {type:"number", min:0},
        nombre : {type: "string", minLength:2},
        isAdmin : {type: "boolean"}

    },
    required : ["nombre"],
    additionalProperties: true
}

const usuarioPostSchema ={
    type: "object",
    properties: {
        nombre : {type: "string", minLength:2},
        isAdmin : {type: "boolean", default:false}
    },
    required : ["nombre"],
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


    fastify.post('/usuarios', {
        schema: {
            summary: "Crear usuario",
            description: "Esta ruta permite crear un nuevo usuario",
            tags :["usuarios"],
            body: usuarioPostSchema,
            response: {
                201: usuarioSchema,
            }
        },
        
    },
    async function handler(request,reply) {
        const {nombre, isAdmin} = request.body as {nombre: string, isAdmin: boolean} ;
        const usuario = {
            nombre,
            isAdmin, 
            id_usuario:ultimoId++};
        usuarios.push(usuario);
        reply.code(201);
        return usuario;
     })
};

export default usuariosRoutes;