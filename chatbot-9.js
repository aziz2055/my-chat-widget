// Modern Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #4F46E5);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6366F1);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #1F2937);
            --chat--color-input-bg: var(--n8n-chat-input-bg, #F9FAFB);
            --chat--color-border: var(--n8n-chat-border-color, #E5E7EB);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 90px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 550px;
            background: var(--chat--color-background);
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            border: 1px solid var(--chat--color-border);
            overflow: hidden;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
            animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .n8n-chat-widget .brand-header {
            padding: 20px 24px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            position: relative;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            font-size: 18px;
            border-radius: 6px;
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .close-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-50%) scale(1.05);
        }

        .n8n-chat-widget .brand-header img {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 600;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .n8n-chat-widget .new-conversation {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 32px;
            text-align: center;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 700;
            color: var(--chat--color-font);
            margin-bottom: 12px;
            line-height: 1.3;
        }

        .n8n-chat-widget .welcome-subtitle {
            font-size: 16px;
            color: #6B7280;
            margin-bottom: 32px;
            line-height: 1.5;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s;
            font-weight: 600;
            font-family: inherit;
            margin-bottom: 16px;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.4);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: #9CA3AF;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 24px;
            background: #FAFAFA;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar-thumb {
            background: #D1D5DB;
            border-radius: 3px;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            border-radius: 16px;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
            position: relative;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 6px;
            box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25);
        }

        .n8n-chat-widget .chat-message.bot {
            background: white;
            border: 1px solid var(--chat--color-border);
            color: var(--chat--color-font);
            align-self: flex-start;
            border-bottom-left-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .chat-input-container {
            padding: 20px 24px;
            background: var(--chat--color-background);
            border-top: 1px solid var(--chat--color-border);
        }

        .n8n-chat-widget .chat-input {
            display: flex;
            gap: 12px;
            align-items: flex-end;
            background: var(--chat--color-input-bg);
            border: 2px solid var(--chat--color-border);
            border-radius: 24px;
            padding: 4px 4px 4px 20px;
            transition: all 0.2s;
        }

        .n8n-chat-widget .chat-input:focus-within {
            border-color: var(--chat--color-primary);
            background: white;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px 0;
            border: none;
            background: transparent;
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 15px;
            outline: none;
            min-height: 20px;
            max-height: 100px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: #9CA3AF;
        }

        .n8n-chat-widget .chat-send-btn {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 20px;
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .n8n-chat-widget .chat-send-btn:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        .n8n-chat-widget .send-icon {
            width: 18px;
            height: 18px;
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
            z-index: 999;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.1) translateY(-2px);
            box-shadow: 0 12px 30px rgba(79, 70, 229, 0.5);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 26px;
            height: 26px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 12px 24px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid var(--chat--color-border);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 16px;
            background: white;
            border: 1px solid var(--chat--color-border);
            border-radius: 16px;
            border-bottom-left-radius: 6px;
            max-width: 85%;
            align-self: flex-start;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .typing-dots {
            display: flex;
            gap: 4px;
        }

        .n8n-chat-widget .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #9CA3AF;
            animation: typing 1.4s infinite ease-in-out;
        }

        .n8n-chat-widget .typing-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .n8n-chat-widget .typing-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0.8);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
    `;

    // Load Inter font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            welcomeSubtitle: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Emlak AI Chatbot',
                link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
            }
        },
        style: {
            primaryColor: '#4F46E5',
            secondaryColor: '#6366F1',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1F2937'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const newConversationHTML = `
        <div class="brand-header">
            <img src="${config.branding.logo}" alt="${config.branding.name}">
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
        <div class="new-conversation">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <p class="welcome-subtitle">${config.branding.welcomeSubtitle || 'Size nasıl yardımcı olabilirim?'}</p>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
                </svg>
                Sohbeti Başlat
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input-container">
                <div class="chat-input">
                    <textarea placeholder="Mesajınızı buraya yazın..." rows="1"></textarea>
                    <button class="chat-send-btn" type="submit">
                        <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('.chat-send-btn');

    function generateUUID() {
        return crypto.randomUUID();
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
            <span style="font-size: 12px; color: #9CA3AF;">Yazıyor...</span>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }

    textarea.addEventListener('input', () => {
        autoResize(textarea);
        sendButton.disabled = textarea.value.trim() === '';
    });

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        try {
            chatContainer.querySelector('.brand-header').style.display = 'none';
            chatContainer.querySelector('.new-conversation').style.display = 'none';
            chatInterface.classList.add('active');

            const typingIndicator = showTypingIndicator();

            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            
            messagesContainer.removeChild(typingIndicator);

            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            const errorMsg = messagesContainer.querySelector('.typing-indicator');
            if (errorMsg) messagesContainer.removeChild(errorMsg);
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        
        const typingIndicator = showTypingIndicator();

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            
            messagesContainer.removeChild(typingIndicator);
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            messagesContainer.removeChild(typingIndicator);
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
            textarea.style.height = 'auto';
            sendButton.disabled = true;
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
                textarea.style.height = 'auto';
                sendButton.disabled = true;
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    });

    // Initialize send button state
    sendButton.disabled = true;
})();
