const socket = io('http://127.0.0.1:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
const activeUsersContainer = document.querySelector('.mem');
var audio = new Audio('audio.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    // Set CSS style for center alignment
    if (position === 'center' || (position === 'right' && message.includes('left the chat'))) {
        messageElement.style.margin = '0 auto';
        messageElement.style.width = 'fit-content';
        messageContainer.append(messageElement);
    } else {
        // For left and right positions, check if it's a system message
        const isSystemMessage = position === 'center' && (message.includes('left the chat') || message.includes('joined the chat'));
        if (isSystemMessage) {
            const systemMessageElement = document.createElement('div');
            systemMessageElement.innerText = message;
            systemMessageElement.classList.add('system-message');
            messageContainer.append(systemMessageElement);
        } else {
            messageContainer.append(messageElement);
        }

        // Play audio for left position
        if (position === 'left') {
            audio.play();
        }
    }
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`Me`, 'sright');
    append(`${message}`, 'right'); //append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Add a new event listener to receive the current user's name from the server
socket.on('current-user', (currentUserName) => {
    const currentUserElement = document.getElementById('currentUserName');
    currentUserElement.innerText = `${currentUserName}`;
});

const uname = prompt('Enter your name to join');
socket.emit('new-user-joined', uname);

//For representing the user joined the chat in center
socket.on('user-joined', (name) => {
    audio.play();
    // Display "user joined" message in the center
    // append(`${name} joined the chat`, 'center');
});

socket.on('update-active-users', (usersList) => {
    const userContainer = document.querySelector('.user-list');
    userContainer.innerHTML = ''; // Clear the existing content
    usersList.forEach(user => {
        const truncatedUsername = user.length > 10 ? user.substring(0, 10) + '...' : user;
        const userElement = document.createElement('div');
        userElement.innerText = truncatedUsername;
        userElement.classList.add('active-user');
        userContainer.appendChild(userElement);
    });
});

socket.on('recieve', (data) => {
    append(`${data.name}`, 'sleft');
    append(`${data.message}`, 'left');
});

//For representing the user left the chat in center
socket.on('left', (name) => {
    audio.play();
    // append(`${name} left the chat`, 'center');
});