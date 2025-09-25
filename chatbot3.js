// Chat Widget Script
(function() {
    // Stilleri fotoğrafa göre güncelledik.
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: #075E54; /* WhatsApp yeşili */
            --chat--color-secondary: #DCF8C6; /* Mesaj balonu rengi */
            --chat--color-background: #e5ddd5; /* Sohbet arka planı */
            --chat--color-font: #1e1e1e;
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Genel kutu modelini koruduk */
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
            border: 1px solid rgba(0, 0, 0, 0.1);
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
        }

        /* Başlık tasarımı */
        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background-color: var(--chat--color-primary);
            color: white;
            position: relative;
        }
        
        /* Sağdaki ikonlar */
        .n8n-chat-widget .header-icons {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .n8n-chat-widget .header-icons svg {
            fill: white;
            width: 24px;
            height: 24px;
            cursor: pointer;
        }

        .n8n-chat-widget .brand-header img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid white;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: white;
        }

        /* Yeni konuşma butonu kaldırıldı, direkt sohbet arayüzü açılıyor */
        .n8n-chat-widget .new-conversation {
            display: none;
        }
        
        .n8n-chat-widget .chat-interface {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }
        
        /* Mesaj listesi arka planı ve stili */
        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 10px 15px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
            position: relative;
        }

        /* WhatsApp benzeri desen */
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

        .n8n-chat-widget .chat-message.user {
            background-color: var(--chat--color-secondary);
            color: var(--chat--color-font);
            align-self: flex-end;
            border-bottom-right-radius: 2px;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: white;
            color: var(--chat--color-font);
            align-self: flex-start;
            border-bottom-left-radius: 2px;
            box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
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
            background: #f0f2f5;
            border-top: none;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px 16px;
            border: none;
            border-radius: 20px;
            background: white;
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: var(--chat--color-primary);
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
        
        .n8n-chat-widget .chat-toggle svg {
            width: 30px;
            height: 30px;
            fill: currentColor;
        }
        
        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-footer {
            display: none; /* Footer'ı kaldırdık */
        }
    `;

    // Fontları yükle
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap';
    document.head.appendChild(fontLink);

    // Stilleri sayfaya ekle
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Ayarlar (Buradan düzenleyebilirsiniz)
    const config = {
        branding: {
            // WhatsApp logosu ve bir kız resmi URL'si
            logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
            name: 'Cansu',
            welcomeText: 'Merhaba, ben Cansu! Size nasıl yardımcı olabilirim?',
            kizResmi: 'https://cdn.pixabay.com/photo/2021/01/21/08/45/girl-5936710_1280.jpg'
        },
        style: {
            position: 'right',
        }
    };
    
    // Çoklu başlatmayı önle
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Widget ana konteynerini oluştur
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    // Fotoğraftaki gibi direkt sohbet arayüzünü göster
    const chatInterfaceHTML = `
        <div class="chat-interface active">
            <div class="brand-header">
                <img src="${config.branding.logo}" alt="WhatsApp Logo">
                <span>${config.branding.name}</span>
                <div class="header-icons">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 15L6 9h12l-6 6z"/></svg>
                </div>
            </div>
            <div class="chat-messages">
                <div class="chat-message bot">
                    ${config.branding.welcomeText}
                    <span class="timestamp">${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
            <div class="chat-input">
                <textarea placeholder="Write your message here..." rows="1"></textarea>
                <button type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = chatInterfaceHTML;
    
    // Toggle butonu (WhatsApp logosu)
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

    function generateUUID() {
        return crypto.randomUUID();
    }

    // Mesaj gönderme fonksiyonu
    async function sendMessage(message) {
        // Kullanıcı mesajını ekle
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.innerHTML = `${message}<span class="timestamp">${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>`;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Burada webhook çağrısı yerine bir bot yanıtı simülasyonu yapıyoruz.
        setTimeout(() => {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = `Anladım. Başka ne konuda yardımcı olabilirim?<span class="timestamp">${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>`;
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1000);
    }
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Kapatma butonu
    const closeButton = chatContainer.querySelector('.header-icons svg:last-child');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            chatContainer.classList.remove('open');
        });
    }

    // Metin alanının yüksekliğini otomatik ayarla
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
})();
