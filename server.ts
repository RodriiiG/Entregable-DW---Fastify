import Fastify from "fastify";
import rootRoutes from "./src/Rutas/rutas.ts";
import exampleRoutes from "./src/Rutas/example.ts";
import swagger from "./src/Plugins/swagger.ts";
import usuariosRoutes from "./src/rutas/usuarios/usuarios-routes.ts";

const fastify = Fastify({
  logger: true,
});

fastify.register(swagger);
fastify.register(rootRoutes);
fastify.register(exampleRoutes);
fastify.register(usuariosRoutes);

//Iniciar la escucha

try {
  await fastify.listen({
    host: "::",
    port: 3000,
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
