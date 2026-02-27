# 青少年阅读平台

专为青少年设计的多媒体内容平台，提供书籍、纪录片、电视剧、电影和少儿频道等多种内容类型。

## 项目介绍

青少年阅读平台是一个纯静态网站，旨在为青少年提供丰富、安全、适龄的阅读和观看体验，帮助他们培养良好的阅读习惯和媒体素养。平台采用原生 HTML、CSS 和 JavaScript 构建，部署在 Gitee Pages 上，无需后端服务器支持。

## 主要功能

### 📚 内容分类浏览
- **书籍**: 精选适合青少年的优质读物
- **纪录片**: 开阔视野的纪实影像
- **电视剧**: 寓教于乐的影视作品
- **电影**: 适龄的优质电影推荐
- **少儿频道**: 专为低龄儿童设计的内容

### 🔍 智能搜索
- 支持标题和简介的全文搜索
- 实时搜索结果展示
- 关键词高亮显示

### 🎯 年龄分级系统
- **6+**: 适合6岁及以上儿童
- **9+**: 适合9岁及以上儿童
- **12+**: 适合12岁及以上青少年
- **15+**: 适合15岁及以上青少年

### ⭐ 内容推荐
- 首页精选推荐内容
- 编辑精心挑选的优质内容
- 多样化的内容类型

### 📱 响应式设计
- 完美适配桌面、平板、手机等设备
- 流畅的用户体验
- 自适应布局

### ♿ 无障碍访问
- 支持键盘导航
- 屏幕阅读器友好
- 符合 WCAG AA 标准

## 技术栈

- **HTML5**: 语义化标签，提供良好的结构和可访问性
- **CSS3**: Flexbox 和 Grid 布局，CSS 变量管理主题
- **JavaScript (ES6+)**: 原生 JavaScript 实现所有交互功能
- **JSON**: 静态数据存储

## 项目结构

```
youth-reading-platform/
├── index.html                 # 首页
├── category.html              # 分类列表页
├── detail.html                # 内容详情页
├── search.html                # 搜索结果页
├── about.html                 # 关于/帮助页
├── css/                       # 样式文件
│   ├── base.css              # 基础样式和 CSS 变量
│   ├── layout.css            # 布局和响应式设计
│   ├── components.css        # 组件样式
│   └── themes.css            # 主题配色
├── js/                        # JavaScript 文件
│   ├── router.js             # 前端路由管理
│   ├── dataLoader.js         # 数据加载和缓存
│   ├── searchEngine.js       # 搜索引擎
│   ├── renderer.js           # 内容渲染
│   └── utils.js              # 工具函数
├── data/                      # 数据文件
│   ├── content.json          # 内容元数据
│   ├── recommendations.json  # 推荐内容配置
│   └── config.json           # 站点配置
└── images/                    # 图片资源
    ├── covers/               # 内容封面
    ├── icons/                # 图标
    └── placeholders/         # 占位图片
```

## 本地开发指南

### 环境要求

- 现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）
- 本地 Web 服务器（推荐使用 VS Code 的 Live Server 插件）

### 快速开始

1. **克隆项目**
   ```bash
   git clone https://gitee.com/your-username/youth-reading-platform.git
   cd youth-reading-platform
   ```

2. **启动本地服务器**

   **方法一：使用 VS Code Live Server**
   - 安装 Live Server 插件
   - 右键点击 `index.html`
   - 选择 "Open with Live Server"
   - 浏览器自动打开 `http://localhost:5500`

   **方法二：使用 Python**
   ```bash
   # Python 3
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

- 由于浏览器的同源策略，必须通过 HTTP 服务器访问，不能直接打开 HTML 文件
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

如果您的项目部署在子目录下，需要修改 `data/config.json` 中的 `baseUrl`：

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
   - 封面图片（建议尺寸：300x400px，格式：JPG/PNG）
   - 年龄分级、内容类型
   - 相关链接（阅读/观看地址）

2. **添加封面图片**
   - 将图片放入 `images/covers/` 目录
   - 使用有意义的文件名，如 `book-001.jpg`
   - 优化图片大小（建议小于 200KB）

3. **编辑 content.json**
   
   打开 `data/content.json`，在 `content` 数组中添加新条目：

   ```json
   {
     "id": "unique-id-001",
     "type": "book",
     "title": "《小王子》",
     "description": "一个关于爱与责任的童话故事",
     "detailedDescription": "《小王子》是法国作家安托万·德·圣埃克苏佩里创作的著名儿童文学短篇小说...",
     "cover": "/images/covers/little-prince.jpg",
     "ageRating": "9+",
     "metadata": {
       "author": "安托万·德·圣埃克苏佩里",
       "publisher": "人民文学出版社",
       "publishDate": "2023-01-01",
       "language": "中文"
     },
     "links": {
       "read": "https://example.com/read/little-prince"
     },
     "tags": ["童话", "哲理", "经典"],
     "featured": false,
     "createdAt": "2024-01-01T00:00:00Z",
     "updatedAt": "2024-01-01T00:00:00Z"
   }
   ```

4. **字段说明**
   - `id`: 唯一标识符，建议使用 `type-序号` 格式
   - `type`: 内容类型，可选值：`book`、`documentary`、`tv-series`、`movie`、`kids`
   - `ageRating`: 年龄分级，可选值：`6+`、`9+`、`12+`、`15+`
   - `featured`: 是否在首页推荐区显示

### 编辑现有内容

1. 在 `data/content.json` 中找到对应的内容项（通过 `id` 查找）
2. 修改需要更新的字段
3. 更新 `updatedAt` 字段为当前时间
4. 保存文件

### 删除内容

1. 在 `data/content.json` 中找到对应的内容项
2. 删除整个 JSON 对象（注意保持 JSON 格式正确）
3. 如果该内容在推荐列表中，同时从 `recommendations.json` 中删除
4. 保存文件

### 管理推荐内容

编辑 `data/recommendations.json`：

```json
{
  "version": "1.0",
  "recommendations": [
    {
      "contentId": "unique-id-001",
      "priority": 1,
      "reason": "经典必读作品"
    }
  ]
}
```

- `contentId`: 对应 `content.json` 中的内容 ID
- `priority`: 优先级，数字越小越靠前
- `reason`: 推荐理由（可选）

### 数据验证

添加或修改内容后，建议进行以下检查：

1. **JSON 格式验证**
   - 使用在线 JSON 验证工具检查格式
   - 确保没有语法错误（缺少逗号、括号等）

2. **必填字段检查**
   - `id`、`type`、`title`、`description`、`cover`、`ageRating` 必须填写

3. **ID 唯一性**
   - 确保每个内容项的 `id` 在整个文件中唯一

4. **图片路径**
   - 确保 `cover` 路径正确，图片文件存在

5. **本地测试**
   - 在本地服务器上测试新添加的内容是否正常显示

## 浏览器兼容性

### 支持的浏览器

| 浏览器 | 最低版本 | 备注 |
|--------|----------|------|
| Chrome | 90+ | 推荐使用 |
| Firefox | 88+ | 完全支持 |
| Safari | 14+ | iOS 和 macOS |
| Edge | 90+ | 基于 Chromium |
| 移动浏览器 | - | iOS Safari 14+, Android Chrome 90+ |

### 不支持的浏览器

- Internet Explorer（所有版本）
- 旧版本的移动浏览器

如果用户使用不支持的浏览器，页面会显示升级提示。

## 常见问题

### 1. 页面显示空白或内容无法加载

**原因**: 浏览器同源策略限制

**解决方案**: 必须通过 HTTP 服务器访问，不能直接双击打开 HTML 文件

### 2. 修改 JSON 文件后内容没有更新

**原因**: 浏览器缓存

**解决方案**: 
- 硬刷新页面（Ctrl+Shift+R 或 Cmd+Shift+R）
- 或在开发者工具中禁用缓存

### 3. 图片无法显示

**原因**: 图片路径错误或文件不存在

**解决方案**:
- 检查 `content.json` 中的图片路径
- 确保图片文件存在于 `images/covers/` 目录
- 检查文件名大小写是否匹配

### 4. 搜索功能不工作

**原因**: JavaScript 加载失败或数据未加载

**解决方案**:
- 打开浏览器控制台查看错误信息
- 确保所有 JavaScript 文件正确加载
- 检查 `content.json` 格式是否正确

### 5. Gitee Pages 部署后样式错误

**原因**: 资源路径配置问题

**解决方案**:
- 检查 `data/config.json` 中的 `baseUrl` 配置
- 确保所有资源使用相对路径或正确的绝对路径

## 性能优化建议

1. **图片优化**
   - 压缩图片文件大小（建议 < 200KB）
   - 使用适当的图片格式（JPG 用于照片，PNG 用于图标）
   - 考虑使用 WebP 格式（需要提供降级方案）

2. **缓存策略**
   - 浏览器会自动缓存静态资源
   - 更新内容后记得清除缓存

3. **懒加载**
   - 图片已启用懒加载（`loading="lazy"`）
   - 非首屏内容延迟加载

4. **代码优化**
   - JavaScript 文件已经过优化
   - CSS 使用了高效的选择器

## 贡献指南

欢迎贡献代码和内容！

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
- 发送邮件至：[your-email@example.com]

---

**最后更新**: 2024年1月

**版本**: 1.0.0
