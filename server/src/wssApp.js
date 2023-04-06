const config = require('./config');
const logger = require('./config/logger');
const { WebSocketServer } = require ('ws');
const { 
  getQueryVariable
} = require('./utils');
const Ably = require('ably');

// contain user socket
// ex: rooms[address]: ws
const rooms = {};
const wss = {};

// with Ably Lib integration
const sendNotification = async (address, server, msg) => {
  const realtime = new Ably.Realtime(config.ably_key);
  var channel = realtime.channels.get(address);
  channel.publish(address, msg);
};

const logoutWss = async () => { return true };

// If you need ws on localserver
// init ws server
/*const wss = new WebSocketServer({
  port: config.port_ws,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});

wss.on('listening', function connection(ws) {
	logger.info(`Wss Server2 listening to port ${config.port_ws}`);
});

wss.on('connection', function connection(ws, request) {
  console.log('connection wss', wss.clients.size);
  const uuid = getQueryVariable(request.url, 'address');
  const server = getQueryVariable(request.url, 'server');
  
  if (rooms[uuid]) {
    console.log('already exist, close existing');
    rooms[uuid].close();
  }
  rooms[uuid] = ws;

  setTimeout(() => 
    ws.send(JSON.stringify({ address: uuid, server, msg: 'Connected.' }))
  , 3000);
});

//wss.on('close', function close() {
//  console.log('close wss');
//});

const sendNotification = (address, server, msg) => {
  console.log('sendNotification');
  if (wss && wss.clients && rooms[address]) {  
    // send all
    //wss.clients.forEach(function each(ws) {
  	//	console.log('try send msg');
  	//	ws.send(JSON.stringify({ address, server, msg }));
  	//});

    rooms[address].send(JSON.stringify({ address, server, msg }));
    return true;
  }
  return false;
}

const logoutWss = (address, server) => {
  if (rooms[address]) {
    rooms[address].send(JSON.stringify({ address, server, msg: 'Disconnected.' }))
    rooms[address].close();
    delete rooms[address];
  }
}*/

module.exports = { 
	wss,
	sendNotification,
  /*logoutWss,*/
};