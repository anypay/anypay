
const Poller = require('./poller');

Poller.start()

Poller.vent.on('received', data => {

  console.log('received', data);
});

Poller.vent.on('normalsend:received', data => {

  console.log('normalsend:received', data);
});

Poller.vent.on('instantsend:received', data => {

  console.log('instantsend:received', data);
});
