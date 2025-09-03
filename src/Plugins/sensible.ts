import fastifySensible from "@fastify/sensible";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function sensiblePlugin(fastify) {
  fastify.register(fastifySensible);
});
