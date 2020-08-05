const path          = require("path");
const http          = require("http");
const express       = require("express");
const socketio      = require("socket.io");

const app           = express();
const server        = http.createServer(app);
const io            = socketio(server)
const formatMessages = require("./utils/messages");
const {userJoin , getCurrentUser ,userLeave,getRoomUsers} = require("./utils/users");
//*static folder
app.use(express.static(path.join(__dirname,"public")));
const bot= "Bugcord Bot"

const PORT =  process.env.PORT ||  3000;

//*run on client connection

io.on("connection", function(socket){

    socket.on("joinRoom",({username,room})=>{
        
        const user = userJoin(socket.id,username,room)

        socket.join(user.room);
        //*welcome current user
    socket.emit("message",formatMessages(bot,"welcome to BugCord"));
    //*user joins
    socket.broadcast.to(user.room).emit("message", formatMessages(bot,` ${user.username} has joined the chat`));

    //*send username and room info

    io.to(user.room).emit("roomUsers",{
        room:user.room,
        users:getRoomUsers(user.room)

    })
    
    })

    
  
    //*listen for chat
    socket.on("chatmessage",(msg)=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit("message",formatMessages(user.username,msg))
    
    })

      //*user disconnects
      socket.on("disconnect", () => {
        const user = userLeave(socket.id)  ;
     
        if(user){
            io.to(user.room).emit("message",formatMessages(bot,`${user.username} has left the chat`))
        
            io.to(user.room).emit("roomUsers",{
                room:user.room,
                users:getRoomUsers(user.room)
                
            })
            
        }
        
    })

})

server.listen(PORT,function(){
    console.log("server running on "+PORT)
})