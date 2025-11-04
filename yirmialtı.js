// WhatsApp Style Voice Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-voice-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #25D366);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #075E54);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #1F2937);
            --chat--color-input-bg: var(--n8n-chat-input-bg, #F0F2F5);
            --chat--color-border: var(--n8n-chat-border-color, #E4E7EA);
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
        }

        .n8n-voice-widget .chat-container {
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

        .n8n-voice-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-voice-widget .chat-container.open {
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

        .n8n-voice-widget .brand-header {
            padding: 16px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: #075E54;
            color: white;
            position: relative;
        }

        .n8n-voice-widget .close-button {
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

        .n8n-voice-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-voice-widget .brand-header img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
        }

        .n8n-voice-widget .brand-header span {
            font-size: 17px;
            font-weight: 400;
            color: white;
        }

        .n8n-voice-widget .new-conversation {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 32px;
            text-align: center;
            background: #E5DDD5;
        }

        .n8n-voice-widget .welcome-text {
            font-size: 20px;
            font-weight: 400;
            color: #54656F;
            margin-bottom: 8px;
            line-height: 1.3;
        }

        .n8n-voice-widget .welcome-subtitle {
            font-size: 14px;
            color: #667781;
            margin-bottom: 24px;
            line-height: 1.4;
        }

        .n8n-voice-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 14px 24px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 24px;
            cursor: pointer;
            font-size: 15px;
            transition: background 0.2s;
            font-weight: 400;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-voice-widget .new-chat-btn:hover {
            background: #22C55E;
        }

        .n8n-voice-widget .message-icon {
            width: 18px;
            height: 18px;
        }

        .n8n-voice-widget .response-text {
            font-size: 13px;
            color: #8696A0;
            margin: 0;
        }

        .n8n-voice-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .n8n-voice-widget .chat-interface.active {
            display: flex;
        }

        .n8n-voice-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 12px;
            background: #E5DDD5;
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .n8n-voice-widget .chat-messages::-webkit-scrollbar {
            width: 6px;
        }

        .n8n-voice-widget .chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }

        .n8n-voice-widget .chat-messages::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }

        .n8n-voice-widget .chat-message {
            padding: 8px 12px;
            border-radius: 8px;
            max-width: 75%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.4;
            position: relative;
            box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
        }

        .n8n-voice-widget .chat-message.user {
            background: #DCF8C6;
            color: #111B21;
            align-self: flex-end;
            border-radius: 8px 8px 2px 8px;
        }

        .n8n-voice-widget .chat-message.bot {
            background: white;
            color: #111B21;
            align-self: flex-start;
            border-radius: 8px 8px 8px 2px;
        }

        .n8n-voice-widget .voice-message {
            display: flex;
            align-items: center;
            gap: 8px;
            min-width: 200px;
        }

        .n8n-voice-widget .play-button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .n8n-voice-widget .play-button svg {
            width: 24px;
            height: 24px;
            fill: #25D366;
        }

        .n8n-voice-widget .chat-message.user .play-button svg {
            fill: #075E54;
        }

        .n8n-voice-widget .waveform {
            flex: 1;
            height: 32px;
            display: flex;
            align-items: center;
            gap: 2px;
        }

        .n8n-voice-widget .waveform-bar {
            width: 3px;
            background: #8696A0;
            border-radius: 2px;
            transition: height 0.1s;
        }

        .n8n-voice-widget .chat-message.user .waveform-bar {
            background: #075E54;
        }

        .n8n-voice-widget .voice-duration {
            font-size: 12px;
            color: #667781;
            flex-shrink: 0;
        }

        .n8n-voice-widget .chat-input-container {
            padding: 8px 16px 16px 16px;
            background: #F0F2F5;
        }

        .n8n-voice-widget .chat-input {
            display: flex;
            gap: 8px;
            align-items: center;
            background: white;
            border-radius: 24px;
            padding: 8px 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
        }

        .n8n-voice-widget .recording-indicator {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #DC2626;
            font-size: 14px;
        }

        .n8n-voice-widget .recording-dot {
            width: 8px;
            height: 8px;
            background: #DC2626;
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.3;
            }
        }

        .n8n-voice-widget .voice-btn {
            background: #25D366;
            color: white;
            border: none;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
            transition: all 0.2s;
            font-family: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .n8n-voice-widget .voice-btn:hover {
            background: #22C55E;
        }

        .n8n-voice-widget .voice-btn.recording {
            background: #DC2626;
            animation: recordPulse 1.5s ease-in-out infinite;
        }

        .n8n-voice-widget .voice-btn.recording:hover {
            background: #B91C1C;
        }

        @keyframes recordPulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }

        .n8n-voice-widget .voice-btn svg {
            width: 18px;
            height: 18px;
        }

        .n8n-voice-widget .chat-toggle {
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

        .n8n-voice-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-voice-widget .chat-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .n8n-voice-widget .chat-toggle svg {
            width: 32px;
            height: 32px;
            fill: currentColor;
        }

        .n8n-voice-widget .typing-indicator {
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

        .n8n-voice-widget .typing-dots {
            display: flex;
            gap: 3px;
        }

        .n8n-voice-widget .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #8696A0;
            animation: typing 1.4s infinite ease-in-out;
        }

        .n8n-voice-widget .typing-dot:nth-child(1) {
            animation-delay: -0.32s;
        }

        .n8n-voice-widget .typing-dot:nth-child(2) {
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
    const config = window.VoiceChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.VoiceChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.VoiceChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.VoiceChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NVoiceWidgetInitialized) return;
    window.N8NVoiceWidgetInitialized = true;

    let currentSessionId = '';
    let mediaRecorder = null;
    let audioChunks = [];
    let isRecording = false;
    let recordingStartTime = 0;

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-voice-widget';
    
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
            <p class="welcome-subtitle">${config.branding.welcomeSubtitle || 'Sesli mesaj göndererek nasıl yardımcı olabilirim?'}</p>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
                </svg>
                Sesli Sohbeti Başlat
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
                    <div class="recording-indicator" style="display: none;">
                        <div class="recording-dot"></div>
                        <span class="recording-time">0:00</span>
                    </div>
                    <button class="voice-btn" type="button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = newConversationHTML + chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175.216 175.552">
            <defs>
                <linearGradient id="b" x1="85.915" x2="86.535" y1="32.567" y2="137.092" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stop-color="#57d163"/>
                    <stop offset="1" stop-color="#23b33a"/>
                </linearGradient>
            </defs>
            <path fill="url(#b)" d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324c9.387 5.571 20.15 8.517 31.126 8.523l.023.001h.023c33.707 0 61.14-27.426 61.153-61.135.006-16.335-6.349-31.696-17.895-43.251A60.75 60.75 0 0 0 87.184 25.227z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const voiceBtn = chatContainer.querySelector('.voice-btn');
    const recordingIndicator = chatContainer.querySelector('.recording-indicator');
    const recordingTime = chatContainer.querySelector('.recording-time');

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
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function createVoiceMessageElement(audioUrl, duration, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        
        const waveformBars = Array(20).fill(0).map(() => {
            const height = Math.random() * 20 + 8;
            return `<div class="waveform-bar" style="height: ${height}px;"></div>`;
        }).join('');

        messageDiv.innerHTML = `
            <div class="voice-message">
                <button class="play-button" data-audio="${audioUrl}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
                <div class="waveform">${waveformBars}</div>
                <span class="voice-duration">${formatTime(Math.floor(duration))}</span>
            </div>
        `;

        const playButton = messageDiv.querySelector('.play-button');
        let audio = null;

        playButton.addEventListener('click', async () => {
            if (!audio) {
                audio = new Audio(audioUrl);
                audio.addEventListener('ended', () => {
                    playButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    `;
                });
            }

            if (audio.paused) {
                audio.play();
                playButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                `;
            } else {
                audio.pause();
                playButton.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                `;
            }
        });

        return messageDiv;
    }

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const duration = (Date.now() - recordingStartTime) / 1000;
                await sendVoiceMessage(audioBlob, duration);
                
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            isRecording = true;
            recordingStartTime = Date.now();
            voiceBtn.classList.add('recording');
            recordingIndicator.style.display = 'flex';
            
            voiceBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 6h12v12H6z"/>
                </svg>
            `;

            const intervalId = setInterval(() => {
                if (!isRecording) {
                    clearInterval(intervalId);
                    return;
                }
                const elapsed = Math.floor((Date.now() - recordingStartTime) / 1000);
                recordingTime.textContent = formatTime(elapsed);
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Mikrofona erişim izni gerekli!');
        }
    }

    function stopRecording() {
        if (mediaRecorder && isRecording) {
            mediaRecorder.stop();
            isRecording = false;
            voiceBtn.classList.remove('recording');
            recordingIndicator.style.display = 'none';
            recordingTime.textContent = '0:00';
            
            voiceBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
                </svg>
            `;
        }
    }

    async function sendVoiceMessage(audioBlob, duration) {
        const audioUrl = URL.createObjectURL(audioBlob);
        const userVoiceMsg = createVoiceMessageElement(audioUrl, duration, true);
        messagesContainer.appendChild(userVoiceMsg);
        
        const typingIndicator = showTypingIndicator();

        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'voice-message.webm');
            formData.append('sessionId', currentSessionId);
            formData.append('route', config.webhook.route);
            formData.append('action', 'sendVoice');

            const response = await fetch(config.webhook.url, {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            messagesContainer.removeChild(typingIndicator);
            
            // Assuming the response contains audio file URL or base64
            if (data.audioUrl || data.audioBase64) {
                const botAudioUrl = data.audioUrl || `data:audio/webm;base64,${data.audioBase64}`;
                const botVoiceMsg = createVoiceMessageElement(botAudioUrl, data.duration || 5, false);
                messagesContainer.appendChild(botVoiceMsg);
            }
            
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            messagesContainer.removeChild(typingIndicator);
        }
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        
        chatContainer.querySelector('.brand-header').style.display = 'none';
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    voiceBtn.addEventListener('click', () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatContainer.classList.remove('open');
            if (isRecording) {
                stopRecording();
            }
        });
    });
})();
