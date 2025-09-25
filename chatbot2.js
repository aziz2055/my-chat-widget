// Chat Widget Script
(function() {
    // CSS stilleri
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: #075E54;
            --chat--color-secondary: #DCF8C6;
            --chat--color-background: #e5ddd5;
            --chat--color-font: #1e1e1e;
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .n8n-chat-widget * {
            box-sizing: border-box;
        }
        
        /* Genel konteyner */
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            font-family: inherit;
        }
        
        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        /* Başlık alanı */
        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: var(--chat--color-primary);
            color: white;
            position: relative;
        }

        /* Başlık resimleri */
        .n8n-chat-widget .brand-header img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid white;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
        }
        
        .n8n-chat-widget .header-icons {
            position: absolute;
            right: 16px;
            display: flex;
            gap: 12px;
        }
        
        .n8n-chat-widget .header-icons svg {
            fill: white;
            width: 24px;
            height: 24px;
            cursor: pointer;
        }

        /* Mesaj listesi */
        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 10px 15px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        /* Mesaj listesi arka plan deseni */
        .n8n-chat-widget .chat-messages::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 576" width="100%25" height="100%25"%3E%3Cpath fill="%23d2ccbb" d="M0 0h576v576H0z"/%3E%3Cpath fill="%23c2beb4" d="M111 200c3.5 12 11.5 22 25 22s21.5-10 25-22L179 97c-3.5-12-11.5-22-25-22s-21.5 10-25 22zm313 189c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-128-97c3.5 12 11.5 22 25 22s21.5-10 25-22l18-103c-3.5-12-11.5-22-25-22s-21.5 10-25 22zm-67 189c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zM48 259c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm373-97c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-64 189c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-128-97c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-67 189c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-64 128c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22z"/%3E%3C/svg%3E');
            opacity: 0.2;
            z-index: -1;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: 0 1px 1px rgba(0,0,0,0.08);
            position: relative;
        }
        
        .n8n-chat-widget .chat-message.bot {
            background-color: white;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
        }

        .n8n-chat-widget .chat-message.user {
            background-color: var(--chat--color-secondary);
            align-self: flex-end;
            border-bottom-right-radius: 2px;
        }
        
        .n8n-chat-widget .chat-message .timestamp {
            display: block;
            margin-top: 4px;
            font-size: 11px;
            color: #777;
            text-align: right;
        }

        /* Giriş alanı */
        .n8n-chat-widget .chat-input {
            padding: 10px 15px;
            background-color: #f0f2f5;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 20px;
            background-color: white;
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            min-height: 20px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background-color: var(--chat--color-primary);
            color: white;
            border: none;
            border-radius: 50%;
            width: 45px;
            height: 45px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.2s;
            font-size: 20px;
        }

        /* Toggle butonu */
        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--chat--color-primary);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            z-index: 999;
            transition: transform 0.3s;
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
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 30px;
            height: 30px;
            fill: currentColor;
        }
    `;

    // Ayarlar (Buradan düzenleyebilirsiniz)
    const config = {
        branding: {
            // Profil resmi ve isim
            logo: 'https://cdn.pixabay.com/photo/2021/01/21/08/45/girl-5936710_1280.jpg', // Kız resmi
            name: 'Cansu',
            // WhatsApp logo URL'si
            whatsappLogo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
            welcomeMessage: 'Merhaba, ben Cansu! Size nasıl yardımcı olabilirim?',
        }
    };

    // Stilleri sayfaya ekle
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Ana widget kapsayıcısını oluştur
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';

    // Sohbet penceresini oluştur
    const chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container';
    chatContainer.id = 'chatWindow';

    // Toggle butonu
    const toggleButton = document.createElement('button');
    toggleButton.className = 'chat-toggle';
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>
    `;

    // Sohbet penceresinin HTML içeriğini oluştur
    chatContainer.innerHTML = `
        <div class="brand-header">
            <img src="${config.branding.whatsappLogo}" alt="WhatsApp Logo">
            <span>${config.branding.name}</span>
            <div class="header-icons">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.5 14.5a.75.75 0 01-.75-.75.75.75 0 011.5 0 .75.75 0 01-.75.75zM12 14.5a.75.75 0 01-.75-.75.75.75 0 011.5 0 .75.75 0 01-.75.75zM7.5 14.5a.75.75 0 01-.75-.75.75.75 0 011.5 0 .75.75 0 01-.75.75zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 15L6 9h12l-6 6z"/></svg>
            </div>
        </div>
        <div class="chat-messages">
            <div class="chat-message bot">
                <img src="${config.branding.logo}" style="width: 32px; height: 32px; border-radius: 50%; margin-right: 8px;">
                ${config.branding.welcomeMessage}
                <span class="timestamp">00:18</span>
            </div>
        </div>
        <div class="chat-input">
            <textarea placeholder="Write your message..." rows="1"></textarea>
            <button class="send-btn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
        </div>
    `;

    // DOM'a elementleri ekle
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    // DOM elementlerini seç
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = chatContainer.querySelector('.chat-messages');
    const chatInput = chatContainer.querySelector('textarea');
    const sendBtn = chatContainer.querySelector('.send-btn');
    const headerIcons = chatContainer.querySelector('.header-icons');

    // Olay dinleyicilerini ekle
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    headerIcons.querySelector('svg:last-child').addEventListener('click', () => {
        chatContainer.classList.remove('open');
    });

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Mesaj gönderme fonksiyonu
    function sendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.innerHTML = `${messageText}<span class="timestamp">${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>`;
        chatMessages.appendChild(messageDiv);

        chatInput.value = '';
        chatInput.style.height = 'auto';

        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Bot yanıtını simüle et
        setTimeout(() => {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = `Anladım. Başka ne konuda yardımcı olabilirim?<span class="timestamp">${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>`;
            chatMessages.appendChild(botMessageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
    
    // Metin alanının yüksekliğini otomatik ayarla
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
    });
})();
