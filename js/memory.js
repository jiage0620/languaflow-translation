function renderMemoryPage() {
    const container = document.getElementById('page-content');
    const memory = storage.getMemory();
    
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <i class="fa fa-database text-primary"></i>
                        翻译记忆库
                    </h2>
                    <p class="text-gray-500 mt-1">自动保存翻译记录，相同内容优先读取缓存</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="exportMemory()" class="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all-300 flex items-center gap-2">
                        <i class="fa fa-download"></i>
                        导出JSON
                    </button>
                    <button onclick="clearMemory()" class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all-300 flex items-center gap-2">
                        <i class="fa fa-trash"></i>
                        清空全部
                    </button>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mb-6">
                <div class="flex-1 relative">
                    <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="text" id="memory-search" placeholder="搜索翻译记录..." class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                </div>
                <div class="flex gap-2">
                    <select id="memory-source-lang" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                        <option value="">源语种</option>
                        ${LANGUAGES.map(lang => `<option value="${lang.code}">${lang.name}</option>`).join('')}
                    </select>
                    <select id="memory-target-lang" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                        <option value="">目标语种</option>
                        ${LANGUAGES.map(lang => `<option value="${lang.code}">${lang.name}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="grid gap-4" id="memory-list">
                ${renderMemoryList(memory)}
            </div>

            ${memory.length === 0 ? `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa fa-database text-gray-400 text-2xl"></i>
                    </div>
                    <p class="text-gray-500">暂无翻译记录</p>
                    <p class="text-gray-400 text-sm mt-1">使用文本翻译功能后，记录会自动保存到这里</p>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('memory-search').addEventListener('input', debounce(() => {
        const query = document.getElementById('memory-search').value;
        const sourceLang = document.getElementById('memory-source-lang').value;
        const targetLang = document.getElementById('memory-target-lang').value;
        const filtered = storage.searchMemory(query, sourceLang, targetLang);
        document.getElementById('memory-list').innerHTML = renderMemoryList(filtered);
    }, 300));

    document.getElementById('memory-source-lang').addEventListener('change', () => {
        const query = document.getElementById('memory-search').value;
        const sourceLang = document.getElementById('memory-source-lang').value;
        const targetLang = document.getElementById('memory-target-lang').value;
        const filtered = storage.searchMemory(query, sourceLang, targetLang);
        document.getElementById('memory-list').innerHTML = renderMemoryList(filtered);
    });

    document.getElementById('memory-target-lang').addEventListener('change', () => {
        const query = document.getElementById('memory-search').value;
        const sourceLang = document.getElementById('memory-source-lang').value;
        const targetLang = document.getElementById('memory-target-lang').value;
        const filtered = storage.searchMemory(query, sourceLang, targetLang);
        document.getElementById('memory-list').innerHTML = renderMemoryList(filtered);
    });
}

function renderMemoryList(memory) {
    if (!memory || memory.length === 0) {
        return '<div class="text-center py-8 text-gray-500">无匹配结果</div>';
    }

    return memory.map(item => `
        <div class="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-xl p-4 border border-blue-100 hover:shadow-md transition-all-300">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            ${getLangName(item.sourceLang)} → ${getLangName(item.targetLang)}
                        </span>
                        <span class="text-xs text-gray-400">${formatDate(item.timestamp)}</span>
                    </div>
                    <div class="text-gray-800 mb-2">
                        <span class="text-sm font-medium">原文：</span>
                        <span>${escapeHtml(item.source)}</span>
                    </div>
                    <div class="text-primary">
                        <span class="text-sm font-medium">译文：</span>
                        <span>${escapeHtml(item.target)}</span>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <button onclick="copyToClipboard('${escapeHtml(item.target)}').then(() => showToast('译文已复制', 'success'))" class="px-3 py-1.5 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-all-300 flex items-center justify-center gap-1">
                        <i class="fa fa-copy"></i>
                        复制译文
                    </button>
                    <button onclick="removeMemoryItem('${item.id}')" class="px-3 py-1.5 bg-white text-red-600 border border-red-100 rounded-lg text-sm hover:bg-red-50 transition-all-300 flex items-center justify-center gap-1">
                        <i class="fa fa-trash"></i>
                        删除
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getLangName(code) {
    const lang = LANGUAGES.find(l => l.code === code);
    return lang ? lang.name : code;
}

function removeMemoryItem(id) {
    showModal('确认删除', '确定要删除这条翻译记录吗？', () => {
        storage.removeMemoryItem(id);
        showToast('记录删除成功', 'success');
        renderMemoryPage();
    });
}

function clearMemory() {
    showModal('确认清空', '确定要清空所有翻译记录吗？此操作不可恢复。', () => {
        storage.clearMemory();
        showToast('记忆库已清空', 'success');
        renderMemoryPage();
    });
}

function exportMemory() {
    const memory = storage.getMemory();
    const jsonData = JSON.stringify(memory, null, 2);
    downloadFile(jsonData, 'vibecoding-memory.json', 'application/json');
    showToast('记忆库导出成功', 'success');
}