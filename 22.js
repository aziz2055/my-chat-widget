(function() {
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: #25D366;
            --chat--color-secondary: #075E54;
            font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
        }
        .n8n-chat-widget .chat-container {
            position: fixed; bottom: 100px; right: 20px; z-index: 1000;
            width: 380px; height: 550px; background: white;
            border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            overflow: hidden; display: none; flex-direction: column;
        }
        .n8n-chat-widget .chat-container.open { display: flex; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }

        .n8n-chat-widget .brand-header {
            background: #075E54; color: white; padding: 16px 20px;
            display: flex; align-items: center; gap: 12px; position: relative;
        }
        .n8n-chat-widget .brand-header img { width: 40px; height: 40px; border-radius: 50%; }
        .n8n-chat-widget .close-button {
            position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
            background: none; border: none; color: white; font-size: 24px; cursor: pointer;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1; overflow-y: auto; padding: 12px; background: #ECE5DD;
            display: flex; flex-direction: column; gap: 8px;
        }
        .n8n-chat-widget .chat-message {
            padding: 8px 14px; border-radius: 8px; max-width: 78%;
            word-wrap: break-word; font-size: 14.2px; line-height: 1.4;
            box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
        }
        .n8n-chat-widget .chat-message.user {
            background: #DCF8C6; align-self: flex-end;
            border-bottom-right-radius: 2px;
        }
        .n8n-chat-widget .chat-message.bot {
            background: white; align-self: flex-start;
            border-bottom-left-radius: 2px;
        }

        /* Ses Mesajı */
        .n8n-chat-widget .audio-message {
            background: #DCF8C6; align-self: flex-end;
            border-radius: 8px 8px 2px 8px; padding: 8px 12px;
            max-width: 260px; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
            display: flex; align-items: center; gap: 10px;
        }
        .n8n-chat-widget .audio-message audio {
            width: 200px; height: 36px;
        }
        .n8n-chat-widget .audio-duration {
            font-size: 12px; color: #666; white-space: nowrap;
        }

        .n8n-chat-widget .chat-input-container {
            padding: 8px 16px 16px; background: #F0F2F5;
        }
        .n8n-chat-widget .chat-input {
            display: flex; align-items: flex-end; gap: 8px;
            background: white; border-radius: 24px; padding: 8px 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12);
        }
        .n8n-chat-widget textarea {
            flex: 1; border: none; outline: none; resize: none;
            font-family: inherit; font-size: 15px; padding: 8px 0;
            max-height: 100px; background: transparent;
        }
        .n8n-chat-widget .record-btn {
            width: 36px; height: 36px; border-radius: 50%;
            background: #25D366; color: white; border: none;
            cursor: pointer; display: flex; align-items: center;
            justify-content: center; position: relative;
            transition: all 0.2s;
        }
        .n8n-chat-widget .record-btn.recording {
            background: #EF4444;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .n8n-chat-widget .record-timer {
            position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
            background: rgba(0,0,0,0.8); color: white; padding: 4px 8px;
            border-radius: 12px; font-size: 12px; font-weight: bold;
            white-space: nowrap; display: none;
        }
        .n8n-chat-widget .record-btn.recording .record-timer { display: block; }

        .n8n-chat-widget .chat-send-btn {
            width: 36px; height: 36px; border-radius: 50%;
            background: #25D366; color: white; border: none;
            cursor: pointer; display: flex; align-items: center;
            justify-content: center;
        }
        .n8n-chat-widget .chat-send-btn:disabled {
            opacity: 0.5; cursor: not-allowed;
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed; bottom: 20px; right: 20px; z-index: 999;
            width: 70px; height: 70px; border-radius: 50%;
            background: #25D366; border: none; cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            display: flex; align-items: center; justify-content: center;
        }
        .n8n-chat-widget .chat-toggle:hover { transform: scale(1.1); }

        .n8n-chat-widget .typing-indicator {
            align-self: flex-start; background: white;
            padding: 8px 12px; border-radius: 8px 8px 8px 2px;
            max-width: 75%; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
        }
        .n8n-chat-widget .typing-dots {
            display: flex; gap: 4px;
        }
        .n8n-chat-widget .typing-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: #999; animation: typing 1.4s infinite;
        }
        .n8n-chat-widget .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .n8n-chat-widget .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Config
    const config = window.ChatWidgetConfig || {
        webhook: { url: '', route: '' },
        branding: { logo: '', name: 'Cansu' }
    };

    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let sessionId = crypto.randomUUID();
    let mediaRecorder = null;
    let audioChunks = [];
    let startTime = 0;
    let timerInterval = null;
    let isRecording = false;

    // DOM
    const widget = document.createElement('div');
    widget.className = 'n8n-chat-widget';
    widget.innerHTML = `
        <button class="chat-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
        </button>

        <div class="chat-container">
            <div class="brand-header">
                <img src="${config.branding.logo || 'https://via.placeholder.com/40'}" alt="logo">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>

            <div class="chat-messages">
                <div class="chat-message bot">Merhaba! Nasıl yardımcı olabilirim?</div>
            </div>

            <div class="chat-input-container">
                <div class="chat-input">
                    <textarea placeholder="Mesaj yaz..." rows="1"></textarea>
                    
                    <button class="record-btn" id="recordBtn">
                        <svg class="mic-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3s-3 1.34-3 3v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                        </svg>
                        <div class="record-timer">00:00</div>
                    </button>

                    <button class="chat-send-btn" id="sendBtn" disabled>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="white">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    const container = widget.querySelector('.chat-container');
    const messages = widget.querySelector('.chat-messages');
    const textarea = widget.querySelector('textarea');
    const sendBtn = widget.querySelector('#sendBtn');
    const recordBtn = widget.querySelector('#recordBtn');
    const timerDisplay = recordBtn.querySelector('.record-timer');

    // Toggle widget
    widget.querySelector('.chat-toggle').onclick = () => {
        container.classList.toggle('open');
        if (container.classList.contains('open') && !sessionId) {
            startNewSession();
        }
    };

    widget.querySelector('.close-button').onclick = () => {
        container.classList.remove('open');
    };

    // Auto resize
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        sendBtn.disabled = !textarea.value.trim() && !audioChunks.length;
    });

    // Timer
    function updateTimer() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const mins = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const secs = String(elapsed % 60).padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    }

    // Start/Stop Recording
    recordBtn.onclick = async () => {
        if (isRecording) {
            // STOP & SEND
            mediaRecorder.stop();
            recordBtn.classList.remove('recording');
            isRecording = false;
            clearInterval(timerInterval);
            timerDisplay.style.display = 'none';
        } else {
            // START RECORDING
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });

                audioChunks = [];
                startTime = Date.now();
                isRecording = true;
                recordBtn.classList.add('recording');
                timerDisplay.style.display = 'block';
                timerInterval = setInterval(updateTimer, 100);

                mediaRecorder.ondataavailable = e => {
                    audioChunks.push(e.data);
                };

                mediaRecorder.onstop = () => {
                    stream.getTracks().forEach(t => t.stop());
                    const audioBlob = new Blob(audioChunks, { type: 'audio/mp4' });
                    const url = URL.createObjectURL(audioBlob);
                    sendAudioMessage(url, audioBlob.size);
                    audioChunks = [];
                    sendBtn.disabled = false;
                };

                mediaRecorder.start();

                // Max 60 seconds
                setTimeout(() => {
                    if (isRecording) recordBtn.click();
                }, 60000);

            } catch (err) {
                alert("Mikrofon erişimi reddedildi!");
                console.error(err);
            }
        }
    };

    // Send text
    sendBtn.onclick = () => {
        const text = textarea.value.trim();
        if (text) {
            appendMessage(text, 'user');
            sendToWebhook(text);
            textarea.value = '';
            textarea.style.height = 'auto';
            sendBtn.disabled = true;
        }
    };

    textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // Send audio message
    function sendAudioMessage(url, size) {
        const div = document.createElement('div');
        div.className = 'audio-message';
        const duration = Math.round((Date.now() - startTime) / 1000);
        div.innerHTML = `
            <audio controls src="${url}"></audio>
            <span class="audio-duration">${duration}s</span>
        `;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;

        // Send to backend
        sendToWebhook("[Sesli Mesaj]", { audioUrl: url });
    }

    // Append message
    function appendMessage(text, type) {
        const div = document.createElement('div');
        div.className = `chat-message ${type}`;
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // Show typing
    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'typing-indicator';
        typing.innerHTML = `<div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>`;
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
        return typing;
    }

    // Send to webhook
    async function sendToWebhook(input, extra = {}) {
        const typing = showTyping();

        try {
            const res = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([{
                    action: "sendMessage",
                    sessionId,
                    route: config.webhook.route,
                    chatInput: input,
                    metadata: { userId: "", ...extra }
                }])
            });
            const data = await res.json();
            messages.removeChild(typing);

            const botMsg = Array.isArray(data) ? data[0].output : data.output;
            appendMessage(botMsg, 'bot');
        } catch (err) {
            console.error(err);
            messages.removeChild(typing);
            appendMessage("Bir hata oluştu.", 'bot');
        }
    }

    // Start session
    async function startNewSession() {
        sessionId = crypto.randomUUID();
        const typing = showTyping();
        try {
            const res = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([{
                    action: "loadPreviousSession",
                    sessionId,
                    route: config.webhook.route,
                    metadata: { userId: "" }
                }])
            });
            const data = await res.json();
            messages.removeChild(typing);
            const msg = Array.isArray(data) ? data[0].output : data.output;
            appendMessage(msg, 'bot');
        } catch (err) {
            console.error(err);
        }
    }

    // First open → start session
    container.addEventListener('transitionend', () => {
        if (container.classList.contains('open') && messages.children.length === 1) {
            startNewSession();
        }
    });

})();
