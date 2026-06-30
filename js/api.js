class TranslationAPI {
    constructor() {
        this.config = storage.getApiConfig();
    }

    updateConfig() {
        this.config = storage.getApiConfig();
    }

    async translate(text, sourceLang, targetLang) {
        this.updateConfig();

        if (sourceLang === targetLang) {
            return { translatedText: text, from: 'same-lang' };
        }

        if (this.config.apiType === 'baidu' && this.config.appId && this.config.key) {
            return await this.translateWithBaidu(text, sourceLang, targetLang);
        }

        return await this.translateWithMyMemory(text, sourceLang, targetLang);
    }

    async translateWithMyMemory(text, sourceLang, targetLang) {
        const url = 'https://api.mymemory.translated.net/get';
        
        try {
            const response = await fetch(`${url}?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`);
            const data = await response.json();

            if (data.responseData && data.responseData.translatedText) {
                return {
                    translatedText: data.responseData.translatedText,
                    from: 'api',
                    confidence: data.responseData.match || 0.8
                };
            } else {
                throw new Error('翻译失败，返回数据异常');
            }
        } catch (error) {
            console.error('MyMemory API error:', error);
            throw new Error('翻译服务暂时不可用，请稍后重试');
        }
    }

    async translateWithBaidu(text, sourceLang, targetLang) {
        const baiduSource = this.getBaiduLangCode(sourceLang);
        const baiduTarget = this.getBaiduLangCode(targetLang);

        const salt = Date.now().toString();
        const sign = this.generateSign(text, salt);

        const url = `https://fanyi-api.baidu.com/api/trans/vip/translate`;

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            const callbackName = `translateCallback_${Date.now()}`;

            window[callbackName] = (response) => {
                document.body.removeChild(script);
                delete window[callbackName];

                if (response.error_code) {
                    const errorMsg = this.getErrorMessage(response.error_code);
                    reject(new Error(errorMsg));
                } else if (response.trans_result && response.trans_result.length > 0) {
                    const result = response.trans_result[0].dst;
                    resolve({ translatedText: result, from: 'api' });
                } else {
                    reject(new Error('翻译失败，返回数据异常'));
                }
            };

            const params = new URLSearchParams({
                q: text,
                from: baiduSource,
                to: baiduTarget,
                appid: this.config.appId,
                salt: salt,
                sign: sign
            });

            script.src = `${url}?${params.toString()}&callback=${callbackName}`;
            script.onerror = () => {
                document.body.removeChild(script);
                delete window[callbackName];
                reject(new Error('百度API请求失败，建议切换到默认翻译服务'));
            };

            document.body.appendChild(script);

            setTimeout(() => {
                if (window[callbackName]) {
                    document.body.removeChild(script);
                    delete window[callbackName];
                    reject(new Error('请求超时，请重试'));
                }
            }, 15000);
        });
    }

    getBaiduLangCode(lang) {
        const map = {
            'zh': 'zh',
            'en': 'en',
            'ja': 'jp',
            'ko': 'kor'
        };
        return map[lang] || lang;
    }

    generateSign(text, salt) {
        const { appId, key } = this.config;
        const str = `${appId}${text}${salt}${key}`;
        return this.md5(str);
    }

    md5(string) {
        const table = [
            0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
            0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
            0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
            0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
            0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
            0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
            0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
            0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
            0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
            0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
            0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
            0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
            0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
            0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
            0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
            0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
        ];

        const s = [
            7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
            5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
            4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
            6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
        ];

        const add = (x, y) => {
            const lsw = (x & 0xFFFF) + (y & 0xFFFF);
            const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };

        const rotateLeft = (x, n) => (x << n) | (x >>> (32 - n));

        const F = (x, y, z) => (x & y) | (~x & z);
        const G = (x, y, z) => (x & z) | (y & ~z);
        const H = (x, y, z) => x ^ y ^ z;
        const I = (x, y, z) => y ^ (x | ~z);

        const FF = (a, b, c, d, x, s, ac) => add(rotateLeft(add(add(a, F(b, c, d)), add(x, ac)), s), b);
        const GG = (a, b, c, d, x, s, ac) => add(rotateLeft(add(add(a, G(b, c, d)), add(x, ac)), s), b);
        const HH = (a, b, c, d, x, s, ac) => add(rotateLeft(add(add(a, H(b, c, d)), add(x, ac)), s), b);
        const II = (a, b, c, d, x, s, ac) => add(rotateLeft(add(add(a, I(b, c, d)), add(x, ac)), s), b);

        const toWordArray = (str) => {
            const words = [];
            let i = 0;
            for (; i < str.length * 8; i += 8) {
                words[i >> 5] |= (str.charCodeAt(i / 8) & 0xFF) << (i % 32);
            }
            words[i >> 5] |= 0x80 << (i % 32);
            words[(((i + 64) >>> 9) << 4) + 14] = str.length * 8;
            return words;
        };

        const wordToHex = (lValue) => {
            let wordToHexValue = '';
            const hexValue = '0123456789abcdef';
            for (let i = 0; i < 4; i++) {
                wordToHexValue += hexValue.charAt((lValue >> (i * 8 + 4)) & 0x0F);
                wordToHexValue += hexValue.charAt((lValue >> (i * 8)) & 0x0F);
            }
            return wordToHexValue;
        };

        let a = 0x67452301;
        let b = 0xEFCDAB89;
        let c = 0x98BADCFE;
        let d = 0x10325476;

        const x = toWordArray(string);

        for (let i = 0; i < x.length; i += 16) {
            const aa = a;
            const bb = b;
            const cc = c;
            const dd = d;

            a = FF(a, b, c, d, x[i], s[0], table[0]);
            d = FF(d, a, b, c, x[i + 1], s[1], table[1]);
            c = FF(c, d, a, b, x[i + 2], s[2], table[2]);
            b = FF(b, c, d, a, x[i + 3], s[3], table[3]);
            a = FF(a, b, c, d, x[i + 4], s[4], table[4]);
            d = FF(d, a, b, c, x[i + 5], s[5], table[5]);
            c = FF(c, d, a, b, x[i + 6], s[6], table[6]);
            b = FF(b, c, d, a, x[i + 7], s[7], table[7]);
            a = FF(a, b, c, d, x[i + 8], s[8], table[8]);
            d = FF(d, a, b, c, x[i + 9], s[9], table[9]);
            c = FF(c, d, a, b, x[i + 10], s[10], table[10]);
            b = FF(b, c, d, a, x[i + 11], s[11], table[11]);
            a = FF(a, b, c, d, x[i + 12], s[12], table[12]);
            d = FF(d, a, b, c, x[i + 13], s[13], table[13]);
            c = FF(c, d, a, b, x[i + 14], s[14], table[14]);
            b = FF(b, c, d, a, x[i + 15], s[15], table[15]);

            a = GG(a, b, c, d, x[i + 1], s[16], table[16]);
            d = GG(d, a, b, c, x[i + 6], s[17], table[17]);
            c = GG(c, d, a, b, x[i + 11], s[18], table[18]);
            b = GG(b, c, d, a, x[i], s[19], table[19]);
            a = GG(a, b, c, d, x[i + 5], s[20], table[20]);
            d = GG(d, a, b, c, x[i + 10], s[21], table[21]);
            c = GG(c, d, a, b, x[i + 15], s[22], table[22]);
            b = GG(b, c, d, a, x[i + 4], s[23], table[23]);
            a = GG(a, b, c, d, x[i + 9], s[24], table[24]);
            d = GG(d, a, b, c, x[i + 14], s[25], table[25]);
            c = GG(c, d, a, b, x[i + 3], s[26], table[26]);
            b = GG(b, c, d, a, x[i + 8], s[27], table[27]);
            a = GG(a, b, c, d, x[i + 13], s[28], table[28]);
            d = GG(d, a, b, c, x[i + 2], s[29], table[29]);
            c = GG(c, d, a, b, x[i + 7], s[30], table[30]);
            b = GG(b, c, d, a, x[i + 12], s[31], table[31]);

            a = HH(a, b, c, d, x[i + 5], s[32], table[32]);
            d = HH(d, a, b, c, x[i + 8], s[33], table[33]);
            c = HH(c, d, a, b, x[i + 11], s[34], table[34]);
            b = HH(b, c, d, a, x[i + 14], s[35], table[35]);
            a = HH(a, b, c, d, x[i + 1], s[36], table[36]);
            d = HH(d, a, b, c, x[i + 4], s[37], table[37]);
            c = HH(c, d, a, b, x[i + 7], s[38], table[38]);
            b = HH(b, c, d, a, x[i + 10], s[39], table[39]);
            a = HH(a, b, c, d, x[i + 13], s[40], table[40]);
            d = HH(d, a, b, c, x[i], s[41], table[41]);
            c = HH(c, d, a, b, x[i + 3], s[42], table[42]);
            b = HH(b, c, d, a, x[i + 6], s[43], table[43]);
            a = HH(a, b, c, d, x[i + 9], s[44], table[44]);
            d = HH(d, a, b, c, x[i + 12], s[45], table[45]);
            c = HH(c, d, a, b, x[i + 15], s[46], table[46]);
            b = HH(b, c, d, a, x[i + 2], s[47], table[47]);

            a = II(a, b, c, d, x[i], s[48], table[48]);
            d = II(d, a, b, c, x[i + 7], s[49], table[49]);
            c = II(c, d, a, b, x[i + 14], s[50], table[50]);
            b = II(b, c, d, a, x[i + 5], s[51], table[51]);
            a = II(a, b, c, d, x[i + 12], s[52], table[52]);
            d = II(d, a, b, c, x[i + 3], s[53], table[53]);
            c = II(c, d, a, b, x[i + 10], s[54], table[54]);
            b = II(b, c, d, a, x[i + 1], s[55], table[55]);
            a = II(a, b, c, d, x[i + 8], s[56], table[56]);
            d = II(d, a, b, c, x[i + 15], s[57], table[57]);
            c = II(c, d, a, b, x[i + 6], s[58], table[58]);
            b = II(b, c, d, a, x[i + 13], s[59], table[59]);
            a = II(a, b, c, d, x[i + 4], s[60], table[60]);
            d = II(d, a, b, c, x[i + 11], s[61], table[61]);
            c = II(c, d, a, b, x[i + 2], s[62], table[62]);
            b = II(b, c, d, a, x[i + 9], s[63], table[63]);

            a = add(a, aa);
            b = add(b, bb);
            c = add(c, cc);
            d = add(d, dd);
        }

        return wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    }

    getErrorMessage(errorCode) {
        const errors = {
            '52001': '请求超时，请重试',
            '52002': '系统错误，请重试',
            '52003': '未授权用户，请检查APP ID和密钥',
            '54000': '必填参数为空',
            '54001': '签名错误，请检查密钥',
            '54003': '访问频率受限',
            '54004': '账户余额不足',
            '54005': '长query请求频繁',
            '58000': '客户端IP非法',
            '58001': '译文语言方向不支持',
            '58002': '服务当前已关闭'
        };
        return errors[errorCode] || `API错误: ${errorCode}`;
    }
}

const api = new TranslationAPI();