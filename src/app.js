const express = require('express');

const {useRoutes} = require('./routes');

const app = express();

useRoutes(app);

module.exports = {app};
