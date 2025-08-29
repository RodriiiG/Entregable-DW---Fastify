import fastify from 'fastify';
import usuariosRoutes from './src/Rutas/usuarios-routes.ts';
import { Type } from '@sinclair/typebox';
import { error } from 'console';
import type { TypeBoxTypeProvider, FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

const server = fastify().withTypeProvider<TypeBoxTypeProvider>();

server.register(usuariosRoutes);

server.get('/route', {
    schema: {
        querystring: Type.Object({
            foo: Type.Number(),
            bar: Type.String()
        })
    }
}, (request, reply) => {

    const {foo, bar} = request.query;
    reply.send({foo, bar})
})

const iniciarServer = async () => {
    try{
        await server.listen ({ port: 3000, host: '::'})
        console.log("Escuchando...")
    }catch(err){
        server.log.error(err);
        process.exit(1);
    }
}

iniciarServer()