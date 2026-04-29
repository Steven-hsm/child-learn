# 青少年阅读平台

专为青少年设计的多媒体内容平台，提供书籍、纪录片、电视剧、电影和少儿频道等多种内容类型，包含 11 部全文标注拼音的国学经典。

## 项目介绍

青少年阅读平台是一个纯静态网站，旨在为青少年提供丰富、安全、适龄���阅读和观看体验，帮助他们培养良好的阅读习惯和媒体素养。平台采用原生 HTML、CSS 和 JavaScript 构建，部署在 Gitee Pages 上，无需后端服务器支持。

核心特色：所有国学经典书籍均使用 HTML `<ruby>` 标签逐字标注拼音，帮助低龄读者独立阅读。

## 主要功能

### 内容分类���览
- **书籍**: 11 部精选国学经典（含全文拼音标注）
- **纪录片**: 5 部开阔视野的纪实影像
- **电视剧**: 5 部寓教于乐的影视作品
- **电影**: 5 部适龄的优质电影推荐
- **少儿频道**: 5 部专为低龄儿童设计的内容

### 智能搜索
- 支持标题和简介的全文搜索
- 多关键词搜索（空格分隔）
- 按相关度排序（标题匹配权重更高）
- 关键词高亮显示

### 年龄分级系统
- **6+**: 适合6岁及以上儿童（绿色）
- **9+**: 适合9岁及以上儿童（蓝色）
- **12+**: 适合12岁及以上青少年（橙色）
- **15+**: 适合15岁及以上青少年（红色）

### 国学经典阅读
- 11 部经典全文在线阅读
- 逐字拼音标注（HTML Ruby 注音）
- 分页浏览，适配移动端
- 米黄色纸张风格排版

### 内容推荐
- 首页精选 8 条推荐内容
- 编辑精心挑选的优质内容
- 附推荐理由说明

### 响应式设计
- 完美适配桌面、平板、手机等设备
- H5 移动端体验优化
- 自适应布局

### 无障碍访问
- 支持键盘导航
- 屏幕阅读器友好
- 符合 WCAG AA 标准

## 技术栈

- **HTML5**: 语义化标签，提供良好的结构和可访问性
- **CSS3**: Flexbox 和 Grid 布局，CSS 变量管理主题
- **JavaScript (ES6+)**: 原生 JavaScript 实现所有交互功能，无框架依赖
- **JSON**: 静态数据存储

## 项目结构

```
child-learn/
├── index.html                 # 首页
├── category.html              # 分类列表页
├── detail.html                # 内容详情页
├── search.html                # 搜索结果页
├── about.html                 # 关于/帮助页
├── css/                       # 样式文件
│   ├── base.css              # 基础样式和 CSS 变量
│   ├── layout.css            # 布局和响应式设计
│   ├── components.css        # 组件样式
│   ├── themes.css            # 主题配色
│   └── book.css              # 书籍阅读页样式
├── js/                        # JavaScript 模块
│   ├── router.js             # 前端路由（History API）
│   ├── dataLoader.js         # 数据加载和缓存（1小时过期）
│   ├── searchEngine.js       # 搜索引擎（多关键词、相关度排序）
│   ├── renderer.js           # 内容渲染（含 XSS 防护）
│   └── utils.js              # 工具函数（懒加载、防抖、本地存储）
├── data/                      # 数据文件
│   ├── content.json          # 31 条内容元数据
│   ├── recommendations.json  # 8 条推荐内容配置
│   └── config.json           # 站点配置
├── books/                     # 国学经典全文（11 部）
│   ├── three-character-classic.html    # 三字经
│   ├── hundred-family-surnames.html    # 百家姓
│   ├── thousand-character-classic.html # 千字文
│   ├── disciple-rules.html             # 弟子规
│   ├── augmented-virtuous-texts.html   # 增广贤文
│   ├── enlightenment-of-sound-rhyme.html # 声律启蒙
│   ├── liweng-duiyun.html              # 笠翁对韵
│   ├── mingxian-ji.html                # 名贤集
│   ├── shentong-shi.html               # 神童诗
│   ├── longwen-bianying.html           # 龙文鞭影
│   └── youxue-qionglin.html            # 幼学琼林
└── images/                    # 图片资源
    ├── covers/               # 内容封面（11 张，已压缩优化）
    ├── icons/                # 图标
    └── placeholders/         # 占位图片
```

## 架构设计

### 前端路由
- 基于 History API 的客户端路由，无页面刷新
- 支持路径参数匹配（如 `/category/:type`、`/detail/:id`）
- 浏览器前进后退支持（popstate 监听）

### 数据层
- `DataLoader`: 异步加载 JSON 数据，内置 1 小时缓存和重试机制
- `SearchEngine`: 客户端全文搜索，多关键词空格分隔，标题匹配双倍权重
- 数据全部存储在 `data/*.json`，无后端依赖

### 渲染层
- `Renderer`: 动态生成 HTML，所有用户输入经过 HTML 转义防 XSS
- 语义化标签 + ARIA 属性保障可访问性

### 书籍阅读
- 使用 HTML5 `<ruby>` / `<rt>` 标签逐字标注拼音
- CSS `book.css` 提供米黄色纸张风格、大字距排版
- 支持打印优化样式

## 本地开发指南

### 环境要求

- 现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）
- 本地 Web 服务器（推荐使用 VS Code 的 Live Server 插件）

> 由于浏览器的同源策略，必须通过 HTTP 服务器访问，不能直接双击打开 HTML 文件。

### 快速开始

1. **克隆项目**
   ```bash
   git clone https://gitee.com/your-username/youth-reading-platform.git
   cd youth-reading-platform
   ```

2. **启动本地服务器**

   **方法一：使用 VS Code Live Server（推荐）**
   - 安装 Live Server 插件
   - 右键点击 `index.html`
   - 选择 "Open with Live Server"
   - 浏览器自动打开 `http://localhost:5500`

   **方法二：使用 Python**
   ```bash
   python -m http.server 8000
   # 访问 http://localhost:8000
   ```

   **方法三：使用 Node.js**
   ```bash
   npx http-server -p 8000
   # 访问 http://localhost:8000
   ```

3. **开始开发**
   - 修改 HTML、CSS 或 JavaScript 文件
   - 浏览器会自动刷新（使用 Live Server 时）
   - 查看控制台输出调试信息

### 开发注意事项

- 修改 JSON 数据文件后，需要清除浏览器缓存或使用硬刷新（Ctrl+Shift+R）
- 建议使用浏览器开发者工具进行调试

## 部署到 Gitee Pages

### 前置条件

- 拥有 Gitee 账号
- 已创建 Gitee 仓库

### 部署步骤

1. **推送代码到 Gitee**
   ```bash
   git remote add origin https://gitee.com/your-username/youth-reading-platform.git
   git add .
   git commit -m "Initial commit"
   git push -u origin master
   ```

2. **启用 Gitee Pages**
   - 登录 Gitee，进入项目仓库
   - 点击 "服务" → "Gitee Pages"
   - 选择部署分支（通常是 master）
   - 选择部署目录（选择根目录 /）
   - 点击 "启动" 按钮

3. **等待部署完成**
   - 部署通常需要几分钟时间
   - 部署成功后会显示访问地址
   - 访问地址格式：`https://your-username.gitee.io/youth-reading-platform`

4. **更新部署**
   - 每次推送新代码后，需要在 Gitee Pages 页面点击 "更新" 按钮
   - 等待重新部署完成

### 部署配置

如果项目部署在子目录下，需要修改 `data/config.json` 中的 `baseUrl`：

```json
{
  "site": {
    "baseUrl": "https://your-username.gitee.io/youth-reading-platform"
  }
}
```

### 自定义域名（可选）

1. 在 Gitee Pages 设置页面添加自定义域名
2. 在域名服务商处添加 CNAME 记录，指向 `your-username.gitee.io`
3. 等待 DNS 解析生效（可能需要几小时）

## 内容管理指南

### 添加新内容

1. **准备内容信息**
   - 标题、简介、详细描述
   - 封面图片（建议尺寸：300x400px，格式：JPG/PNG，压缩后 < 200KB）
   - 年龄分级、内容类型
   - 相关链接（阅读/观看地址）

2. **添加封面图片**
   - 将图片放入 `images/covers/` 目录
   - 使用有意义的文件名，如 `三字经-封面图.jpeg`

3. **编辑 content.json**

   打开 `data/content.json`，在 `content` 数组中添加新条目：

   ```json
   {
     "id": "book-012",
     "type": "books",
     "title": "《新书籍》",
     "description": "一句话简介",
     "detailedDescription": "详细描述...",
     "cover": "./images/covers/new-book.jpeg",
     "ageRating": "6+",
     "metadata": {
       "author": "作者",
       "publisher": "出版社",
       "publishDate": "2024-01-01",
       "language": "中文"
     },
     "links": {
       "read": "./books/new-book.html"
     },
     "tags": ["标签1", "标签2"],
     "featured": false,
     "createdAt": "2024-01-01T00:00:00Z",
     "updatedAt": "2024-01-01T00:00:00Z"
   }
   ```

4. **字段说明**
   - `id`: 唯一标识符，使用 `type-序号` 格式
   - `type`: 内容类型，可选值：`books`、`documentaries`、`tv-series`、`movies`、`kids`
   - `ageRating`: 年龄分级，可选值：`6+`、`9+`、`12+`、`15+`
   - `featured`: 是否在首页推荐区显示

### 添加新书籍（含拼音标注）

1. 在 `books/` 目录下创建 HTML 文件
2. 使用 `<ruby>` 标签标注拼音：
   ```html
   <p><ruby>人<rt>rén</rt></ruby><ruby>之<rt>zhī</rt></ruby><ruby>初<rt>chū</rt></ruby></p>
   ```
3. 引入样式文件：
   ```html
   <link rel="stylesheet"="../css/base.css">
   <link rel="stylesheet"="../css/layout.css">
   <link rel="stylesheet"="../css/components.css">
   <link rel="stylesheet"="../css/book.css">
   ```
4. 在 `data/content.json` 中添加对应条目，`links.read` 指向该 HTML 文件

### 管理推荐内容

编辑 `data/recommendations.json`：

```json
{
  "contentId": "book-001",
  "priority": 1,
  "reason": "推荐理由"
}
```

- `contentId`: 对应 `content.json` 中的内容 ID
- `priority`: 优先级，数字越小越靠前

### 数据验证清单

- [ ] JSON 格式正确（使用 JSON 验证工具检查）
- [ ] 必填字段完整：`id`、`type`、`title`、`description`、`cover`、`ageRating`
- [ ] `id` 在文件中唯一
- [ ] `cover` 路径正确，图片文件存在
- [ ] 书籍 HTML 中拼音标注完整
- [ ] 本地服务器测试显示正常

## 浏览器兼容性

| 浏览器 | 最低版本 | 备注 |
|--------|----------|------|
| Chrome | 90+ | 推荐使用 |
| Firefox | 88+ | 完全支持 |
| Safari | 14+ | iOS 和 macOS |
| Edge | 90+ | 基于 Chromium |
| 移动浏览器 | - | iOS Safari 14+, Android Chrome 90+ |

不支持 Internet Explorer（所有版本）。

## 常见问题

### 页面显示空白或内容无法加载

**原因**: 浏览器同源策略限制。

**解决**: 必须通过 HTTP 服务器访问，不能直接双击打开 HTML 文件。

### 修改 JSON 文件后内容没有更新

**原因**: 浏览器缓存。

**解决**: 硬刷新页面（Ctrl+Shift+R），或在开发者工具中禁用缓存。

### 图片无法显示

**原因**: 图片路径错误或文件不存在。

**解决**: 检查 `content.json` 中的图片路径和文件名大小写。

### 搜索功能不工作

**原因**: JavaScript 加载失败或数据未加载。

**解决**: 打开浏览器控制台查看错误信息，确保所有 JS 文件正确加载。

### Gitee Pages 部署后样式错误

**原因**: 资源路径配置问题。

**解决**: 检查 `data/config.json` 中的 `baseUrl` 配置，确保所有资源使用相对路径。

## 性能优化

- 封面图已压缩优化（总大小从 16.9MB 降至 292KB）
- 图片懒加载（Intersection Observer）
- 数据缓存（1 小时过期，带重试机制）
- CSS 使用变量和高效选择器

## 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

本项目仅供学习和个人使用。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件至：1586558083@qq.com
