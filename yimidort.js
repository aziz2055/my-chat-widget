<script>
(function() {
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    const config = window.ChatWidgetConfig || {
        webhook: { url: 'https://your-webhook.com', route: '' },
        branding: { logo: 'https://i.imgur.com/8Y8Z3tM.png', name: 'Cansu', welcomeText: 'Merhaba!', welcomeSubtitle: 'Size nasıl yardımcı olabilirim?', responseTimeText: 'Genelde 1 dakikada cevap veririz' },
        style: { primaryColor: '#25D366', position: 'right' }
    };

    // Stil
    const style = document.createElement('style');
    style.textContent = `
        .wa-widget * { box-sizing: border-box; margin:0; padding:0; }
        .wa-widget { font-family: system-ui, sans-serif; --p: ${config.style.primaryColor}; }
        .wa-widget .box { position:fixed; bottom:100px; right:20px; width:380px; height:560px; background:#fff; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.2); overflow:hidden; display:none; flex-direction:column; z-index:9999; }
        .wa-widget .box.left { right:auto; left:20px; }
        .wa-widget .box.open { display:flex; animation:s 0.3s; }
        @keyframes s { from{opacity:0; transform:translateY(20px)} }
        .wa-widget .head { background:#075e54; color:#fff; padding:16px 20px; display:flex; align-items:center; gap:12px; position:relative; }
        .wa-widget .head img { width:40px; height:40px; border-radius:50%; }
        .wa-widget .head span { font-weight:500; font-size:17px; }
        .wa-widget .close { position:absolute; right:16px; top:50%; transform:translateY(-50%); background:none; border:none; color:#fff; font-size:28px; cursor:pointer; }
        .wa-widget .start { flex:1; background:#ece5dd; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; padding:40px 30px; }
        .wa-widget .start h2 { font-size:20px; color:#54656f; margin-bottom:8px; }
        .wa-widget .start p { font-size:14px; color:#667781; margin-bottom:24px; }
        .wa-widget .start button { background:var(--p); color:#fff; border:none; padding:14px 0; width:100%; border-radius:50px; font-size:15px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; }
        .wa-widget .start button:hover { background:#22c55e; }
        .wa-widget .chat { display:none; flex-direction:column; height:100%; }
        .wa-widget .chat.active { display:flex; }
        .wa-widget .msgs { flex:1; overflow-y:auto; background:#e5ddd5; padding:12px; display:flex; flex-direction:column; gap:8px; }
        .wa-widget .msg { max-width:75%; padding:8px 12px; border-radius:8px; font-size:14px; line-height:1.4; box-shadow:0 1px .5px rgba(0,0,0,.13); }
        .wa-widget .msg.u { background:#dcf8c6; align-self:flex-end; border-radius:8px 8px 0 8px; }
        .wa-widget .msg.b { background:#fff; align-self:flex-start; border-radius:8px 8px 8px 0; }
        .wa-widget .msg.a { background:#dcf8c6; padding:10px; border-radius:12px 12px 4px 12px; }
        .wa-widget .msg.a audio { width:100%; height:38px; }
        .wa-widget .inp { padding:10px 16px 16px; background:#f0f2f5; }
        .wa-widget .in { display:flex; align-items:flex-end; background:#fff; border-radius:50px; padding:8px 12px; box-shadow:0 1px 3px rgba(0,0,0,.1); gap:8px; }
        .wa-widget .in textarea { flex:1; border:none; outline:none; resize:none; font-size:15px; max-height:100px; background:transparent; }
        .wa-widget .in button { width:36px; height:36px; border:none; border-radius:50%; background:var(--p); color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .wa-widget .in button:disabled { opacity:.5; cursor:not-allowed; }
        .wa-widget .in button:hover:not(:disabled) { background:#22c55e; }
        .wa-widget .btn { position:fixed; bottom:20px; right:20px; width:70px; height:70px; border-radius:50%; background:var(--p); border:none; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,.15); z-index:9999; }
        .wa-widget .btn.left { right:auto; left:20px; }
        .wa-widget .btn svg { width:36px; height:36px; fill:#fff; }
        .wa-widget .typing { align-self:flex-start; background:#fff; padding:8px 12px; border-radius:8px; }
        .wa-widget .typing span { display:inline-flex; gap:4px; }
        .wa-widget .typing span i { width:6px; height:6px; background:#8696a0; border-radius:50%; animation:t 1.4s infinite; }
        .wa-widget .typing span i:nth-child(2) { animation-delay:.16s; }
        .wa-widget .typing span i:nth-child(3) { animation-delay:.32s; }
        @keyframes t { 0%,80%,100% { transform:scale(.8); opacity:.5; } 40% { transform:scale(1); opacity:1; } }
    `;
    document.head.appendChild(style);

    // HTML
    const box = document.createElement('div');
    box.className = `wa-widget box${config.style.position==='left'?' left':''}`;
    box.innerHTML = `
        <div class="head"><img src="${config.branding.logo}" alt=""><span>${config.branding.name}</span><button class="close">x</button></div>
        <div class="start">
            <h2>${config.branding.welcomeText}</h2>
            <p>${config.branding.welcomeSubtitle}</p>
            <button class="new">Sohbete Başla</button>
            <p style="font-size:13px;color:#8696a0;margin-top:12px;">${config.branding.responseTimeText}</p>
        </div>
        <div class="chat">
            <div class="head"><img src="${config.branding.logo}" alt=""><span>${config.branding.name}</span><button class="close">x</button></div>
            <div class="msgs"><div class="msg b">Merhaba! Size nasıl yardımcı olabilirim?</div></div>
            <div class="inp">
                <div class="in">
                    <textarea placeholder="Mesaj yaz..." rows="1"></textarea>
                    <button class="mic" title="Ses kaydı">Mic</button>
                    <button class="send" disabled>Send</button>
                </div>
            </div>
        </div>
    `;

    const btn = document.createElement('button');
    btn.className = `wa-widget btn${config.style.position==='left'?' left':''}`;
    btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`;

    document.body.append(box, btn);

    // Elemanlar
    const start = box.querySelector('.start');
    const chat = box.querySelector('.chat');
    const msgs = box.querySelector('.msgs');
    const txt = box.querySelector('textarea');
    const send = box.querySelector('.send');
    const mic = box.querySelector('.mic');
    const newBtn = box.querySelector('.new');
    let rec = null, chunks = [], session = '';

    // Fonksiyonlar
    const uuid = () => crypto.randomUUID();
    const type = () => {
        const t = document.createElement('div');
        t.className = 'msg b typing';
        t.innerHTML = '<span><i></i><i></i><i></i></span>';
        msgs.appendChild(t);
        msgs.scrollTop = msgs.scrollHeight;
        return t;
    };
    const resize = () => {
        txt.style.height = 'auto';
        txt.style.height = Math.min(txt.scrollHeight, 100) + 'px';
        send.disabled = !txt.value.trim();
    };
    const addMsg = (text, from) => {
        const m = document.createElement('div');
        m.className = `msg ${from}`;
        if (from === 'a') {
            m.innerHTML = `<audio controls><source src="${text}" type="audio/webm"></audio>`;
        } else {
            m.textContent = text;
        }
        msgs.appendChild(m);
        msgs.scrollTop = msgs.scrollHeight;
    };

    const post = async (data) => {
        const t = type();
        try {
            const r = await fetch(config.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Array.isArray(data) ? data : [data])
            });
            const j = await r.json();
            msgs.removeChild(t);
            addMsg(Array.isArray(j) ? j[0].output : j.output, 'b');
        } catch { msgs.removeChild(t); }
    };

    // Ses
    mic.onclick = async () => {
        if (rec?.state === 'recording') {
            rec.stop();
            mic.innerHTML = 'Mic';
            mic.style.background = '';
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            rec = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            chunks = [];
            rec.ondataavailable = e => chunks.push(e.data);
            rec.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                addMsg(url, 'a');
                const reader = new FileReader();
                reader.onload = () => post({
                    action: "sendMessage",
                    sessionId: session,
                    route: config.webhook.route,
                    chatInput: "[Ses]",
                    metadata: { audio: reader.result }
                });
                reader.readAsDataURL(blob);
                stream.getTracks().forEach(t => t.stop());
            };
            rec.start();
            mic.innerHTML = 'Stop';
            mic.style.background = '#e74c3c';
        } catch { alert('Mikrofon izni verilmedi'); }
    };

    // Mesaj
    send.onclick = () => {
        if (!txt.value.trim()) return;
        addMsg(txt.value, 'u');
        post({
            action: "sendMessage",
            sessionId: session,
            route: config.webhook.route,
            chatInput: txt.value,
            metadata: { userId: "" }
        });
        txt.value = '';
        resize();
    };

    txt.oninput = resize;
    txt.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send.click(); } };

    // Başlat
    newBtn.onclick = () => {
        session = uuid();
        start.style.display = 'none';
        chat.classList.add('active');
        post([{ action: "loadPreviousSession", sessionId: session, route: config.webhook.route }]);
    };

    // Aç/Kapat
    btn.onclick = () => box.classList.toggle('open');
    box.querySelectorAll('.close').forEach(b => b.onclick = () => box.classList.remove('open'));

    // İlk yükleme
    resize();
})();
</script>
