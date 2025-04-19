document.addEventListener('DOMContentLoaded', function() {
    // Basic message sending functionality
    const messageInput = document.querySelector('.message-input input');
    const sendButton = document.querySelector('.message-input button');
    
    sendButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();
        if (messageText) {
            // In a real app, you would send this to the server
            const messagesContainer = document.querySelector('.messages');
            const newMessage = document.createElement('div');
            newMessage.className = 'message sent';
            newMessage.innerHTML = `
                <p>${messageText}</p>
                <span class="time">Just now</span>
            `;
            messagesContainer.appendChild(newMessage);
            messageInput.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    });
});