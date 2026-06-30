function renderCorpusPage() {
    const container = document.getElementById('page-content');
    const corpus = storage.getCorpus();
    
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <i class="fa fa-book text-primary"></i>
                        专业语料库
                    </h2>
                    <p class="text-gray-500 mt-1">管理专业术语词条，翻译时优先匹配替换</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="importCorpus()" class="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all-300 flex items-center gap-2">
                        <i class="fa fa-upload"></i>
                        批量导入
                    </button>
                    <button onclick="exportCorpus()" class="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all-300 flex items-center gap-2">
                        <i class="fa fa-download"></i>
                        导出JSON
                    </button>
                    <button onclick="openAddCorpusModal()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-all-300 flex items-center gap-2">
                        <i class="fa fa-plus"></i>
                        新增词条
                    </button>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mb-6">
                <div class="flex-1 relative">
                    <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="text" id="corpus-search" placeholder="搜索术语..." class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                </div>
                <select id="corpus-industry-filter" class="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                    <option value="">全部分类</option>
                    ${INDUSTRIES.map(ind => `<option value="${ind.value}">${ind.label}</option>`).join('')}
                </select>
                <button onclick="clearCorpus()" class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all-300 flex items-center gap-2">
                    <i class="fa fa-trash"></i>
                    清空全部
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-200">
                            <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">原文术语</th>
                            <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">译文术语</th>
                            <th class="text-left px-4 py-3 text-sm font-semibold text-gray-600">所属分类</th>
                            <th class="text-center px-4 py-3 text-sm font-semibold text-gray-600">操作</th>
                        </tr>
                    </thead>
                    <tbody id="corpus-table-body">
                        ${renderCorpusTable(corpus)}
                    </tbody>
                </table>
            </div>

            ${corpus.length === 0 ? `
                <div class="text-center py-12">
                    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fa fa-book text-gray-400 text-2xl"></i>
                    </div>
                    <p class="text-gray-500">暂无术语词条</p>
                    <p class="text-gray-400 text-sm mt-1">点击上方按钮添加专业术语</p>
                </div>
            ` : ''}
        </div>
    `;

    document.getElementById('corpus-search').addEventListener('input', debounce(() => {
        const query = document.getElementById('corpus-search').value;
        const industry = document.getElementById('corpus-industry-filter').value;
        const filtered = storage.searchCorpus(query, industry);
        document.getElementById('corpus-table-body').innerHTML = renderCorpusTable(filtered);
    }, 300));

    document.getElementById('corpus-industry-filter').addEventListener('change', () => {
        const query = document.getElementById('corpus-search').value;
        const industry = document.getElementById('corpus-industry-filter').value;
        const filtered = storage.searchCorpus(query, industry);
        document.getElementById('corpus-table-body').innerHTML = renderCorpusTable(filtered);
    });
}

function renderCorpusTable(corpus) {
    if (!corpus || corpus.length === 0) {
        return '<tr><td colspan="4" class="text-center py-8 text-gray-500">无匹配结果</td></tr>';
    }

    return corpus.map(item => `
        <tr class="border-b border-gray-100 hover:bg-blue-50/50 transition-all-300">
            <td class="px-4 py-3">
                <span class="font-medium text-gray-800">${escapeHtml(item.source)}</span>
            </td>
            <td class="px-4 py-3">
                <span class="text-primary font-medium">${escapeHtml(item.target)}</span>
            </td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getIndustryClass(item.industry)}">
                    ${getIndustryLabel(item.industry)}
                </span>
            </td>
            <td class="px-4 py-3 text-center">
                <div class="flex justify-center gap-2">
                    <button onclick="openEditCorpusModal('${item.id}')" class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all-300" title="编辑">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button onclick="removeCorpusItem('${item.id}')" class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all-300" title="删除">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getIndustryClass(industry) {
    const classes = {
        'it': 'bg-blue-100 text-blue-700',
        'education': 'bg-green-100 text-green-700',
        'medical': 'bg-pink-100 text-pink-700',
        'general': 'bg-gray-100 text-gray-700'
    };
    return classes[industry] || classes['general'];
}

function getIndustryLabel(industry) {
    const labels = {
        'it': 'IT技术',
        'education': '教育培训',
        'medical': '医疗健康',
        'general': '通用领域'
    };
    return labels[industry] || '未知分类';
}

function openAddCorpusModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">新增术语词条</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fa fa-times text-xl"></i>
                </button>
            </div>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">原文术语</label>
                    <input type="text" id="corpus-source" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">译文术语</label>
                    <input type="text" id="corpus-target" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">所属分类</label>
                    <select id="corpus-industry" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                        ${INDUSTRIES.map(ind => `<option value="${ind.value}">${ind.label}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
                <button onclick="closeModal()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all-300">取消</button>
                <button onclick="saveCorpusItem()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-all-300">保存</button>
            </div>
        </div>
    `;
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
}

function openEditCorpusModal(id) {
    const item = storage.getCorpus().find(i => i.id === id);
    if (!item) return;

    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modalContent.innerHTML = `
        <div class="p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-800">编辑术语词条</h3>
                <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
                    <i class="fa fa-times text-xl"></i>
                </button>
            </div>
            <input type="hidden" id="corpus-id" value="${id}">
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">原文术语</label>
                    <input type="text" id="corpus-source" value="${escapeHtml(item.source)}" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">译文术语</label>
                    <input type="text" id="corpus-target" value="${escapeHtml(item.target)}" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">所属分类</label>
                    <select id="corpus-industry" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                        ${INDUSTRIES.map(ind => `<option value="${ind.value}" ${ind.value === item.industry ? 'selected' : ''}>${ind.label}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
                <button onclick="closeModal()" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all-300">取消</button>
                <button onclick="updateCorpusItem()" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-all-300">保存</button>
            </div>
        </div>
    `;
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
}

function saveCorpusItem() {
    const source = document.getElementById('corpus-source').value.trim();
    const target = document.getElementById('corpus-target').value.trim();
    const industry = document.getElementById('corpus-industry').value;

    if (!source || !target) {
        showToast('请填写完整的术语信息', 'warning');
        return;
    }

    storage.addCorpusItem({ source, target, industry });
    showToast('术语添加成功', 'success');
    closeModal();
    renderCorpusPage();
}

function updateCorpusItem() {
    const id = document.getElementById('corpus-id').value;
    const source = document.getElementById('corpus-source').value.trim();
    const target = document.getElementById('corpus-target').value.trim();
    const industry = document.getElementById('corpus-industry').value;

    if (!source || !target) {
        showToast('请填写完整的术语信息', 'warning');
        return;
    }

    storage.updateCorpusItem(id, { source, target, industry });
    showToast('术语更新成功', 'success');
    closeModal();
    renderCorpusPage();
}

function removeCorpusItem(id) {
    showModal('确认删除', '确定要删除这条术语吗？', () => {
        storage.removeCorpusItem(id);
        showToast('术语删除成功', 'success');
        renderCorpusPage();
    });
}

function clearCorpus() {
    showModal('确认清空', '确定要清空所有术语吗？此操作不可恢复。', () => {
        storage.clearCorpus();
        showToast('语料库已清空', 'success');
        renderCorpusPage();
    });
}

function importCorpus() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.csv';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;
            const lines = content.split('\n');
            let importedCount = 0;

            lines.forEach(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return;

                const parts = line.split(/[,，\t]/);
                if (parts.length >= 2) {
                    const source = parts[0].trim();
                    const target = parts[1].trim();
                    const industry = parts[2] ? parts[2].trim() : 'general';

                    if (source && target) {
                        storage.addCorpusItem({ source, target, industry });
                        importedCount++;
                    }
                }
            });

            showToast(`成功导入 ${importedCount} 条术语`, 'success');
            renderCorpusPage();
        };
        reader.readAsText(file, 'UTF-8');
    };
    input.click();
}

function exportCorpus() {
    const corpus = storage.getCorpus();
    const jsonData = JSON.stringify(corpus, null, 2);
    downloadFile(jsonData, 'vibecoding-corpus.json', 'application/json');
    showToast('语料库导出成功', 'success');
}