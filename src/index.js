const {app} = require('./app');
const {db} = require('./db');

const port = process.env.PORT || 3000;
const forceSync = process.env.FORCE_SYNC === '1';

console.log(`⏳ Attempting database sync`);

db.sync({force: forceSync})
  .then(() => {
    console.log(`✅ Database synchronized`);

    app.listen(port, () => {
      console.log(`🚀 Example app listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(`❌ Database failed to sync`);
    console.error(err);
  });
