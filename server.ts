import Fastify from "fastify";
import type { FastifyInstance, FastifyListenOptions } from "fastify";
import rootRoutes from "./src/Rutas/rutas.ts";
import exampleRoutes from "./src/Rutas/example.ts";
import swagger from "./src/Plugins/swagger.ts";
import usuariosRoutes from "./src/rutas/usuarios/usuarios-routes.ts";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import sensible from "./src/plugins/sensible.ts";

const loggerOptions = {
  level: "trace",
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

fastify.listen(fastifyListenOptions, (err: any) => {
  if (err) {
    fastify.log.error(err);
    fastify.close();
    process.exit(1);
  }
});
