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
        receiverSocket?.send(JSON.stringify({type:'offer',sdp:message.sdp}))
    }
    else if (message?.type==='create-answer'){
        senderSocket?.send(JSON.stringify({type:'answer',sdp:message.sdp        }))
    }
    else if(message?.type === 'ice-candidates'){
        if(ws===senderSocket){
            console.log('sending ice candidate to receiver')
            receiverSocket?.send(JSON.stringify({type:'ice-candidates',candidates:message.candidate}))
        }
        else if(ws===receiverSocket){
            console.log('sending ice candidate to sender')
            senderSocket?.send(JSON.stringify({type:'ice-candidates',candidates:message.candidate}))
        }
    }
    console.log('received: %s', data);
  });

//   ws.send('something');
});
