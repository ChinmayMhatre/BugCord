
//?==========================================
//* theme selector script
//?==========================================

var themeDots = document.querySelectorAll(".theme-dot")
var theme =localStorage.getItem("theme");
if (theme==null){
    setTheme('purple')
}else{
    setTheme(theme)
}


themeDots.forEach(function(dot){
    dot.addEventListener("click",function(){
        var mode = dot.dataset.mode 
        
        setTheme(mode)
    })
})

function setTheme(mode){
    if(mode=="blue"){
        document.getElementById("theme-style").href="css/blue.css"
    }
    if(mode=="green"){
        document.getElementById("theme-style").href="css/green.css"
    }
    if(mode=="purple"){
        document.getElementById("theme-style").href="css/style.css"
    }
    
    localStorage.setItem("theme" ,mode)
    
    
}


//?==========================================
//* socket script
//?==========================================
const chatForm      = document.getElementById("chat-form");
const socket        = io()
const chatMessages  = document.querySelector(".chat-messages");
const roomName      = document.getElementById("room-name");
const userlist      = document.getElementById("users");

//* get username and room from url

const {username , room } = Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

//* join chatroom
socket.emit("joinRoom",{username,room});

//*get room and users

socket.on("roomUsers",({room ,users}) => {
    outputRoomName(room);
    outputUsers(users); 
})

//*message from server
socket.on("message", message =>{
   
    outputMessage(message);
    chatMessages.scrollTop= chatMessages.scrollHeight;
})

//* Message submit

chatForm.addEventListener("submit", (e) =>{
    e.preventDefault(); 
    //* get message
    const msg =e.target.elements.msg.value;
    //* emit to the server 
    socket.emit("chatmessage",msg);
    //* clear the message
    e.target.elements.msg.value= "";
    e.target.elements.msg.focus();

})

//* output message to DOM

function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div)
}

//* add room name to dom

function outputRoomName(room){
    roomName. innerText = room  
}

//* add users to dom

function outputUsers(users){
    userlist.innerHTML=`
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}