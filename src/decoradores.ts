import fastifyJwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";
import type { FastifyJwtNamespace, FastifyJWTOptions } from "@fastify/jwt";
import fastify, { FastifyRequest, FastifyReply } from "fastify";
import * as err from "../src/model/errors-model";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import fp from "fastify-plugin";

export default fastifyPlugin(async function (fastify) {
  fastify.decorate("miObjeto", { valor: "Hello" });
  fastify.decorate("miFuncion", function (nombre: String) {
    return "hola" + nombre;
  });
});

declare module "fastify" {
  interface FastifyInstance {
    miObjeto: { valor: string };
    miFuncion(nombre: string): string;
  }
}

const jwtPlugin = fp<FastifyJWTOptions>(async (fastify, jwtOptions) => {
  if (!jwtOptions.secret)
    throw new err.errorDesconocido("Fala setear el secrte");
  fastify.register(fastifyJwt, jwtOptions);

  fastify.decorate(
    "authenticate",
    async function (req: FastifyRequest, rep: FastifyReply) {
      await req.jwtVerify();
    }
  );
});
