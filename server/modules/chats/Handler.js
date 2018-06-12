
import {saveChat,findChatById, Message} from './Model';
import { Server } from 'http';



const abc = (http)=>{
  const io=require('socket.io')(http);
  io.on('connection', function(soc){
    soc.on('chat message', function(msg){
      let message=new Message(
        {
          message:msg
        }
      
        
      );
      saveChat(message);
  
      io.emit('chat message', msg);
    });
   
    
  });
  
  io.on("disconnect",(soc)=>{
    console.log('disconnected');
  });
};



module.exports = abc;
