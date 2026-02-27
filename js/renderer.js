// 内容渲染器
// 负责将数据渲染为 HTML，确保安全性和无障碍访问

class Renderer {
  /**
   * HTML 转义，防止 XSS 攻击
   * @param {string} str - 要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  /**
   * 渲染内容卡片列表
   * @param {HTMLElement} container - 目标容器元素
   * @param {Array} items - 内容项数组
   */
  renderContentList(container, items) {
    if (!container) {
      console.error('Renderer: 容器元素不存在');
      return;
    }

    if (!items || items.length === 0) {
      container.innerHTML = '<p class="no-content" role="status">暂无内容</p>';
      return;
    }

    container.innerHTML = items.map(item => this.renderContentCard(item)).join('');
  }

  /**
   * 渲染单个内容卡片
   * @param {Object} item - 内容项对象
   * @returns {string} HTML 字符串
   */
  renderContentCard(item) {
    if (!item || !item.id) {
      console.error('Renderer: 无效的内容项', item);
      return '';
    }

    const ageRatingClass = (item.ageRating || '').replace('+', '');
    const title = this.escapeHtml(item.title || '未命名');
    const description = this.escapeHtml(item.description || '');
    const cover = this.escapeHtml(item.cover || 'https://via.placeholder.com/300x450/CCCCCC/666666?text=暂无封面');
    const typeName = this.getTypeName(item.type);
    
    return `
      <article class="content-card" data-id="${this.escapeHtml(item.id)}">
        <a href="./detail.html?id=${encodeURIComponent(item.id)}" class="card-link" aria-label="查看 ${title} 的详情">
          <div class="card-image">
            <img src="${cover}" alt="${title} 封面" loading="lazy" onerror="this.src='https://via.placeholder.com/300x450/CCCCCC/666666?text=暂无封面'">
            ${item.ageRating ? `<span class="age-rating age-${ageRatingClass}" aria-label="适合年龄 ${this.escapeHtml(item.ageRating)}">${this.escapeHtml(item.ageRating)}</span>` : ''}
          </div>
          <div class="card-body">
            <h3 class="card-title">${title}</h3>
            <p class="card-description">${description}</p>
            <span class="card-type">${typeName}</span>
          </div>
        </a>
      </article>
    `;
  }

  /**
   * 渲染内容详情
   * @param {HTMLElement} container - 目标容器元素
   * @param {Object} item - 内容项对象
   */
  renderContentDetail(container, item) {
    if (!container) {
      console.error('Renderer: 容器元素不存在');
      return;
    }

    if (!item || !item.id) {
      this.renderError(container, '内容项数据无效');
      return;
    }

    const ageRatingClass = (item.ageRating || '').replace('+', '');
    const title = this.escapeHtml(item.title || '未命名');
    const cover = this.escapeHtml(item.cover || 'https://via.placeholder.com/300x450/CCCCCC/666666?text=暂无封面');
    const description = this.escapeHtml(item.detailedDescription || item.description || '暂无描述');
    const typeName = this.getTypeName(item.type);
    const metadata = this.renderMetadata(item);
    
    container.innerHTML = `
      <div class="detail-header">
        <img src="${cover}" alt="${title} 封面" class="detail-cover" onerror="this.src='https://via.placeholder.com/300x450/CCCCCC/666666?text=暂无封面'">
        <div class="detail-info">
          <h1>${title}</h1>
          ${item.ageRating ? `<span class="age-rating age-${ageRatingClass}" aria-label="适合年龄 ${this.escapeHtml(item.ageRating)}">${this.escapeHtml(item.ageRating)}</span>` : ''}
          <p class="detail-type">${typeName}</p>
        </div>
      </div>
      <div class="detail-body">
        <section class="detail-description">
          <h2>简介</h2>
          <p>${description}</p>
        </section>
        ${metadata}
        ${this.renderLinks(item.links)}
      </div>
    `;
  }

  /**
   * 渲染元数据
   * @param {Object} item - 内容项对象
   * @returns {string} HTML 字符串
   */
  renderMetadata(item) {
    if (!item.metadata) return '';
    
    const meta = item.metadata;
    let html = '<section class="detail-metadata"><h2>详细信息</h2><dl>';
    
    if (meta.author) html += `<dt>作者</dt><dd>${this.escapeHtml(meta.author)}</dd>`;
    if (meta.publisher) html += `<dt>出版社</dt><dd>${this.escapeHtml(meta.publisher)}</dd>`;
    if (meta.director) html += `<dt>导演</dt><dd>${this.escapeHtml(meta.director)}</dd>`;
    if (meta.cast && Array.isArray(meta.cast)) {
      html += `<dt>主演</dt><dd>${meta.cast.map(c => this.escapeHtml(c)).join(', ')}</dd>`;
    }
    if (meta.duration) html += `<dt>时长</dt><dd>${this.escapeHtml(meta.duration)}</dd>`;
    if (meta.episodes) html += `<dt>集数</dt><dd>${this.escapeHtml(String(meta.episodes))}集</dd>`;
    if (meta.language) html += `<dt>语言</dt><dd>${this.escapeHtml(meta.language)}</dd>`;
    
    html += '</dl></section>';
    return html;
  }

  /**
   * 渲染链接
   * @param {Object} links - 链接对象
   * @returns {string} HTML 字符串
   */
  renderLinks(links) {
    if (!links) return '';
    
    let html = '<section class="detail-links"><h2>访问链接</h2>';
    if (links.read) {
      html += `<a href="${this.escapeHtml(links.read)}" class="btn" target="_blank" rel="noopener noreferrer" aria-label="在新窗口打开阅读链接">开始阅读</a>`;
    }
    if (links.watch) {
      html += `<a href="${this.escapeHtml(links.watch)}" class="btn" target="_blank" rel="noopener noreferrer" aria-label="在新窗口打开观看链接">开始观看</a>`;
    }
    html += '</section>';
    return html;
  }

  /**
   * 渲染年龄分级标识
   * @param {string} rating - 年龄分级值
   * @returns {string} HTML 字符串
   */
  renderAgeRating(rating) {
    if (!rating) return '';
    const ratingClass = rating.replace('+', '');
    return `<span class="age-rating age-${ratingClass}" aria-label="适合年龄 ${this.escapeHtml(rating)}">${this.escapeHtml(rating)}</span>`;
  }

  /**
   * 渲染加载状态
   * @param {HTMLElement} container - 目标容器元素
   */
  renderLoading(container) {
    if (!container) {
      console.error('Renderer: 容器元素不存在');
      return;
    }
    container.innerHTML = '<div class="loading" role="status" aria-live="polite">加载中...</div>';
  }

  /**
   * 渲染错误信息
   * @param {HTMLElement} container - 目标容器元素
   * @param {string} message - 错误消息
   */
  renderError(container, message) {
    if (!container) {
      console.error('Renderer: 容器元素不存在');
      return;
    }
    const safeMessage = this.escapeHtml(message || '发生错误');
    container.innerHTML = `<div class="error" role="alert" aria-live="assertive">${safeMessage}</div>`;
  }

  /**
   * 获取类型名称
   * @param {string} type - 类型 ID
   * @returns {string} 类型名称
   */
  getTypeName(type) {
    const typeMap = {
      'books': '书籍',
      'documentaries': '纪录片',
      'tv-series': '电视剧',
      'movies': '电影',
      'kids': '少儿频道'
    };
    return typeMap[type] || type;
  }
}

// 创建全局实例
const renderer = new Renderer();
