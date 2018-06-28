
import { saveChat, findChatById, Message, getUserChats, UpdateChat } from './Model';
import { UpdateFriends, UpdateGroups, findUserById } from '../Users/Model';
import hat from 'hat';


const users = [];
const abc = (server) => {
  const io = require('socket.io')(server);
  io.on('connection', function (socket) {
    console.log('Socket Connected');


    users.push(socket.user_id);
    // findUserById(socket.user_id).then(r => {
    // findOnlineFriends(r.friends).then(re => {
    socket.emit('active', { msg: 're' });
    // });
    // });
    socket.on("username", (data) => {
      console.log(data.username);

    });

    socket.on("new conversation", (conversation) => {
      if (conversation.conversation_id != undefined) {
        const chat = new Message({
          users: [conversation.users],
          conversation_id: hat(),
          conversation: conversation.conversation,
          createdAt: new Date(),
        });
      }


    });
    socket.on("old conversation", (oldconv) => {
      socket.emit("message", { conversation_id: oldconv.conversation_id, message: oldconv.message });
      UpdateChat(oldconv.conversation_id, oldconv.message);
    });
  });

  io.on("disconnect", (soc) => {
    console.log('disconnected');
  });
};

const findOnlineFriends = (friends) => {
  const onlinefriends = [];
  for (const user of users) {
    for (const friend of friends) {
      if (friend === user) {
        onlinefriends.push(friend);
      }
    }
  }
  return onlinefriends;
};



const getchats = (list) => {
  const obj_ids = list.map(function (li) { return li.conversation_id; });
  return findChatById(obj_ids).then(res => {
    if (res) {
      return Promise.resolve({
        statusCode: 200,
        message: "Chats list",
        data: res
      });
    } else {
      return Promise.reject({
        statusCode: 404,
        message: 'No chats Available'
      });
    }
  });
};





module.exports = {
  abc,
  getchats
};
