const { buildApp } = require("./app");

async function start() {
  try {
    const app = await buildApp();

    const port = process.env.PORT ? Number(process.env.PORT) : 3001;
    const host = process.env.HOST || "0.0.0.0";

    await app.listen({ port, host });
    app.log.info(`Server running at http://${host}:${port}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
}

start();
