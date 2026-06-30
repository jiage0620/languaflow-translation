# LinguaFlow 智能翻译系统 - 部署说明

## 📋 项目概述

本项目是一个纯前端智能翻译系统，使用 HTML5 + Tailwind CSS v3 + 原生 JavaScript 技术栈，无需后端服务即可运行。

### 功能模块

1. **文本翻译** - 多语言互译，支持大段文本
2. **翻译记忆库** - 自动缓存翻译记录，优先读取本地
3. **专业语料库** - 管理专业术语，翻译时优先替换
4. **实时字幕** - 支持SRT字幕翻译和导出
5. **API配置** - 配置百度翻译API接口

### 技术特点

- ✅ 纯前端无后端，零服务器成本
- ✅ 数据存储在 LocalStorage，永久保存
- ✅ 响应式设计，支持手机/电脑端
- ✅ 使用 JSONP 跨域调用翻译API
- ✅ 一键部署到 Vercel

---

## 🚀 本地运行

### 方法一：直接打开

1. 下载项目文件
2. 用浏览器直接打开 `index.html`

### 方法二：本地服务器（推荐）

使用 Python、Node.js 或其他工具启动本地服务器：

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve

# PHP
php -S localhost:8080
```

然后访问 `http://localhost:8080`

---

## 📦 GitHub 上传仓库

### 步骤：

1. **创建 GitHub 账号**
   - 访问 https://github.com
   - 注册或登录账号

2. **创建新仓库**
   - 点击右上角 "New" 创建仓库
   - 仓库名称：`vibecoding-translation`（或自定义）
   - 选择 Public（公开）

3. **上传代码**

   在项目目录中打开终端：

   ```bash
   # 初始化 Git
   git init

   # 添加文件
   git add .

   # 提交代码
   git commit -m "Initial commit: VibeCoding Translation System"

   # 添加远程仓库
   git remote add origin https://github.com/your-username/vibecoding-translation.git

   # 推送到 GitHub
   git push -u origin main
   ```

---

## ☁️ Vercel 一键部署

### 步骤：

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add New" → "Project"
   - 选择 "Import Git Repository"
   - 选择刚才创建的 GitHub 仓库

3. **配置项目**
   - 项目名称：自动填充或自定义
   - Framework Preset：选择 `Other`（因为是纯静态项目）
   - Build Command：留空（纯静态无需构建）
   - Output Directory：留空

4. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成（约1-2分钟）

5. **获取公网链接**
   - 部署完成后，Vercel 会生成一个公网链接
   - 格式：`https://vibecoding-translation.vercel.app`
   - 可以直接访问使用

---

## 🚀 Render.com 部署

### 步骤：

1. **访问 Render**
   - 打开 https://render.com
   - 注册或登录账号

2. **创建静态网站**
   - 点击 "New" → "Static Site"
   - 连接 GitHub 仓库或手动上传文件

3. **配置项目**
   - Build Command：留空
   - Publish Directory：留空（使用根目录）

4. **部署**
   - 点击 "Create Static Site"
   - 等待部署完成

5. **访问链接**
   - 格式：`https://vibecoding-translation.onrender.com`

---

## 📦 GitHub Pages 部署

### 步骤：

1. **创建 GitHub 仓库**
   - 在 GitHub 创建仓库（名称：`your-username.github.io`）

2. **上传文件**
   - 将项目文件上传到仓库

3. **配置 Pages**
   - 进入仓库设置 → "Pages"
   - 选择分支：`main`
   - 选择目录：`/`（根目录）
   - 点击 "Save"

4. **访问链接**
   - 格式：`https://your-username.github.io`

---

## 📁 单文件部署（最简单）

### 步骤：

1. **复制文件**
   - 只需复制 `index.html` 文件到任何静态服务器

2. **上传到服务器**
   - 使用 FTP、SFTP 或控制面板上传

3. **直接访问**
   - 访问 `https://your-domain.com/index.html`

**优点：**
- 无需配置任何构建工具
- 单个文件即可运行所有功能
- 零服务器配置成本

---

## 🐳 Netlify 部署

### 步骤：

1. **访问 Netlify**
   - 打开 https://www.netlify.com
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add new site" → "Import an existing project"
   - 连接 GitHub 仓库

3. **配置项目**
   - Build command：留空
   - Publish directory：留空

4. **部署**
   - 点击 "Deploy site"
   - 等待部署完成

5. **访问链接**
   - 格式：`https://vibecoding-translation.netlify.app`

---

## 🌐 自定义域名配置（加分项）

### 阿里云域名配置

1. **购买域名**
   - 访问 https://wanwang.aliyun.com
   - 搜索并购买心仪的域名

2. **域名备案**
   - 根据中国法律法规，国内服务器需要备案
   - 如果使用 Vercel（海外服务器），可以跳过备案

3. **DNS 解析配置**
   - 在阿里云控制台找到域名管理
   - 添加 CNAME 记录：
     - 记录类型：`CNAME`
     - 主机记录：`@`（或 `www`）
     - 解析线路：`默认`
     - 记录值：`cname.vercel-dns.com`
     - TTL：`10分钟`

4. **Vercel 配置域名**
   - 在 Vercel 项目设置中找到 "Domains"
   - 添加自定义域名：`your-domain.com`
   - 等待 Vercel 自动配置 SSL 证书
   - 访问 `https://your-domain.com` 即可

### 腾讯云域名配置

1. **购买域名**
   - 访问 https://dnspod.cloud.tencent.com
   - 搜索并购买域名

2. **DNS 解析配置**
   - 在腾讯云控制台找到域名解析
   - 添加 CNAME 记录：
     - 主机记录：`@`（或 `www`）
     - 记录类型：`CNAME`
     - 记录值：`cname.vercel-dns.com`
     - TTL：`600秒`

3. **Vercel 配置（同上）**

---

## ⚙️ API 配置

### 百度翻译 API 获取

1. **访问百度翻译开放平台**
   - https://fanyi-api.baidu.com/

2. **注册账号并创建应用**
   - 登录后点击 "管理控制台"
   - 创建应用，选择 "通用翻译"
   - 获取 APP ID 和 密钥

3. **配置到系统**
   - 打开翻译系统的 "API配置" 页面
   - 填写 APP ID 和密钥
   - 点击 "测试连接" 验证

### API 错误码说明

| 错误码 | 说明 |
|--------|------|
| 52001 | 请求超时 |
| 52002 | 系统错误 |
| 52003 | 未授权用户 |
| 54000 | 必填参数为空 |
| 54001 | 签名错误 |
| 54003 | 访问频率受限 |
| 54004 | 账户余额不足 |
| 58000 | 客户端IP非法 |
| 58001 | 译文语言方向不支持 |

---

## 🐛 常见问题

### Q1: 部署后无法翻译？

**原因：** 未配置百度翻译 API

**解决：**
1. 获取百度翻译 API 的 APP ID 和密钥
2. 在 "API配置" 页面填写并保存
3. 测试连接确保配置正确

### Q2: 本地运行正常，部署后报错？

**原因：** 跨域问题或路径问题

**解决：**
1. 确保使用 Vercel 等支持静态文件的平台
2. 检查浏览器控制台错误信息
3. 确保所有 JS 文件路径正确

### Q3: 数据丢失？

**原因：** LocalStorage 数据存储在浏览器本地

**解决：**
1. 使用不同浏览器或设备需要重新配置
2. 定期导出记忆库和语料库备份
3. 清除浏览器缓存会丢失数据

### Q4: 字幕翻译格式错误？

**原因：** SRT 格式不正确

**解决：**
1. 确保使用标准 SRT 格式
2. 检查时间轴格式是否正确
3. 参考示例格式：
   ```
   1
   00:00:01,000 --> 00:00:04,000
   Hello World
   ```

---

## 📞 技术支持

### 项目结构

```
translation-system/
├── index.html              # 主页面
├── js/
│   ├── app.js              # 应用入口和路由
│   ├── utils.js            # 工具函数
│   ├── storage.js          # LocalStorage 封装
│   ├── api.js              # 翻译API调用
│   ├── api-config.js       # API配置页面
│   ├── corpus.js           # 专业语料库
│   ├── memory.js           # 翻译记忆库
│   ├── subtitle.js         # 实时字幕
│   └── translate.js        # 文本翻译
└── README.md               # 项目说明
```

### 联系方式

如有问题，请联系开发团队或查看项目文档。

---

**祝部署顺利！🎉**