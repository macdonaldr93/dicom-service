const {createApp} = require('./app');
const {db} = require('./db');
const {logger} = require('./logger');

const port = process.env.PORT || 3000;
const forceSync = process.env.FORCE_SYNC === '1';

logger.info(`⏳ Attempting database sync`);

db.sync({force: forceSync})
  .then(() => {
    logger.info(`✅ Database synchronized`);
    return createApp();
  })
  .then((app) => {
    app.listen(port, () => {
      logger.info(`🚀 Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error(`❌ Something went wrong starting the app`);
    logger.error(err);
  });
