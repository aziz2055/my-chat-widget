<script>
(function() {
    // === STYLES (Değişmedi) ===
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
        .n8n-chat-widget .chat-container { position: fixed; bottom: 100px; right: 20px; z-index: 1000; display: none; width: 380px; height: 550px; background: var(--chat--color-background); border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); overflow: hidden; }
        .n8n-chat-widget .chat-container.position-left { right: auto; left: 20px; }
        .n8n-chat-widget .chat-container.open { display: flex; flex-direction: column; animation: slideUp 0.2s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .n8n-chat-widget .brand-header { padding: 16px 20px; display: flex; align-items: center; gap: 12px; background: #075E54; color: white; position: relative; }
        .n8n-chat-widget .close-button { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); background: none; border: none; color: white; cursor: pointer; font-size: 24px; opacity: 0.8; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
        .n8n-chat-widget .close-button:hover { opacity: 1; }
        .n8n-chat-widget .brand-header img { width: 36px; height: 36px; border-radius: 50%; }
        .n8n-chat-widget .brand-header span { font-size: 17px; font-weight: 400; }
        .n8n-chat-widget .new-conversation { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 32px; text-align: center; background: #E5DDD5; }
        .n8n-chat-widget .welcome-text { font-size: 20px; font-weight: 400; color: #54656F; margin-bottom: 8px; }
        .n8n-chat-widget .welcome-subtitle { font-size: 14px; color: #667781; margin-bottom: 24px; }
        .n8n-chat-widget .new-chat-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 14px 24px; background: #25D366; color: white; border: none; border-radius: 24px; cursor: pointer; font-size: 15px; }
        .n8n-chat-widget .new-chat-btn:hover { background: #22C55E; }
        .n8n-chat-widget .chat-interface { display: none; flex-direction: column; height: 100%; }
        .n8n-chat-widget .chat-interface.active { display: flex; }
        .n8n-chat-widget .chat-messages { flex: 1; overflow-y: auto; padding: 12px; background: #E5DDD5; display: flex; flex-direction: column; gap: 8px; }
        .n8n-chat-widget .chat-messages::-webkit-scrollbar { width: 6px; }
        .n8n-chat-widget .chat-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 3px; }
        .n8n-chat-widget .chat-message { padding: 8px 12px; border-radius: 8px; max-width: 75%; word-wrap: break-word; font-size: 14px; line-height: 1.4; position: relative; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); }
        .n8n-chat-widget .chat-message.user { background: #DCF8C6; color: #111B21; align-self: flex-end; border-radius: 8px 8px 2px 8px; }
        .n8n-chat-widget .chat-message.bot { background: white; color: #111B21; align-self: flex-start; border-radius: 8px 8px 8px 2px; }
        .n8n-chat-widget .chat-message.audio { background: #DCF8C6; padding: 12px; border-radius: 12px 12px 4px 12px; }
        .n8n-chat-widget .audio-player { width: 100%; height: 36px; }
        .n8n-chat-widget .chat-input-container { padding: 8px 16px 16px; background: #F0F2F5; }
        .n8n-chat-widget .chat-input { display: flex; gap: 8px; align-items: flex-end; background: white; border-radius: 24px; padding: 8px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
        .n8n-chat-widget .chat-input textarea { flex: 1; padding: 8px 0; border: none; background: transparent; color: #3B4A54; resize: none; font-family: inherit; font-size: 15px; outline: none; min-height: 20px; max-height: 100px; }
        .n8n-chat-widget .chat-input textarea::placeholder { color: #8696A0; }
        .n8n-chat-widget .chat-send-btn, .n8n-chat-widget .mic-btn { background: #25D366; color: white; border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .n8n-chat-widget .chat-send-btn:hover, .n8n-chat-widget .mic-btn:hover { background: #22C55E; }
        .n8n-chat-widget .chat-send-btn:disabled, .n8n-chat-widget .mic-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .n8n-chat-widget .send-icon, .n8n-chat-widget .mic-icon { width: 16px; height: 16px; }
        .n8n-chat-widget .chat-toggle { position: fixed; bottom: 20px; right: 20px; width: 70px; height: 70px; border-radius: 50%; background: #25D366; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 999; display: flex; align-items: center; justify-content: center; }
        .n8n-chat-widget .chat-toggle.position-left { right: auto; left: 20px; }
        .n8n-chat-widget .chat-toggle:hover { transform: scale(1.05); }
        .n8n-chat-widget .typing-indicator { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: white; border-radius: 8px 8px 8px 2px; max-width: 75%; align-self: flex-start; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); }
        .n8n-chat-widget .typing-dots { display: flex; gap: 3px; }
        .n8n-chat-widget .typing-dot { width: 6px; height: 6px; border-radius: 50%; background: #8696A0; animation: typing 1.4s infinite ease-in-out; }
        .n8n-chat-widget .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .n8n-chat-widget .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typing { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
        .n8n-chat-widget .initial-message { padding: 8px 12px; background: white; border-radius: 8px 8px 8px 2px; max-width: 75%; align-self: flex-start; box-shadow: 0 1px 0.5px rgba(0,0,0,0.13); font-size: 14px; color: #111B21; }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // === CONFIG ===
    const defaultConfig = {
        webhook: { url: '', route: '' },
        branding: { logo: '', name: '', welcomeText: '', welcomeSubtitle: '', responseTimeText: '' },
        style: { primaryColor: '#25D366', secondaryColor: '#075E54', position: 'right', backgroundColor: '#ffffff', fontColor: '#1F2937' }
    };

    const config = window.ChatWidgetConfig ? {
        webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
        branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
        style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
    } : defaultConfig;

    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';
    let mediaRecorder = null;
    let audioChunks = [];

    // === DOM ===
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    Object.entries(config.style).forEach(([key, value]) => {
        widgetContainer.style.setProperty(`--n8n-chat-${key.toLowerCase()}-color`, value);
    });

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;

    const html = `
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
                    <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
                Sohbeti Başlat
            </button>
            <p class="response-text">${config.branding.responseTimeText}</p>
        </div>
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
                    <textarea placeholder="Mesaj yazın..." rows="1"></textarea>
                    <button class="mic-btn" title="Ses kaydı">
                        <svg class="mic-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14C5.9 15.76 8.84 19 12 19c3.16 0 6.1-3.24 6.9-6.86.09-.61-.39-1.14-1-1.14z"/>
                        </svg>
                    </button>
                    <button class="chat-send-btn" disabled>
                        <svg class="send-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    chatContainer.innerHTML = html;

    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 175.216 175.552"> /* WhatsApp SVG */ </svg>`;
    // SVG kısaltıldı, orijinalini koruduk

    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    // === ELEMENTS ===
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('.chat-send-btn');
    const micButton = chatContainer.querySelector('.mic-btn');
    const closeButtons = chatContainer.querySelectorAll('.close-button');

    // === UTILS ===
    function generateUUID() { return crypto.randomUUID(); }
    function showTypingIndicator() {
        const div = document.createElement('div');
        div.className = 'typing-indicator';
        div.innerHTML = `<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
        messagesContainer.appendChild(div);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return div;
    }
    function autoResize(el) {
        el.style.height = 'auto';
        el.style.height = Math.min(el.scrollHeight, 100) + 'px';
    }

    // === SES KAYDI ===
    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
            audioChunks = [];

            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                sendAudio(audioBlob);
                stream.getTracks().forEach(t => t.stop());
            };

            mediaRecorder.start();
            micButton.innerHTML = `<svg class="mic-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="red"/><rect x="8" y="10" width="8" height="4" fill="white"/></svg>`;
            micButton.title = "Kaydı durdur";
        } catch (err) {
            alert("Mikrofon erişimi reddedildi.");
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            micButton.innerHTML = `<svg class="mic-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14C5.9 15.76 8.84 19 12 19c3.16 0 6.1-3.24 6.9-6.86.09-.61-.39-1.14-1-1.14z"/></svg>`;
            micButton.title = "Ses kaydı";
        }
    }

    async function sendAudio(blob) {
        const reader = new FileReader();
        reader.onload = async () => {
            const audioDiv = document.createElement('div');
            audioDiv.className = 'chat-message user audio';
            audioDiv.innerHTML = `
                <audio controls class="audio-player">
                    <source src="${reader.result}" type="audio/webm">
                    Tarayıcınız ses oynatmayı desteklemiyor.
                </audio>
            `;
            messagesContainer.appendChild(audioDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            const typing = showTypingIndicator();
            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify([{
                        action: "sendMessage",
                        sessionId: currentSessionId,
                        route: config.webhook.route,
                        chatInput: "[Ses Mesajı]",
                        metadata: { userId: "", audio: reader.result }
                    }])
                });
                const data = await response.json();
                messagesContainer.removeChild(typing);
                const botDiv = document.createElement('div');
                botDiv.className = 'chat-message bot';
                botDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
                messagesContainer.appendChild(botDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            } catch (err) {
                messagesContainer.removeChild(typing);
            }
        };
        reader.readAsDataURL(blob);
    }

    // === MESAJ GÖNDERME ===
    async function sendMessage(text) {
        if (!text.trim()) return;
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-message user';
        userDiv.textContent = text;
        messagesContainer.appendChild(userDiv);

        const typing = showTypingIndicator();
        try {
            const res = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([{
                    action: "sendMessage",
                    sessionId: currentSessionId,
                    route: config.webhook.route,
                    chatInput: text,
                    metadata: { userId: "" }
                }])
            });
            const data = await res.json();
            messagesContainer.removeChild(typing);
            const botDiv = document.createElement('div');
            botDiv.className = 'chat-message bot';
            botDiv.textContent = Array.isArray(data) ? data[0].output : data.output;
            messagesContainer.appendChild(botDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (err) {
            messagesContainer.removeChild(typing);
        }
    }

    // === EVENT LISTENERS ===
    newChatBtn.addEventListener('click', async () => {
        currentSessionId = generateUUID();
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');
    });

    textarea.addEventListener('input', () => {
        autoResize(textarea);
        sendButton.disabled = !textarea.value.trim();
    });

    sendButton.addEventListener('click', () => {
        const msg = textarea.value.trim();
        if (msg) {
            sendMessage(msg);
            textarea.value = '';
            autoResize(textarea);
            sendButton.disabled = true;
        }
    });

    textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Mikrofon tıklama
    micButton.addEventListener('click', () => {
        if (!mediaRecorder || mediaRecorder.state !== 'recording') {
            startRecording();
        } else {
            stopRecording();
        }
    });

    toggleButton.addEventListener('click', () => chatContainer.classList.toggle('open'));
    closeButtons.forEach(btn => btn.addEventListener('click', () => chatContainer.classList.remove('open')));
})();
</script>
