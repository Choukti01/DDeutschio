  // Conversation history for context
    let conversationHistory = [];
    
    // Chatbot personality and instructions
    const CHATBOT_PROMPT = `You are a helpful customer support AI assistant for a technology company. Your personality traits:

- Friendly and professional tone
- Patient and understanding
- Knowledgeable about general tech topics
- Always try to be helpful and provide actionable advice
- If you don't know something specific about the company, politely say so and offer to connect them with a human agent
- Keep responses concise but informative
- Use emojis occasionally to be friendly (but not overuse them)

Remember the conversation context and refer back to previous messages when relevant.`;

    function addMessage(content, isUser = false) {
        const chatContainer = document.getElementById('chatContainer');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.innerHTML = content;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function showTyping() {
        addMessage('<span class="loading"></span><span class="loading" style="animation-delay:0.2s"></span><span class="loading" style="animation-delay:0.4s"></span> Typing...');
    }

    function removeTyping() {
        const messages = document.querySelectorAll('.message');
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.textContent.includes('Typing...')) {
            lastMessage.remove();
        }
    }

    async function sendMessage() {
        const input = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Disable input while processing
        input.disabled = true;
        sendButton.disabled = true;
        
        // Add user message to chat
        addMessage(message, true);
        
        // Add to conversation history
        conversationHistory.push(`User: ${message}`);
        
        // Clear input
        input.value = '';
        
        // Show typing indicator
        showTyping();
        
        try {
            // Build context-aware prompt
            const contextPrompt = `${CHATBOT_PROMPT}

Conversation History:
${conversationHistory.slice(-10).join('\n')}

Current User Message: ${message}

Please respond naturally considering the conversation context above.`;

            // Send to ApiFreeLLM
            const response = await apifree.chat(contextPrompt);
            
            // Remove typing indicator
            removeTyping();
            
            // Add bot response
            addMessage(response);
            
            // Add to conversation history
            conversationHistory.push(`Assistant: ${response}`);
            
        } catch (error) {
            removeTyping();
            addMessage('⚠ Sorry, I encountered an error. Please try again!');
            console.error('Chat error:', error);
        } finally {
            // Re-enable input
            input.disabled = false;
            sendButton.disabled = false;
            input.focus();
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    }

    // Focus input on page load
    document.getElementById('messageInput').focus();