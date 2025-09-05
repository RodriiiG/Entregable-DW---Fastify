import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";
import type {FastifyJwtNamespace, FastifyJWTOptions} from "@fastify/jwt"
import { Usuario } from "../model/usuarios-model.ts";
import type { FastifyRequest, FastifyReply } from "fastify";

export default fastifyPlugin(async function (fastify){
    const secret = process.env.FASTIFY_SECRET;
    const jwtOptions: FastifyJWTOptions = {
        secret: secret || ""
    }
    fastify.register(fastifyJwt, jwtOptions)

    fastify.decorate("autenthicate", async function (request:FastifyRequest, reply:FastifyReply){
        await request.jwtVerify()
    })
});

declare module 'fastify' {
    interface FastifyInstance extends 
    FastifyJwtNamespace<{namespace:'security'}>{
        autenthicate(request:FastifyRequest, reply:FastifyReply):Promise<void>
    }
    
}

declare module "@fastify/jwt"{
    interface FastifyJWT{
        payload: Usuario;
        user: Usuario;
    }
}

