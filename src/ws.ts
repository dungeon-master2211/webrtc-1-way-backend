import { WebSocketServer,WebSocket } from 'ws';
import server from './index';

const wss = new WebSocketServer({server});



let senderSocket:null|WebSocket = null;
let receiverSocket:null|WebSocket = null;
wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data:string) {
    const message = JSON.parse(data)
    console.log(message)
    if (message?.type==='iam-sender'){
        senderSocket = ws
    }
    else if (message?.type==='iam-receiver'){
        receiverSocket = ws
    }
    else if (message?.type==='create-offer'){
        receiverSocket?.send(JSON.stringify({type:'offer'}))
    }
    else if (message?.type==='create-answer'){
        senderSocket?.send(JSON.stringify({type:'answer'}))
    }
    else if(message?.type === 'ice-candidates'){
        if(ws===senderSocket){
            receiverSocket?.send(JSON.stringify({type:'ice-candidates'}))
        }
        else if(ws===receiverSocket){
            senderSocket?.send(JSON.stringify({type:'ice-candidates'}))
        }
    }
    console.log('received: %s', data);
  });

//   ws.send('something');
});
