(function() {
    // CSS Stilleri
    const styles = `
        .chatbot-widget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .chat-toggle {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            position: relative;
        }

        .chat-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .chat-toggle svg {
            width: 24px;
            height: 24px;
            color: white;
            transition: all 0.3s ease;
        }

        .chat-toggle.active svg:first-child {
            transform: rotate(90deg);
            opacity: 0;
        }

        .chat-toggle.active svg:last-child {
            transform: rotate(0deg);
            opacity: 1;
        }

        .close-icon {
            position: absolute;
            transform: rotate(-90deg);
            opacity: 0;
        }

        .chat-container {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 380px;
            height: 500px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2);
            transform: scale(0.8) translateY(20px);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }

        .chat-container.open {
            transform: scale(1) translateY(0);
            opacity: 1;
            visibility: visible;
        }

        .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            text-align: center;
            color: white;
        }

        .chat-title {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .chat-subtitle {
            font-size: 0.9rem;
            opacity: 0.8;
        }

        .chat-messages {
            height: 340px;
            overflow-y: auto;
            padding: 20px;
            background: #f8fafc;
        }

        .chat-messages::-webkit-scrollbar {
            width: 4px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 2px;
        }

        .message {
            display: flex;
            margin-bottom: 16px;
            animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .message.bot { justify-content: flex-start; }
        .message.user { justify-content: flex-end; }

        .message-content {
            max-width: 80%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 0.9rem;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .message.bot .message-content {
            background: white;
            color: #1e293b;
            border-bottom-left-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        .message.user .message-content {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-bottom-right-radius: 6px;
        }

        .chat-input-container {
            padding: 16px 20px;
            background: white;
            border-top: 1px solid #e2e8f0;
        }

        .chat-input {
            display: flex;
            gap: 12px;
            align-items: flex-end;
        }

        .chat-textarea {
            flex: 1;
            min-height: 40px;
            max-height: 100px;
            padding: 10px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 20px;
            resize: none;
            font-family: inherit;
            font-size: 0.9rem;
            color: #1e293b;
            background: white;
            transition: all 0.3s ease;
            line-height: 1.4;
        }

        .chat-textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .chat-textarea::placeholder {
            color: #64748b;
        }

        .send-button {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        .send-button:hover {
            transform: scale(1.05);
        }

        .send-button svg {
            width: 18px;
            height: 18px;
            color: white;
        }

        .typing-indicator {
            display: none;
            padding: 12px 16px;
            margin-bottom: 16px;
        }

        .typing-indicator.show { display: block; }

        .typing-dots {
            display: flex;
            gap: 4px;
        }

        .typing-dot {
            width: 8px;
            height: 8px;
            background: #64748b;
            border-radius: 50%;
            animation: typingDot 1.4s infinite;
        }

        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingDot {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-10px); opacity: 1; }
        }

        @media (max-width: 480px) {
            .chatbot-widget { right: 16px; bottom: 16px; }
            .chat-container { width: 320px; height: 450px; right: -20px; }
        }
    `;

    // Stilleri sayfaya ekle
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Widget HTML'i
    const widgetHTML = `
        <div class="chatbot-widget">
            <button class="chat-toggle" id="chatToggle">
                <svg class="message-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <div class="chat-title">Destek Asistanı</div>
                    <div class="chat-subtitle">Size nasıl yardımcı olabilirim?</div>
                </div>
                
                <div class="chat-messages" id="chatMessages">
                    <div class="typing-indicator" id="typingIndicator">
                        <div class="message bot">
                            <div class="message-content">
                                <div class="typing-dots">
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                    <div class="typing-dot"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chat-input-container">
                    <div class="chat-input">
                        <textarea class="chat-textarea" id="messageInput" placeholder="Mesajınızı yazın..." rows="1"></textarea>
                        <button class="send-button" id="sendButton">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"/>
                                <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Widget'ı sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', widgetHTML);

    // Chatbot sınıfı
    class ChatbotWidget {
        constructor() {
            this.isOpen = false;
            this.messages = [];
            this.isTyping = false;
            
            this.chatToggle = document.getElementById('chatToggle');
            this.chatContainer = document.getElementById('chatContainer');
            this.chatMessages = document.getElementById('chatMessages');
            this.messageInput = document.getElementById('messageInput');
            this.sendButton = document.getElementById('sendButton');
            this.typingIndicator = document.getElementById('typingIndicator');
            
            this.init();
        }
        
        init() {
            this.chatToggle.addEventListener('click', () => this.toggle());
            this.sendButton.addEventListener('click', () => this.sendMessage());
            this.messageInput.addEventListener('keydown', (e) => this.handleKeyPress(e));
            this.messageInput.addEventListener('input', () => this.autoResize());
            
            document.addEventListener('click', (e) => {
                if (this.isOpen && !e.target.closest('.chatbot-widget')) {
                    this.close();
                }
            });
        }
        
        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }
        
        open() {
            this.isOpen = true;
            this.chatContainer.classList.add('open');
            this.chatToggle.classList.add('active');
            this.messageInput.focus();
            
            if (this.messages.length === 0) {
                setTimeout(() => {
                    this.addBotMessage("Merhaba! Size nasıl yardımcı olabilirim?");
                }, 500);
            }
        }
        
        close() {
            this.isOpen = false;
            this.chatContainer.classList.remove('open');
            this.chatToggle.classList.remove('active');
        }
        
        handleKeyPress(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        }
        
        autoResize() {
            const textarea = this.messageInput;
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 100;
            textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
        }
        
        sendMessage() {
            const message = this.messageInput.value.trim();
            if (!message || this.isTyping) return;
            
            this.addUserMessage(message);
            this.messageInput.value = '';
            this.autoResize();
            
            this.simulateBotResponse(message);
        }
        
        addUserMessage(text) {
            this.messages.push({ type: 'user', text });
            this.renderMessage('user', text);
        }
        
        addBotMessage(text) {
            this.messages.push({ type: 'bot', text });
            this.renderMessage('bot', text);
        }
        
        renderMessage(type, text) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.textContent = text;
            
            messageDiv.appendChild(contentDiv);
            this.chatMessages.appendChild(messageDiv);
            
            this.scrollToBottom();
        }
        
        showTyping() {
            this.isTyping = true;
            this.typingIndicator.classList.add('show');
            this.scrollToBottom();
        }
        
        hideTyping() {
            this.isTyping = false;
            this.typingIndicator.classList.remove('show');
        }
        
        simulateBotResponse(userMessage) {
            this.showTyping();
            
            const responses = [
                "Anlıyorum, bu konuda size yardımcı olabilirim.",
                "Bu çok ilginç bir soru. Daha detaylı bilgi verebilir misiniz?",
                "Tabii ki! Bu konuda elimden geldiğince yardımcı olmaya çalışacağım.",
                "Harika bir soru! Bunun için birkaç farklı seçenek var.",
                "Bu durumda size şu önerileri verebilirim...",
                "Teşekkür ederim. Bu bilgiyi not aldım ve size en uygun çözümü bulacağım.",
            ];
            
            let response;
            const lowerMessage = userMessage.toLowerCase();
            
            if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
                response = "Merhaba! Size nasıl yardımcı olabilirim?";
            } else if (lowerMessage.includes('teşekkür') || lowerMessage.includes('sağol')) {
                response = "Rica ederim! Başka bir konuda yardıma ihtiyacınız varsa çekinmeden sorun.";
            } else if (lowerMessage.includes('görüşürüz') || lowerMessage.includes('bye')) {
                response = "Görüşmek üzere! İyi günler dilerim.";
            } else {
                response = responses[Math.floor(Math.random() * responses.length)];
            }
            
            const delay = Math.random() * 2000 + 1000;
            
            setTimeout(() => {
                this.hideTyping();
                this.addBotMessage(response);
            }, delay);
        }
        
        scrollToBottom() {
            setTimeout(() => {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }, 100);
        }
    }
    
    // Widget'ı başlat
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ChatbotWidget());
    } else {
        new ChatbotWidget();
    }
})();
