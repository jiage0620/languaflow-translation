function renderSubtitlePage() {
    const container = document.getElementById('page-content');
    
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <i class="fa fa-cc-subtitles text-primary"></i>
                        实时字幕翻译
                    </h2>
                    <p class="text-gray-500 mt-1">粘贴SRT字幕文本，批量翻译并导出</p>
                </div>
                <div class="flex gap-3">
                    <button onclick="downloadSubtitle()" class="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all-300 flex items-center gap-2">
                        <i class="fa fa-download"></i>
                        导出字幕
                    </button>
                    <button onclick="clearSubtitle()" class="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all-300 flex items-center gap-2">
                        <i class="fa fa-trash"></i>
                        清空内容
                    </button>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mb-4">
                <select id="subtitle-source-lang" class="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                    <option value="en">英文字幕</option>
                    <option value="zh">中文字幕</option>
                    <option value="ja">日文字幕</option>
                    <option value="ko">韩文字幕</option>
                </select>
                <select id="subtitle-target-lang" class="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                    <option value="zh">翻译为中文</option>
                    <option value="en">翻译为英语</option>
                    <option value="ja">翻译为日语</option>
                    <option value="ko">翻译为韩语</option>
                </select>
                <button onclick="translateSubtitle()" id="subtitle-translate-btn" class="flex-1 sm:flex-none px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-all-300 flex items-center justify-center gap-2">
                    <i class="fa fa-language"></i>
                    一键翻译全部
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">原文字幕 (SRT格式)</label>
                    <textarea id="subtitle-input" rows="20" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300 resize-none scrollbar-thin" placeholder="在此粘贴标准SRT字幕文本...&#10;&#10;示例格式：&#10;1&#10;00:00:01,000 --> 00:00:04,000&#10;Hello, welcome to our translation system.&#10;&#10;2&#10;00:00:05,000 --> 00:00:08,000&#10;This is a subtitle example."></textarea>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">译文字幕 (翻译后)</label>
                    <textarea id="subtitle-output" rows="20" class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300 resize-none scrollbar-thin" placeholder="翻译结果将显示在这里..."></textarea>
                </div>
            </div>

            <div class="mt-6 bg-blue-50 rounded-xl p-4">
                <h3 class="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <i class="fa fa-info-circle"></i>
                    使用说明
                </h3>
                <ul class="text-sm text-blue-700 space-y-1">
                    <li>• 粘贴标准SRT格式的字幕文本到左侧输入框</li>
                    <li>• 系统会自动识别时间轴，只翻译字幕内容</li>
                    <li>• 点击"一键翻译全部"批量翻译所有字幕</li>
                    <li>• 翻译后的字幕保留原始时间轴格式，可直接用于视频剪辑</li>
                    <li>• 支持导出为TXT文件，方便后续使用</li>
                </ul>
            </div>
        </div>
    `;
}

async function translateSubtitle() {
    const input = document.getElementById('subtitle-input').value;
    const sourceLang = document.getElementById('subtitle-source-lang').value;
    const targetLang = document.getElementById('subtitle-target-lang').value;
    const btn = document.getElementById('subtitle-translate-btn');

    if (!input.trim()) {
        showToast('请输入字幕内容', 'warning');
        return;
    }

    const subtitles = parseSRT(input);
    
    if (subtitles.length === 0) {
        showToast('无法识别字幕格式，请检查SRT格式是否正确', 'error');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = `<i class="fa fa-spinner fa-spin"></i> 翻译中...`;

    let translatedCount = 0;

    for (let i = 0; i < subtitles.length; i++) {
        try {
            const result = await translateWithPriority(subtitles[i].text, sourceLang, targetLang);
            subtitles[i].text = result.translatedText;
            translatedCount++;
            
            document.getElementById('subtitle-output').value = formatSRT(subtitles);
        } catch (error) {
            console.error(`翻译第 ${i + 1} 条字幕失败:`, error);
        }
    }

    btn.disabled = false;
    btn.innerHTML = `<i class="fa fa-language"></i> 一键翻译全部`;
    showToast(`成功翻译 ${translatedCount} 条字幕`, 'success');
}

function downloadSubtitle() {
    const output = document.getElementById('subtitle-output').value;
    
    if (!output.trim()) {
        showToast('没有可导出的内容', 'warning');
        return;
    }

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadFile(output, `vibecoding-subtitle-${timestamp}.txt`, 'text/plain');
    showToast('字幕导出成功', 'success');
}

function clearSubtitle() {
    document.getElementById('subtitle-input').value = '';
    document.getElementById('subtitle-output').value = '';
    showToast('内容已清空', 'info');
}