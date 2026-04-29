// 书籍朗读模块
// 基于 Web Speech API 实现中文语音朗读，支持逐段高亮、语速调节、分页自动翻页

(function () {
    if (!window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    let paragraphs = [];
    let currentIndex = -1;
    let isPlaying = false;
    let isPaused = false;
    let rate = 1;
    let controls = null;

    // 从 ruby 标签中提取纯中文文本（跳过 rt 拼音）
    function extractText(el) {
        let text = '';
        for (const node of el.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'RT') {
                text += extractText(node);
            }
        }
        return text;
    }

    // 收集当前可见页面的所有 <p> 段落
    function collectParagraphs() {
        const activePage = document.querySelector('.page.active');
        const container = activePage || document.querySelector('.book-text');
        if (!container) return [];
        return Array.from(container.querySelectorAll('p')).filter(p => {
            const text = extractText(p).trim();
            return text.length > 0;
        });
    }

    // 朗读指定段落
    function speakParagraph(index) {
        if (index < 0 || index >= paragraphs.length) {
            // 当前页朗读完毕，尝试翻到下一页继续
            if (typeof changePage === 'function') {
                const activePage = document.querySelector('.page.active');
                const allPages = document.querySelectorAll('.page');
                const pageId = activePage ? parseInt(activePage.id.replace('page', '')) : 0;
                if (pageId < allPages.length) {
                    changePage(1);
                    setTimeout(() => {
                        paragraphs = collectParagraphs();
                        if (paragraphs.length > 0) {
                            speakParagraph(0);
                        } else {
                            stopReading();
                        }
                    }, 300);
                    return;
                }
            }
            stopReading();
            return;
        }

        currentIndex = index;
        updateHighlight();

        const text = extractText(paragraphs[index]).trim();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = rate;

        utterance.onend = () => {
            if (isPlaying && !isPaused) {
                speakParagraph(index + 1);
            }
        };

        utterance.onerror = (e) => {
            if (e.error !== 'interrupted' && e.error !== 'canceled') {
                stopReading();
            }
        };

        synth.speak(utterance);
    }

    // 更新高亮
    function updateHighlight() {
        document.querySelectorAll('.reading-highlight').forEach(el => {
            el.classList.remove('reading-highlight');
        });
        if (currentIndex >= 0 && currentIndex < paragraphs.length) {
            paragraphs[currentIndex].classList.add('reading-highlight');
            paragraphs[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // 播放
    function play() {
        if (isPaused) {
            synth.resume();
            isPaused = false;
            isPlaying = true;
            updateButtons();
            return;
        }

        paragraphs = collectParagraphs();
        if (paragraphs.length === 0) return;

        isPlaying = true;
        isPaused = false;
        updateButtons();
        speakParagraph(currentIndex < 0 ? 0 : currentIndex);
    }

    // 暂停
    function pause() {
        synth.pause();
        isPaused = true;
        isPlaying = false;
        updateButtons();
    }

    // 停止
    function stopReading() {
        synth.cancel();
        isPlaying = false;
        isPaused = false;
        currentIndex = -1;
        updateHighlight();
        updateButtons();
    }

    // 设置语速
    function setRate(newRate) {
        rate = newRate;
        controls.querySelectorAll('.rate-btn').forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.dataset.rate) === rate);
        });
        // 如果正在朗读，用新语速重新朗读当前段
        if (isPlaying || isPaused) {
            synth.cancel();
            isPaused = false;
            isPlaying = true;
            updateButtons();
            speakParagraph(currentIndex);
        }
    }

    // 更新按钮状态
    function updateButtons() {
        const playBtn = controls.querySelector('.play-btn');
        const pauseBtn = controls.querySelector('.pause-btn');
        playBtn.style.display = isPlaying ? 'none' : '';
        pauseBtn.style.display = isPlaying ? '' : 'none';
    }

    // 创建控制栏
    function createControls() {
        controls = document.createElement('div');
        controls.className = 'reader-controls';
        controls.innerHTML = `
            <button class="play-btn" title="朗读">▶ 朗读</button>
            <button class="pause-btn" title="暂停" style="display:none">⏸ 暂停</button>
            <button class="stop-btn" title="停止">⏹ 停止</button>
            <div class="speed-group">
                <button class="rate-btn" data-rate="0.5">0.5x</button>
                <button class="rate-btn" data-rate="0.75">0.75x</button>
                <button class="rate-btn active" data-rate="1">1x</button>
                <button class="rate-btn" data-rate="1.25">1.25x</button>
            </div>
        `;

        controls.querySelector('.play-btn').addEventListener('click', play);
        controls.querySelector('.pause-btn').addEventListener('click', pause);
        controls.querySelector('.stop-btn').addEventListener('click', stopReading);
        controls.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', () => setRate(parseFloat(btn.dataset.rate)));
        });

        document.body.appendChild(controls);
    }

    // 初始化
    createControls();
})();
