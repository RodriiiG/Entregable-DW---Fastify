import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";
import type { FastifyJwtNamespace, FastifyJWTOptions } from "@fastify/jwt";
import { Usuario } from "../model/usuarios-model.ts";

export default fastifyPlugin(async function (fastify) {
  const secret = process.env.FASTIFY_SECRET;

  const jwtOptions: FastifyJWTOptions = {
    secret: secret || "",
  };
  fastify.register(fastifyJwt, jwtOptions);
});

declare module "fastify" {
  interface FastifyInstance
    extends FastifyJwtNamespace<{ namespace: "security" }> {}
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    playload: Usuario;
    user: Usuario;
  }
}
