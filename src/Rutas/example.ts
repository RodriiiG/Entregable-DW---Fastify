import type { FastifyInstance, FastifySchema } from "fastify";

async function exampleRoutes (fastify: FastifyInstance, options: object) {
     fastify.get('/example',{
        schema: {
            summary: "Ruta de Ejemplo",
            description: 'Descripción de la ruta de ejemplo',
            tags: ["examples"],
        }as FastifySchema
    },
    async (request,reply) =>{
        return {hello: "world"}
    })
}

export default exampleRoutes;