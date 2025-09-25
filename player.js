// Chat Widget Script
(function() {
    // CSS stilleri doğrudan JavaScript içinde tanımlanır.
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #25D366); /* WhatsApp yeşili */
            --chat--color-secondary: var(--n8n-chat-secondary-color, #075E54); /* WhatsApp koyu yeşili */
            --chat--color-background: var(--n8n-chat-background-color, #e5ddd5); /* WhatsApp sohbet arka planı */
            --chat--color-font: var(--n8n-chat-font-color, #1e1e1e);
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .n8n-chat-widget * {
            box-sizing: border-box;
        }

        .n8n-chat-widget .chat-window {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            width: 380px;
            height: 600px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0);
            transform-origin: bottom right;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            opacity: 0;
            pointer-events: none;
        }

        .n8n-chat-widget .chat-window.open {
            transform: scale(1);
            opacity: 1;
            pointer-events: auto;
        }

        .n8n-chat-widget .chat-header {
            background-color: var(--chat--color-secondary);
            color: white;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 18px;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-header .profile {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .n8n-chat-widget .chat-header .profile-pic {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid white;
            background-color: #fff;
        }

        .n8n-chat-widget .chat-header .profile-name {
            font-weight: 500;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            padding: 10px 15px;
            background-color: var(--chat--color-background);
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }
        
        /* Arka plan deseni */
        .n8n-chat-widget .chat-messages::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 576' width='100%25' height='100%25'%3E%3Cpath fill='%23d2ccbb' d='M0 0h576v576H0z'/%3E%3Cpath fill='%23c2beb4' d='M111 200c3.5 12 11.5 22 25 22s21.5-10 25-22L179 97c-3.5-12-11.5-22-25-22s-21.5 10-25 22zm313 189c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-128-97c3.5 12 11.5 22 25 22s21.5-10 25-22l18-103c-3.5-12-11.5-22-25-22s-21.5 10-25 22zm-67 189c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zM48 259c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm373-97c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-64 189c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-128-97c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-67 189c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22zm-64 128c-3.5-12-11.5-22-25-22s-21.5 10-25 22l-18 103c3.5 12 11.5 22 25 22s21.5-10 25-22z'/%3E%3C/svg%3E");
            opacity: 0.2;
            z-index: -1;
        }

        .n8n-chat-widget .chat-message {
            max-width: 75%;
            padding: 8px 12px;
            margin-bottom: 8px;
            border-radius: 8px;
            font-size: 15px;
            line-height: 1.4;
            word-wrap: break-word;
            position: relative;
        }

        .n8n-chat-widget .chat-message.bot {
            background-color: #fff;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
            box-shadow: 0 1px 1px rgba(0,0,0,0.08);
        }

        .n8n-chat-widget .chat-message.user {
            background-color: #DCF8C6;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
            box-shadow: 0 1px 1px rgba(0,0,0,0.08);
        }

        .n8n-chat-widget .chat-message .timestamp {
            display: block;
            margin-top: 4px;
            font-size: 11px;
            color: #777;
            text-align: right;
        }

        .n8n-chat-widget .chat-input {
            padding: 10px 15px;
            background-color: #f0f2f5;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            min-height: 20px;
            padding: 10px 15px;
            border: 1px solid #ccc;
            border-radius: 20px;
            background-color: #fff;
            font-size: 15px;
            resize: none;
            overflow: hidden;
            line-height: 1.4;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: #888;
        }
        
        .n8n-chat-widget .chat-input textarea:focus {
            outline: none;
            border-color: var(--chat--color-primary);
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

        .n8n-chat-widget .chat-input button:hover {
            background-color: #128C7E;
        }

        .n8n-chat-widget .chat-toggle-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: var(--chat--color-primary);
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
            z-index: 1001;
        }

        .n8n-chat-widget .chat-toggle-button:hover {
            transform: scale(1.05);
        }
        
        .n8n-chat-widget .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
    `;

    // Ayarlar (buradan özelleştirebilirsiniz)
    const config = {
        branding: {
            name: 'Cansu',
            logo: 'https://via.placeholder.com/40',
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

    // Sohbet penceresi ve butonları oluştur
    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window';
    chatWindow.id = 'chatWindow';

    const chatToggleButton = document.createElement('button');
    chatToggleButton.className = 'chat-toggle-button';
    chatToggleButton.id = 'chatToggleButton';
    chatToggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;

    // Sohbet penceresinin HTML içeriğini oluştur
    chatWindow.innerHTML = `
        <div class="chat-header">
            <div class="profile">
                <img src="${config.branding.logo}" alt="${config.branding.name}" class="profile-pic">
                <span class="profile-name">${config.branding.name}</span>
            </div>
            <button class="close-btn">&times;</button>
        </div>
        <div class="chat-messages">
            <div class="chat-message bot">
                ${config.branding.welcomeMessage}
                <span class="timestamp">00:18</span>
            </div>
        </div>
        <div class="chat-input">
            <textarea placeholder="Write your message..." rows="1"></textarea>
            <button class="send-btn">&gt;</button>
        </div>
    `;

    // Elementleri DOM'a ekle
    widgetContainer.appendChild(chatWindow);
    widgetContainer.appendChild(chatToggleButton);
    document.body.appendChild(widgetContainer);

    // Gerekli DOM elementlerini seç
    const chatMessages = chatWindow.querySelector('.chat-messages');
    const chatInput = chatWindow.querySelector('textarea');
    const sendBtn = chatWindow.querySelector('.send-btn');
    const closeBtn = chatWindow.querySelector('.close-btn');

    // Olay dinleyicilerini ekle
    chatToggleButton.addEventListener('click', () => {
        chatWindow.classList.toggle('open');
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.classList.remove('open');
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

        // Burada botun yanıtını simüle edebilir veya bir API çağrısı yapabilirsiniz.
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
})();// Files
