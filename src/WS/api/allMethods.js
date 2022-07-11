'use strict';

const fs = require('fs');
const path = require('path');

module.exports = () => new Promise((resolve, reject) => {
  fs.readdir('./api', (err, files) => {
    if (err) {
      console.error(err);
      return reject(JSON.stringify(err));
    }
    resolve(JSON.stringify(files.map((file) =>
      path.basename(file, '.js')))
    );
  });
});
