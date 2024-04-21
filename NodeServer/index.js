//Node Server which will handle socket io connections
const io = require('socket.io')(8000);
const users = {};
var activeUsers = []; //array to store uname

io.on('connection',socket =>{
    // console.log('User connected:', socket.id);
    socket.on('new-user-joined', uname =>{
        // console.log("New user",uname);
        activeUsers.push(uname); //adding uname
        users[socket.id] = uname;
        socket.broadcast.emit('user-joined',uname);
        socket.emit('current-user', uname); // Send the current user's name to the connecting client
        io.emit('update-active-users', activeUsers); // Show the updated active users list to all clients
        // console.log(activeUsers);//print
    })
    socket.on('send',message =>{
        socket.broadcast.emit('recieve',{message: message, name: users[socket.id]})
    });
    socket.on('disconnect', message =>{

        const disconnectedUser = users[socket.id];
        const index = activeUsers.indexOf(disconnectedUser);
        if (index !== -1) {
            activeUsers.splice(index, 1); // Remove the disconnected user from activeUsers array
        }
        socket.broadcast.emit('left',users[socket.id]);
        io.emit('update-active-users', activeUsers); // Show the updated active users list to all clients
        delete users[socket.id];
        // console.log(activeUsers); // print
    })
})