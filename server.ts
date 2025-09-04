import Fastify from "fastify";
import type { FastifyInstance, FastifyListenOptions } from "fastify";
import rootRoutes from "./src/rutas/rutas.ts";
import exampleRoutes from "./src/rutas/example.ts";
import swagger from "./src/plugins/swagger.ts";
import usuariosRoutes from "./src/rutas/usuarios/usuarios-routes.ts";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import sensible from "./src/plugins/sensible.ts";
import { auth } from "./src/rutas/login/auth.ts";
const loggerOptions = {
  level: process.env.FASTIFY_LOG_LEVEL || "trace",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
};

const fastifyOptions = {
  logger: loggerOptions,
  ignoreTrailingSlash: true,
  bodyLimit: 1048576,
  pluginTimeOut: 10000,
  maxParamLength: 100,
  disableRequestLogging: false,
  caseSensitive: true,
};

const fastifyListenOptions: FastifyListenOptions = {
  port: 3000,
  host: "::",
};

const fastify: FastifyInstance =
  Fastify(fastifyOptions).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(sensible);
fastify.register(swagger);
fastify.register(rootRoutes);
fastify.register(exampleRoutes);
fastify.register(usuariosRoutes);
fastify.register(auth);

await fastify.listen(fastifyListenOptions, (err: any) => {
  if (err) {
    fastify.log.error(err);
    fastify.close();
    process.exit(1);
  }
});

fastify.log.trace("Trace")
fastify.log.debug("Debug")
fastify.log.info("Info")
fastify.log.warn("Warn")
fastify.log.error("Error");
fastify.log.fatal("Fatal")





