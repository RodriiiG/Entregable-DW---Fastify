import fastifyPlugin from 'fastify-plugin'
import * as err from "../model/errors-model.ts";

export default fastifyPlugin(async function (fastify){
    fastify.decorate("miObjeto", {valor: "Hello decorator"})
    fastify.decorate("miFuncion", function(nombre:string){
        return "Hola " + nombre;
    })
})

declare module 'fastify' {
    interface FastifyInstance{
        miObjeto : {valor : string};
        miFuncion(nombre:string) : string
    }
}

