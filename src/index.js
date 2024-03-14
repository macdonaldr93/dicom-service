const {createApp} = require('./app');
const {db} = require('./db');
const {logger} = require('./logger');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const forceSync = process.env.FORCE_SYNC === '1';

async function main() {
  try {
    logger.debug(`⏳ Attempting database sync`);
    await db.sync({force: forceSync});
    logger.debug(`✅ Database synchronized`);

    const app = await createApp();

    app.listen(port, host, () => {
      logger.info(`🚀 DICOM service ready at ${host}:${port}`);
    });
  } catch (err) {
    logger.error(`❌ Something went wrong starting the app`);
    logger.error(err);
  }
}

main();
