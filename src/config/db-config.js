const DB_FORCE_SYNC = process.env.DB_FORCE_SYNC === '1';

const DB_CONFIG = {
  dialect: 'sqlite',
};

switch (process.env.NODE_ENV) {
  case 'development': {
    DB_CONFIG.storage = 'db/dicom-development.sqlite';
    break;
  }
  case 'test': {
    DB_CONFIG.storage = 'db/dicom-test.sqlite';
    DB_CONFIG.logging = false;
    break;
  }
  case 'production': {
    DB_CONFIG.storage = 'db/dicom-production.sqlite';
    break;
  }
}

module.exports = {DB_CONFIG, DB_FORCE_SYNC};
