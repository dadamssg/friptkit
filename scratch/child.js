process.on('message', (m) => {
  console.log('CHILD got message:', m);
});

// Causes the parent to print: PARENT got message: { foo: 'bar', baz: null }
process.send({ foo: 'bar', baz: NaN });

console.log('done');
//process.exit();
process.on('beforeExit', () => {
  console.log('beforeExit');
});
