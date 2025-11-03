<script>
(function() {
    // === STYLES (mevcut + ses için ek) ===
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #25D366);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #075E54);
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
        }

        /* Mevcut tüm stiller... (önceki kodun tamamı buraya gelecek, kısalttım) */
        /* ... tüm önceki CSS ... */

        .voice-recording {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #666;
        }
        .voice-timer { font-weight: 500; }
        .recording-dot {
            width: 8px; height: 8px;
            background: #e74c3c;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
        }
        .mic-btn {
            width: 36px; height: 36px;
            border-radius: 50%;
            background: #e74c3c;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        }
        .mic-btn:hover { background: #c0392b; transform: scale(1.05); }
        .mic-btn.recording { background: #e74c3c; animation: micPulse 1.5s infinite; }
        @keyframes micPulse {
            0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); }
            100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); }
        }
        .mic-icon { width: 18px; height: 18px; fill: white; }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // === CONFIG & INIT (mevcut) ===
    const defaultConfig = { /* ... mevcut config ... */ };
    const config = window.ChatWidgetConfig ? { ...defaultConfig, ...window.ChatWidgetConfig } : defaultConfig;
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let mediaRecorder = null;
    let audioChunks = [];
    let recordingTimer = null;
    let recordingSeconds = 0;

    // === DOM ELEMANLARI ===
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    Object.keys(config.style || {}).forEach(key => {
        widgetContainer.style.setProperty(`--n8n-chat-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, config.style[key]);
    });

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    // HTML (kısaltılmış, sadece farklar gösteriliyor)
    chatContainer.innerHTML = `
        <!-- Mevcut header + new conversation -->
        <div class="brand-header">...</div>
        <div class="new-conversation">...</div>

        <div class="chat-interface">
            <div class="brand-header">...</div>
            <div class="chat-messages">
                <div class="initial-message">Merhaba ben Cansu, nasıl yardım edebilirim?</div>
            </div>
            <div class="chat-input-container">
                <div class="chat-input">
                    <textarea placeholder="Mesajınızı yazın..." rows="1"></textarea>
                    <button class="mic-btn" id="micBtn">
                        <svg class="mic-icon" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                    </button>
                    <button class="chat-send-btn">
                        <svg class="send-icon" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
                <div class="voice-recording" id="voiceRecording" style="display:none; margin-top:8px;">
                    <div class="recording-dot"></div>
                    <span class="voice-timer">00:00</span>
                    <span>· Kaydediliyor...</span>
                </div>
            </div>
        </div>
    `;

    const toggleButton = document.createElement('button');
    toggleButton.className = 'chat-toggle';
    toggleButton.innerHTML = `<!-- WhatsApp SVG -->`;
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    // Elementler
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('.chat-send-btn');
    const micBtn = chatContainer.querySelector('#micBtn');
    const voiceRecording = chatContainer.querySelector('#voiceRecording');
    const voiceTimer = voiceRecording.querySelector('.voice-timer');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');

    // === SES KAYDI FONKSİYONLARI ===
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function startRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                audioChunks = [];
                mediaRecorder = new MediaRecorder(stream);
                
                mediaRecorder.ondataavailable = e => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    sendAudioMessage(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };

                mediaRecorder.start();
                micBtn.classList.add('recording');
                voiceRecording.style.display = 'flex';
                recordingSeconds = 0;
                voiceTimer.textContent = '00:00';

                recordingTimer = setInterval(() => {
                    recordingSeconds++;
                    voiceTimer.textContent = formatTime(recordingSeconds);
                }, 1000);
            })
            .catch(err => {
                alert("Mikrofon erişimi reddedildi veya hata oluştu.");
                console.error(err);
            });
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            clearInterval(recordingTimer);
            micBtn.classList.remove('recording');
            voiceRecording.style.display = 'none';
        }
    }

    // === SES MESAJI GÖNDER ===
    async function sendAudioMessage(audioBlob) {
        if (!currentSessionId) await startNewConversation();

        // Kullanıcı ses mesajı göster
        const audioURL = URL.createObjectURL(audioBlob);
        const userAudioDiv = document.createElement('div');
        userAudioDiv.className = 'chat-message user';
        userAudioDiv.innerHTML = `
            <audio controls style="width:100%; margin-top:4px;">
                <source src="${audioURL}" type="audio/webm">
            </audio>
            <small style="opacity:0.7; display:block; margin-top:4px;">${formatTime(recordingSeconds)}</small>
        `;
        messagesContainer.appendChild(userAudioDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // FormData ile gönder
        const formData = new FormData();
        formData.append('action', 'sendMessage');
        formData.append('sessionId', currentSessionId);
        formData.append('route', config.webhook.route);
        formData.append('audio', audioBlob, 'voice.webm');
        formData.append('metadata', JSON.stringify({ userId: "" }));

        const typing = showTypingIndicator();

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            messagesContainer.removeChild(typing);
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            botMsg.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botMsg);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (err) {
            console.error(err);
            messagesContainer.removeChild(typing);
        }
    }

    // === Mikrofon Tıklama ===
    micBtn.addEventListener('click', () => {
        if (!micBtn.classList.contains('recording')) {
            startRecording();
        } else {
            stopRecording();
        }
    });

    // Uzun basılı tutma (isteğe bağlı)
    let pressTimer;
    micBtn.addEventListener('mousedown', () => {
        pressTimer = setTimeout(() => {
            startRecording();
        }, 300);
    });
    micBtn.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        if (micBtn.classList.contains('recording')) {
            stopRecording();
        }
    });
    micBtn.addEventListener('touchstart', e => {
        e.preventDefault();
        pressTimer = setTimeout(() => startRecording(), 300);
    });
    micBtn.addEventListener('touchend', e => {
        e.preventDefault();
        clearTimeout(pressTimer);
        if (micBtn.classList.contains('recording')) stopRecording();
    });

    // === MEVCUT FONKSİYONLAR (kısaltılmış) ===
    function generateUUID() { return crypto.randomUUID(); }
    function showTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.innerHTML = `<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return div;
    }

    async function startNewConversation() {
        currentSessionId = generateUUID();
        chatInterface.classList.add('active');
        document.querySelector('.new-conversation').style.display = 'none';
        document.querySelectorAll('.brand-header')[0].style.display = 'flex';
    }

    async function sendMessage(text) {
        // mevcut metin gönderme kodu...
    }

    // === EVENT LISTENERS ===
    newChatBtn.addEventListener('click', startNewConversation);
    sendButton.addEventListener('click', () => {
        if (textarea.value.trim()) {
            sendMessage(textarea.value.trim());
            textarea.value = '';
        }
    });
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
    });
    toggleButton.addEventListener('click', () => chatContainer.classList.toggle('open'));
    document.querySelectorAll('.close-button').forEach(b => b.addEventListener('click', () => chatContainer.classList.remove('open')));
})();
</script>
