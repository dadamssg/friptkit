const fs = require('fs');
const { arg } = require('./sdk');

(async function () {
  const name = await arg('Name');
  const color = await arg('Color');

  fs.writeFileSync(`${__dirname}/collected.txt`, `Typed: ${name} - ${color}`);
})();
