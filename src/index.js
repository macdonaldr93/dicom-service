const {createApp} = require('./app');
const {HOST, PORT} = require('./config/server-config');
const {DB_FORCE_SYNC} = require('./config/db-config');
const {db} = require('./db');
const {logger} = require('./logger');

async function main() {
  try {
    logger.debug(`⏳ Attempting database sync`);
    await db.sync({force: DB_FORCE_SYNC});
    logger.debug(`✅ Database synchronized`);

    const app = await createApp();

    app.listen(PORT, HOST, () => {
      logger.info(`🚀 DICOM service ready at ${HOST}:${PORT}`);
    });
  } catch (err) {
    logger.error(`❌ Something went wrong starting the app`);
    logger.error(err);
  }
}

main();
