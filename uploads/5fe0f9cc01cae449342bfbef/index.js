const express = require('express');
const app = express();

app.use(require('./user'))
app.use(require('./login'))
app.use(require('./files&dirs'))
app.use(require('./share'))
app.use(require('./getFiles.js'))


module.exports = app
