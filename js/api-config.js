function renderApiPage() {
    const container = document.getElementById('page-content');
    const config = storage.getApiConfig();
    
    container.innerHTML = `
        <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <i class="fa fa-cog text-primary"></i>
                        API配置
                    </h2>
                    <p class="text-gray-500 mt-1">配置翻译API接口，支持百度翻译等服务</p>
                </div>
                <button onclick="testApi()" class="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all-300 flex items-center gap-2">
                    <i class="fa fa-check-circle"></i>
                    测试连接
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="space-y-6">
                    <div class="bg-blue-50 rounded-xl p-4">
                        <h3 class="text-sm font-semibold text-blue-800 mb-2">百度翻译API配置</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">APP ID</label>
                                <input type="text" id="api-appid" value="${escapeHtml(config.appId || '')}" placeholder="请输入百度翻译APP ID" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">密钥 (Key)</label>
                                <input type="password" id="api-key" value="${escapeHtml(config.key || '')}" placeholder="请输入百度翻译密钥" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all-300">
                                <button onclick="toggleApiKey()" class="mt-1 text-xs text-blue-500 hover:text-blue-600">显示/隐藏密钥</button>
                            </div>
                        </div>
                    </div>

                    <button onclick="saveApiConfig()" class="w-full px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primaryDark transition-all-300 flex items-center justify-center gap-2">
                        <i class="fa fa-save"></i>
                        保存配置
                    </button>
                </div>

                <div class="space-y-6">
                    <div class="bg-gray-50 rounded-xl p-4">
                        <h3 class="text-sm font-semibold text-gray-800 mb-2">获取百度翻译API</h3>
                        <ol class="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                            <li>访问 <a href="https://fanyi-api.baidu.com/" target="_blank" class="text-primary hover:underline">百度翻译开放平台</a></li>
                            <li>注册并登录账号</li>
                            <li>创建应用，获取APP ID和密钥</li>
                            <li>将APP ID和密钥填写到左侧表单</li>
                            <li>点击"测试连接"验证配置是否正确</li>
                        </ol>
                    </div>

                    <div class="bg-yellow-50 rounded-xl p-4">
                        <h3 class="text-sm font-semibold text-yellow-800 mb-2">API调用说明</h3>
                        <ul class="text-sm text-yellow-700 space-y-1">
                            <li>• 免费版用户每天有一定的调用限额</li>
                            <li>• 超出限额后需要购买付费套餐</li>
                            <li>• 建议妥善保管您的API密钥</li>
                            <li>• 密钥会保存在本地浏览器中</li>
                        </ul>
                    </div>

                    <div class="bg-gray-50 rounded-xl p-4">
                        <h3 class="text-sm font-semibold text-gray-800 mb-2">接口切换说明</h3>
                        <p class="text-sm text-gray-600">
                            当前使用百度翻译API。如需切换其他翻译服务（如DeepL、有道翻译），请修改 <code class="bg-white px-1 rounded">js/api.js</code> 文件中的翻译接口调用逻辑。
                        </p>
                    </div>
                </div>
            </div>

            <div class="mt-6 bg-red-50 rounded-xl p-4">
                <h3 class="text-sm font-semibold text-red-800 mb-2">错误提示说明</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div><span class="text-red-600">52003</span>: 未授权用户，请检查APP ID和密钥</div>
                    <div><span class="text-red-600">54001</span>: 签名错误，请检查密钥</div>
                    <div><span class="text-red-600">54003</span>: 访问频率受限，请稍后再试</div>
                    <div><span class="text-red-600">54004</span>: 账户余额不足，请充值</div>
                    <div><span class="text-red-600">58000</span>: 客户端IP非法</div>
                    <div><span class="text-red-600">58001</span>: 译文语言方向不支持</div>
                </div>
            </div>
        </div>
    `;
}

function toggleApiKey() {
    const input = document.getElementById('api-key');
    input.type = input.type === 'password' ? 'text' : 'password';
}

function saveApiConfig() {
    const appId = document.getElementById('api-appid').value.trim();
    const key = document.getElementById('api-key').value.trim();

    if (!appId || !key) {
        showToast('请填写完整的APP ID和密钥', 'warning');
        return;
    }

    storage.setApiConfig({
        appId,
        key,
        apiType: 'baidu'
    });
    
    api.updateConfig();
    showToast('API配置保存成功', 'success');
}

async function testApi() {
    const appId = document.getElementById('api-appid').value.trim();
    const key = document.getElementById('api-key').value.trim();

    if (!appId || !key) {
        showToast('请先填写APP ID和密钥', 'warning');
        return;
    }

    showToast('正在测试连接...', 'info');

    try {
        const result = await api.translate('Hello', 'en', 'zh');
        if (result.translatedText) {
            showToast(`测试成功！"Hello" 翻译为 "${result.translatedText}"`, 'success');
        }
    } catch (error) {
        showToast(`测试失败：${error.message}`, 'error');
    }
}