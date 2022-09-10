const cp = require('node:child_process');

const n = cp.fork(`${__dirname}/child.js`);

n.on('message', (m) => {
  console.log('PARENT got message:', m);
  // n.disconnect();
});

// Causes the child to print: CHILD got message: { hello: 'world' }
n.send({ hello: 'world' });
// n.on('exit', () => {
//   console.log('child process exited');
// });
