# VibeCoding 智能翻译系统

一个功能完整的网页版智能翻译系统，使用 HTML5 + Tailwind CSS + 原生 JavaScript 开发。

## ✨ 功能特点

### 1. 文本翻译
- 左右双栏布局，支持大段文本输入
- 支持中文、英语、日语、韩语双向互译
- 翻译优先级：专业语料库 > 翻译记忆库 > API

### 2. 翻译记忆库（核心功能）
- 使用 LocalStorage 永久存储翻译记录
- 相同原文+语种组合优先读取本地缓存
- 支持搜索、删除、清空、导出JSON

### 3. 专业语料库（核心功能）
- 术语管理表格：原文术语、译文术语、行业分类
- 支持新增、编辑、删除、批量导入
- 翻译时优先全文匹配术语，强制替换

### 4. 实时字幕翻译（核心功能）
- 支持标准SRT字幕文本粘贴
- 自动识别时间轴，只翻译字幕内容
- 批量一键翻译，支持导出字幕文件

### 5. API配置
- 支持配置百度翻译API
- 默认使用MyMemory免费翻译API（无需密钥）
- 预留接口切换，方便替换其他翻译服务

## 🛠️ 技术栈

- **前端**: HTML5 + Tailwind CSS v3 + 原生 JavaScript
- **存储**: LocalStorage 本地持久化
- **翻译**: MyMemory API（默认）/ 百度翻译API（可选）
- **部署**: Vercel（推荐）

## 🚀 快速开始

### 本地运行

```bash
# 方法1：直接打开
# 使用浏览器打开 index.html

# 方法2：本地服务器
python -m http.server 8080
# 访问 http://localhost:8080
```

### 部署到 Vercel

1. 将代码推送到 GitHub 仓库
2. 访问 https://vercel.com
3. 导入 GitHub 仓库
4. 点击部署，生成公网链接

## 📁 项目结构

```
translation-system/
├── index.html              # 主页面
├── vercel.json             # Vercel SPA路由配置
├── DEPLOYMENT.md           # 详细部署说明
├── PPT_OUTLINE.md          # 答辩PPT大纲
└── js/
    ├── utils.js            # 工具函数
    ├── storage.js          # LocalStorage封装
    ├── api.js              # 翻译API
    ├── api-config.js       # API配置页面
    ├── corpus.js           # 专业语料库
    ├── memory.js           # 翻译记忆库
    ├── subtitle.js         # 实时字幕
    ├── translate.js        # 文本翻译
    └── app.js              # 应用入口
```

## 🎨 UI特点

- 简约科技风蓝白配色
- 响应式布局，支持手机/电脑
- 平滑过渡动画
- Toast提示和Modal弹窗

## 📝 配置说明

### 使用百度翻译API（可选）

1. 访问 https://fanyi-api.baidu.com
2. 注册账号并创建应用
3. 获取 APP ID 和密钥
4. 在系统"API配置"页面填写并保存

## 📄 许可证

MIT License