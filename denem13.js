(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #25D366);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #075E54);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #1F2937);
            --chat--color-input-bg: var(--n8n-chat-input-bg, #F0F2F5);
            --chat--color-border: var(--n8n-chat-border-color, #E4E7EA);
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 100px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 550px;
            background: var(--chat--color-background);
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
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
            animation: slideUp 0.2s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .n8n-chat-widget .brand-header {
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: #075E54;
            color: white;
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
            font-size: 20px;
            opacity: 0.8;
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 17px;
            font-weight: 400;
            color: white;
        }

        .n8n-chat-widget .chat-interface {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            background: #E5DDD5;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .n8n-chat-widget .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }

        .n8n-chat-widget .chat-message {
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 75%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
            position: relative;
            box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
        }

        .n8n-chat-widget .chat-message.user {
            background: #DCF8C6;
            color: #111B21;
            align-self: flex-end;
            border-radius: 8px 8px 2px 8px;
        }

        .n8n-chat-widget .chat-message.bot {
            background: white;
            color: #111B21;
            align-self: flex-start;
            border-radius: 8px 8px 8px 2px;
        }

        .n8n-chat-widget .audio-message {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: #DCF8C6;
            color: #111B21;
            align-self: flex-end;
            border-radius: 8px 8px 2px 8px;
            max-width: 75%;
            box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
        }

        .n8n-chat-widget .audio-message bot {
            background: white;
            align-self: flex-start;
            border-radius: 8px 8px 8px 2px;
        }

        .n8n-chat-widget .audio-message audio {
            flex: 1;
            max-width: 200px;
        }

        .n8n-chat-widget .chat-input-container {
            padding: 8px 16px 16px 16px;
            background: #F0F2F5;
        }

        .n8n-chat-widget .chat-input {
            display: flex;
            gap: 8px;
            align-items: flex-end;
            background: white;
            border-radius: 24px;
            padding: 8px 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 8px 0;
            border: none;
            background: transparent;
            color: #3B4A54;
            resize: none;
            font-family: inherit;
            font-size: 15px;
            outline: none;
            min-height: 20px;
            max-height: 100px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: #8696A0;
        }

        .n8n-chat-widget .record-btn {
            background: #25D366;
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
            transition: background 0.2s;
            font-family: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            position: relative;
        }

        .n8n-chat-widget .record-btn:hover {
            background: #22C55E;
        }

        .n8n-chat-widget .record-btn.recording {
            background: #EF4444;
        }

        .n8n-chat-widget .record-icon {
            width: 16px;
            height: 16px;
            margin-left: 2px;
        }

        .n8n-chat-widget .send-icon {
            width: 16px;
            height: 16px;
            margin-left: 2px;
        }

        .n8n-chat-widget .chat-send-btn {
            background: #25D366;
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
            transition: background 0.2s;
            font-family: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .n8n-chat-widget .chat-send-btn:hover {
            background: #22C55E;
        }

        .n8n-chat-widget .chat-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background: #25D366;
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 999;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 32px;
            height: 32px;
            fill: currentColor;
        }

        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: white;
            border-radius: 8px 8px 8px 2px;
            max-width: 75%;
            align-self: flex-start;
            box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
        }

        .n8n-chat-widget .typing-dots {
            display: flex;
            gap: 3px;
        }

        .n8n-chat-widget .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #8696A0;
            animation: typing 1.4s infinite ease-in-out;
        }

        .n8n-chat-widget .typing-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .n8n-chat-widget .typing-dot:nth-child(2) {
            animation-delay: -0.16s;
        }

        .n8n-chat-widget .initial-message {
            padding: 8px 12px;
            background: white;
            border-radius: 8px 8px 8px 2px;
            max-width: 75%;
            align-self: flex-start;
            box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
            font-size: 14px;
            line-height: 1.4;
            color: #111B21;
            margin-bottom: 8px;
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

        .n8n-chat-widget .record-timer {
            position: absolute;
            top: -8px;
            right: -8px;
            background: rgba(0,0,0,0.7);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
        }
    `;

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
            responseTimeText: ''
        },
        style: {
            primaryColor: '#25D366',
            secondaryColor: '#075E54',
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
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordingStartTime = 0;
    let recordingTimer = null;
    let audioBlob = null;
    let isRecording = false;
    let audioUrl = '';

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

    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="${config.branding.name}">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="chat-messages">
                <div class="initial-message">Merhaba ben Cansu, nasıl yardım edebilirim?</div>
            </div>
            <div class="chat-input-container">
                <div class="chat-input">
                    <textarea placeholder="Write your message..." rows="1"></textarea>
                    <button class="record-btn" id="record-btn" title="Record audio">
                        <svg class="record-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="6" fill="currentColor"/>
                        </svg>
                        <div class="record-timer" style="display: none;">00:00</div>
                    </button>
                    <button class="chat-send-btn" id="send-btn" type="submit" disabled>
                        <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    chatContainer.innerHTML = chatInterfaceHTML;

    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175.216 175.552">
            <defs>
                <linearGradient id="b" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#57d163"/>
                    <stop offset="1" stop-color="#23b33a"/>
                </linearGradient>
                <filter id="a" width="1.115" height="1.114" x="-.057" y="-.057" color-interpolation-filters="sRGB">
                    <feGaussianBlur stdDeviation="3.531"/>
                </filter>
            </defs>
            <path fill="#b3b3b3" d="m54.532 138.45 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.523l.023.001h.023c33.707 0 61.139-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.94 25.983c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.399 32.333l1.457 2.312-6.179 22.558zm-40.811 23.544L24.16 123.88c-6.438-11.154-9.825-23.808-9.821-36.772.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954zm0 0" filter="url(#a)"/>
            <path fill="#fff" d="m12.966 161.238 10.439-38.114c-6.378-11.039-9.733-23.544-9.729-36.33.017-40.556 33.021-73.55 73.578-73.55 19.681.01 38.154 7.669 52.047 21.572s21.537 32.383 21.53 52.037c-.018 40.553-33.027 73.553-73.578 73.553h-.032c-12.313-.005-24.412-3.094-35.159-8.954z"/>
            <path fill="url(#linearGradient1780)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.312-6.179 22.559 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.518 31.126 8.524l.023.001h.023c33.707 0 61.14-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.184 25.227z"/>
            <path fill="url(#b)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523l.023.001h.023c33.707 0 61.14-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.184 25.227z"/>
            <path fill="#fff" fill-rule="evenodd" d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.016 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921s-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"/>
        </svg>`;

    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('#send-btn');
    const recordButton = chatContainer.querySelector('#record-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');

    // Start new conversation immediately
    async function startNewConversation() {
        currentSessionId = crypto.randomUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        const typingIndicator = showTypingIndicator();

        try {
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
            if (messagesContainer.querySelector('.typing-indicator')) {
                messagesContainer.removeChild(typingIndicator);
            }
        }
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
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    function autoResize(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    }

    function updateTimerDisplay() {
        if (!recordingStartTime) return;
        const elapsed = Date.now() - recordingStartTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timerDisplay = recordButton.querySelector('.record-timer');
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { 
                mimeType: 'audio/mp4' // Prefer mp4, fallback to webm if not supported
            });

            recordedChunks = [];
            recordingStartTime = Date.now();
            isRecording = true;
            recordButton.classList.add('recording');
            const timerDisplay = recordButton.querySelector('.record-timer');
            timerDisplay.style.display = 'flex';

            recordingTimer = setInterval(updateTimerDisplay, 100);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                const timerDisplay = recordButton.querySelector('.record-timer');
                timerDisplay.style.display = 'none';
                if (recordingTimer) {
                    clearInterval(recordingTimer);
                    recordingTimer = null;
                }
                recordButton.classList.remove('recording');

                if (recordedChunks.length > 0) {
                    audioBlob = new Blob(recordedChunks, { type: 'audio/mp4' });
                    audioUrl = URL.createObjectURL(audioBlob);
                    sendButton.disabled = false; // Enable send for audio
                }
            };

            mediaRecorder.start();
            // Stop after 60 seconds
            setTimeout(() => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, 60000);

            // Limit to one recording session
            recordButton.disabled = true;
            setTimeout(() => {
                recordButton.disabled = false;
            }, 60000); // Re-enable after 1 min

        } catch (err) {
            console.error('Recording error:', err);
            alert('Mikrofon erişimi reddedildi veya desteklenmiyor.');
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
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

    async function sendAudio() {
        if (!audioBlob) return;

        const userAudioDiv = document.createElement('div');
        userAudioDiv.className = 'audio-message user';
        userAudioDiv.innerHTML = `
            <audio controls src="${audioUrl}"></audio>
        `;
        messagesContainer.appendChild(userAudioDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // For webhook, you might need to upload the blob to a server and send URL
        // Here, assuming you send the base64 or handle upload separately
        // For simplicity, send a placeholder message indicating audio
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: "[Sesli Mesaj]", // Placeholder; adjust based on your backend
            metadata: {
                userId: "",
                audio: audioUrl // Or upload and send URL
            }
        };

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

        // Cleanup
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        audioBlob = null;
        audioUrl = '';
        sendButton.disabled = true;
    }

    // Event listeners
    textarea.addEventListener('input', () => {
        autoResize(textarea);
        if (textarea.value.trim() !== '') {
            sendButton.disabled = false;
        } else if (!audioBlob) {
            sendButton.disabled = true;
        }
    });

    recordButton.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });

    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
            autoResize(textarea);
        } else if (audioBlob) {
            sendAudio();
        }
        sendButton.disabled = true;
    });

    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
                autoResize(textarea);
                sendButton.disabled = true;
            }
        }
    });

    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
        if (chatContainer.classList.contains('open') && !currentSessionId) {
            startNewConversation();
        }
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

    // Start conversation when widget opens if not started
})();
