const STORAGE_KEYS = {
    MEMORY: 'vibecoding_translation_memory',
    CORPUS: 'vibecoding_translation_corpus',
    API_CONFIG: 'vibecoding_translation_api_config'
};

const LANGUAGES = [
    { code: 'zh', name: '中文', baiduCode: 'zh' },
    { code: 'en', name: '英语', baiduCode: 'en' },
    { code: 'ja', name: '日语', baiduCode: 'jp' },
    { code: 'ko', name: '韩语', baiduCode: 'kor' }
];

const INDUSTRIES = [
    { value: 'it', label: 'IT技术' },
    { value: 'education', label: '教育培训' },
    { value: 'medical', label: '医疗健康' },
    { value: 'general', label: '通用领域' }
];

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    
    toastMessage.textContent = message;
    
    const icons = {
        success: 'fa-check-circle text-green-400',
        error: 'fa-times-circle text-red-400',
        warning: 'fa-exclamation-circle text-yellow-400',
        info: 'fa-info-circle text-blue-400'
    };
    
    toastIcon.className = `fa ${icons[type] || icons.success}`;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    
    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

function showModal(title, message, confirmCallback = null) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirm = document.getElementById('modal-confirm');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    
    modalConfirm.onclick = () => {
        if (confirmCallback) confirmCallback();
        closeModal();
    };
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
}

function closeModal() {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-95');
}

function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(resolve).catch(reject);
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                resolve();
            } catch (err) {
                reject(err);
            }
            document.body.removeChild(textarea);
        }
    });
}

function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function parseSRT(srtText) {
    const regex = /(\d+)\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\n([\s\S]*?)(?=\n\n|\n$)/g;
    const subtitles = [];
    let match;
    
    while ((match = regex.exec(srtText)) !== null) {
        subtitles.push({
            index: parseInt(match[1]),
            startTime: match[2],
            endTime: match[3],
            text: match[4].trim()
        });
    }
    
    return subtitles;
}

function formatSRT(subtitles) {
    return subtitles.map(sub => 
        `${sub.index}\n${sub.startTime} --> ${sub.endTime}\n${sub.text}\n`
    ).join('\n');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}