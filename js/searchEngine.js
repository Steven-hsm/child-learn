// 搜索引擎模块
// 实现客户端搜索功能，支持多关键词搜索和结果高亮

class SearchEngine {
  constructor() {
    this.data = [];
  }

  /**
   * 设置搜索数据源
   * @param {Array} contentArray - 内容数组
   */
  setData(contentArray) {
    this.data = contentArray || [];
  }

  /**
   * 执行搜索
   * 在标题和简介中查找关键词（不区分大小写）
   * 支持多关键词搜索（空格分隔）
   * 按相关度排序（标题匹配优先）
   * 
   * @param {string} keyword - 搜索关键词
   * @returns {Array} 匹配的内容项数组，按相关度排序
   */
  search(keyword) {
    // 处理空关键词
    if (!keyword || keyword.trim() === '') {
      return [];
    }

    // 分割多个关键词，过滤空字符串
    const keywords = keyword.toLowerCase().trim().split(/\s+/).filter(kw => kw !== '');
    
    if (keywords.length === 0) {
      return [];
    }

    const results = [];

    // 遍历所有内容项，计算匹配分数
    this.data.forEach(item => {
      const title = (item.title || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      
      let score = 0;
      
      // 每个关键词在标题中匹配得 2 分，在简介中匹配得 1 分
      keywords.forEach(kw => {
        if (title.includes(kw)) {
          score += 2;
        }
        if (description.includes(kw)) {
          score += 1;
        }
      });

      // 只保留有匹配的内容项
      if (score > 0) {
        results.push({ item, score });
      }
    });

    // 按相关度排序（分数高的在前）
    results.sort((a, b) => b.score - a.score);
    
    // 返回排序后的内容项数组
    return results.map(r => r.item);
  }

  /**
   * 转义正则表达式特殊字符
   * @param {string} str - 要转义的字符串
   * @returns {string} 转义后的字符串
   * @private
   */
  _escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, function(match) {
      return '\\' + match;
    });
  }

  /**
   * 高亮搜索关键词
   * 将文本中的关键词用 <mark> 标签包裹
   * 
   * @param {string} text - 原始文本
   * @param {string} keyword - 要高亮的关键词（可以是多个，空格分隔）
   * @returns {string} 带高亮标记的 HTML 字符串
   */
  highlight(text, keyword) {
    if (!keyword || !text) {
      return text;
    }
    
    // 分割多个关键词
    const keywords = keyword.split(/\s+/).filter(kw => kw.trim() !== '');
    let result = text;
    
    // 对每个关键词进行高亮处理
    keywords.forEach(kw => {
      // 转义特殊正则字符，防止正则表达式错误
      const escapedKw = this._escapeRegex(kw);
      // 创建不区分大小写的正则表达式
      const regex = new RegExp(`(${escapedKw})`, 'gi');
      // 用 <mark> 标签包裹匹配的文本
      result = result.replace(regex, '<mark>$1</mark>');
    });
    
    return result;
  }
}

// 创建全局实例供其他模块使用
const searchEngine = new SearchEngine();
