function renderTranslatePage() {
    const container = document.getElementById('page-content');
    
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <i class="fa fa-file-text-o text-primary"></i>
                        文本翻译
                    </h2>
                    <p class="text-gray-500 mt-1">支持多语言互译，优先匹配专业术语和记忆库</p>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <i class="fa fa-lightbulb-o text-yellow-500"></i>
                    <span>翻译优先级：专业语料库 > 翻译记忆库 > API</span>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <div class="flex-1 flex items-center gap-2">
                    <select id="translate-source-lang" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                        ${LANGUAGES.map(lang => `<option value="${lang.code}" ${lang.code === 'zh' ? 'selected' : ''}>${lang.name}</option>`).join('')}
                    </select>
                </div>
                <button onclick="swapLanguages()" class="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all-300">
                    <i class="fa fa-exchange text-lg"></i>
                </button>
                <div class="flex-1 flex items-center gap-2">
                    <select id="translate-target-lang" class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                        ${LANGUAGES.map(lang => `<option value="${lang.code}" ${lang.code === 'en' ? 'selected' : ''}>${lang.name}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label class="block text-sm font-medium text-gray-700">原文输入</label>
                        <button onclick="clearSource()" class="text-sm text-gray-400 hover:text-gray-600 transition-all-300">
                            <i class="fa fa-trash"></i> 清空
                        </button>
                    </div>
                    <textarea id="translate-input" rows="15" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300 resize-none scrollbar-thin" placeholder="请输入需要翻译的文本..."></textarea>
                    <div class="flex items-center justify-between text-xs text-gray-400">
                        <span>支持大段文本输入</span>
                        <span id="input-char-count">0 字符</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label class="block text-sm font-medium text-gray-700">译文输出</label>
                        <button onclick="copyTranslation()" class="text-sm text-primary hover:text-primaryDark transition-all-300 flex items-center gap-1">
                            <i class="fa fa-copy"></i> 复制译文
                        </button>
                    </div>
                    <div id="translate-output" class="w-full h-[340px] px-4 py-3 border border-gray-200 rounded-xl overflow-y-auto scrollbar-thin bg-gray-50">
                        <div class="flex items-center justify-center h-full text-gray-400">
                            翻译结果将显示在这里...
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
                <button onclick="doTranslate()" id="translate-btn" class="flex-1 sm:flex-none min-w-[200px] px-8 py-3 bg-gradient-to-r from-primary to-primaryDark text-white rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all-300 flex items-center justify-center gap-2">
                    <i class="fa fa-language"></i>
                    开始翻译
                </button>
            </div>

            <div id="translate-status" class="mt-4 text-center text-sm text-gray-500 hidden">
                <span class="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
                <span id="status-text">正在翻译中...</span>
            </div>

            <div class="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary" id="stat-memory">0</div>
                        <div class="text-sm text-gray-500">记忆库条目</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-accent" id="stat-corpus">0</div>
                        <div class="text-sm text-gray-500">语料库术语</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-green-600" id="stat-api">API</div>
                        <div class="text-sm text-gray-500">翻译接口</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('translate-input').addEventListener('input', () => {
        const count = document.getElementById('translate-input').value.length;
        document.getElementById('input-char-count').textContent = `${count} 字符`;
    });

    updateStats();
}

function updateStats() {
    const memoryCount = storage.getMemory().length;
    const corpusCount = storage.getCorpus().length;
    
    document.getElementById('stat-memory').textContent = memoryCount;
    document.getElementById('stat-corpus').textContent = corpusCount;
}

function swapLanguages() {
    const sourceSelect = document.getElementById('translate-source-lang');
    const targetSelect = document.getElementById('translate-target-lang');
    const sourceText = document.getElementById('translate-input');
    const targetText = document.getElementById('translate-output');

    const tempLang = sourceSelect.value;
    sourceSelect.value = targetSelect.value;
    targetSelect.value = tempLang;

    const tempText = sourceText.value;
    sourceText.value = targetText.textContent === '翻译结果将显示在这里...' ? '' : targetText.textContent;
    targetText.innerHTML = tempText ? `<div class="flex items-center justify-center h-full text-gray-400">${tempText}</div>` : '<div class="flex items-center justify-center h-full text-gray-400">翻译结果将显示在这里...</div>';
}

function clearSource() {
    document.getElementById('translate-input').value = '';
    document.getElementById('input-char-count').textContent = '0 字符';
    document.getElementById('translate-output').innerHTML = '<div class="flex items-center justify-center h-full text-gray-400">翻译结果将显示在这里...</div>';
}

async function copyTranslation() {
    const output = document.getElementById('translate-output').textContent;
    
    if (!output || output === '翻译结果将显示在这里...') {
        showToast('没有可复制的内容', 'warning');
        return;
    }

    try {
        await copyToClipboard(output);
        showToast('译文已复制到剪贴板', 'success');
    } catch (err) {
        showToast('复制失败，请手动复制', 'error');
    }
}

async function doTranslate() {
    const input = document.getElementById('translate-input').value.trim();
    const sourceLang = document.getElementById('translate-source-lang').value;
    const targetLang = document.getElementById('translate-target-lang').value;
    const btn = document.getElementById('translate-btn');
    const status = document.getElementById('translate-status');
    const statusText = document.getElementById('status-text');
    const output = document.getElementById('translate-output');

    if (!input) {
        showToast('请输入需要翻译的文本', 'warning');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fa fa-spinner fa-spin"></i> 翻译中...`;
    status.classList.remove('hidden');

    try {
        const result = await translateWithPriority(input, sourceLang, targetLang);
        
        statusText.textContent = `翻译完成（来源：${getTranslationSourceLabel(result.from)}）`;
        output.innerHTML = `<div class="whitespace-pre-wrap text-gray-800">${escapeHtml(result.translatedText)}</div>`;

        if (result.from !== 'memory') {
            storage.addMemoryItem({
                source: input,
                target: result.translatedText,
                sourceLang,
                targetLang
            });
        }

        showToast('翻译成功', 'success');

    } catch (error) {
        statusText.textContent = '翻译失败';
        output.innerHTML = `<div class="text-red-500 text-center h-full flex items-center justify-center">${escapeHtml(error.message)}</div>`;
        showToast(error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa fa-language"></i> 开始翻译`;
        updateStats();
    }
}

async function translateWithPriority(text, sourceLang, targetLang) {
    // 优先级1：专业语料库术语替换
    const corpusResult = storage.replaceCorpusTerms(text);
    
    // 优先级2：翻译记忆库缓存
    const memoryMatch = storage.getMemoryBySource(text, sourceLang, targetLang);
    if (memoryMatch) {
        return {
            translatedText: storage.replaceCorpusTerms(memoryMatch.target),
            from: 'memory'
        };
    }

    // 优先级3：调用翻译API
    const apiResult = await api.translate(corpusResult, sourceLang, targetLang);
    
    // 对API返回结果再次进行术语替换
    return {
        translatedText: storage.replaceCorpusTerms(apiResult.translatedText),
        from: apiResult.from
    };
}

function getTranslationSourceLabel(source) {
    const labels = {
        'memory': '翻译记忆库',
        'mymemory': 'MyMemory翻译API',
        'baidu': '百度翻译API',
        'openai': 'OpenAI翻译API',
        'deepseek': 'DeepSeek翻译API',
        'doubao': '豆包翻译API',
        'same-lang': '相同语言',
        'corpus': '专业语料库'
    };
    return labels[source] || source;
}