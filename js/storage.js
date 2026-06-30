class StorageManager {
    constructor() {
        this.initDefaultData();
    }

    initDefaultData() {
        if (!this.getMemory()) {
            this.setMemory([]);
        }
        if (!this.getCorpus()) {
            this.setCorpus([
                { id: '1', source: 'API', target: '应用程序接口', industry: 'it' },
                { id: '2', source: 'SDK', target: '软件开发工具包', industry: 'it' },
                { id: '3', source: 'UI', target: '用户界面', industry: 'it' },
                { id: '4', source: 'AI', target: '人工智能', industry: 'it' },
                { id: '5', source: 'Database', target: '数据库', industry: 'it' },
                { id: '6', source: 'Algorithm', target: '算法', industry: 'it' },
                { id: '7', source: 'Machine Learning', target: '机器学习', industry: 'it' },
                { id: '8', source: 'Cloud Computing', target: '云计算', industry: 'it' },
                { id: '9', source: 'COVID-19', target: '新冠病毒', industry: 'medical' },
                { id: '10', source: 'Vaccine', target: '疫苗', industry: 'medical' },
                { id: '11', source: 'Doctor', target: '医生', industry: 'medical' },
                { id: '12', source: 'Patient', target: '患者', industry: 'medical' },
                { id: '13', source: 'Online Course', target: '在线课程', industry: 'education' },
                { id: '14', source: 'E-learning', target: '电子学习', industry: 'education' },
                { id: '15', source: 'Teacher', target: '教师', industry: 'education' }
            ]);
        }
        if (!this.getApiConfig()) {
            this.setApiConfig({
                appId: '',
                key: '',
                apiType: 'baidu'
            });
        }
    }

    getMemory() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.MEMORY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to get memory:', e);
            return [];
        }
    }

    setMemory(data) {
        try {
            localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to set memory:', e);
        }
    }

    addMemoryItem(item) {
        const memory = this.getMemory();
        const newItem = {
            ...item,
            id: generateId(),
            timestamp: Date.now()
        };
        memory.unshift(newItem);
        this.setMemory(memory);
        return newItem;
    }

    removeMemoryItem(id) {
        const memory = this.getMemory();
        const filtered = memory.filter(item => item.id !== id);
        this.setMemory(filtered);
    }

    clearMemory() {
        this.setMemory([]);
    }

    searchMemory(query, sourceLang, targetLang) {
        const memory = this.getMemory();
        return memory.filter(item => {
            const matchesQuery = !query || 
                item.source.toLowerCase().includes(query.toLowerCase()) ||
                item.target.toLowerCase().includes(query.toLowerCase());
            const matchesLang = (!sourceLang || item.sourceLang === sourceLang) &&
                               (!targetLang || item.targetLang === targetLang);
            return matchesQuery && matchesLang;
        });
    }

    getMemoryBySource(source, sourceLang, targetLang) {
        const memory = this.getMemory();
        return memory.find(item => 
            item.source === source && 
            item.sourceLang === sourceLang && 
            item.targetLang === targetLang
        );
    }

    getCorpus() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.CORPUS);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to get corpus:', e);
            return [];
        }
    }

    setCorpus(data) {
        try {
            localStorage.setItem(STORAGE_KEYS.CORPUS, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to set corpus:', e);
        }
    }

    addCorpusItem(item) {
        const corpus = this.getCorpus();
        const newItem = {
            ...item,
            id: generateId()
        };
        corpus.push(newItem);
        this.setCorpus(corpus);
        return newItem;
    }

    updateCorpusItem(id, updatedItem) {
        const corpus = this.getCorpus();
        const index = corpus.findIndex(item => item.id === id);
        if (index !== -1) {
            corpus[index] = { ...corpus[index], ...updatedItem };
            this.setCorpus(corpus);
            return corpus[index];
        }
        return null;
    }

    removeCorpusItem(id) {
        const corpus = this.getCorpus();
        const filtered = corpus.filter(item => item.id !== id);
        this.setCorpus(filtered);
    }

    clearCorpus() {
        this.setCorpus([]);
    }

    searchCorpus(query, industry) {
        const corpus = this.getCorpus();
        return corpus.filter(item => {
            const matchesQuery = !query || 
                item.source.toLowerCase().includes(query.toLowerCase()) ||
                item.target.toLowerCase().includes(query.toLowerCase());
            const matchesIndustry = !industry || item.industry === industry;
            return matchesQuery && matchesIndustry;
        });
    }

    getCorpusBySource(source) {
        const corpus = this.getCorpus();
        return corpus.find(item => item.source.toLowerCase() === source.toLowerCase());
    }

    replaceCorpusTerms(text) {
        const corpus = this.getCorpus();
        let result = text;
        
        corpus.forEach(item => {
            const regex = new RegExp(item.source, 'gi');
            result = result.replace(regex, item.target);
        });
        
        return result;
    }

    getApiConfig() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.API_CONFIG);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to get API config:', e);
            return null;
        }
    }

    setApiConfig(config) {
        try {
            localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(config));
        } catch (e) {
            console.error('Failed to set API config:', e);
        }
    }
}

const storage = new StorageManager();