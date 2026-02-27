/**
 * 数据加载器
 * 负责加载和缓存 JSON 数据，提供错误处理和重试逻辑
 */
class DataLoader {
  constructor() {
    // 缓存对象，存储加载的数据和时间戳
    this.cache = {
      content: { data: null, timestamp: null },
      config: { data: null, timestamp: null },
      recommendations: { data: null, timestamp: null }
    };
    
    // 默认缓存过期时间（1小时）
    this.cacheDuration = 3600000;
    
    // 重试配置
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1秒
  }

  /**
   * 检查缓存是否有效
   * @param {string} key - 缓存键名
   * @returns {boolean} 缓存是否有效
   */
  isCacheValid(key) {
    const cached = this.cache[key];
    if (!cached.data || !cached.timestamp) {
      return false;
    }
    
    const now = Date.now();
    return (now - cached.timestamp) < this.cacheDuration;
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键名
   * @param {*} data - 要缓存的数据
   */
  setCache(key, data) {
    this.cache[key] = {
      data: data,
      timestamp: Date.now()
    };
  }

  /**
   * 获取缓存数据
   * @param {string} key - 缓存键名
   * @returns {*} 缓存的数据
   */
  getCache(key) {
    return this.cache[key].data;
  }

  /**
   * 带重试的 fetch 请求
   * @param {string} url - 请求 URL
   * @param {number} retries - 剩余重试次数
   * @returns {Promise<Response>} fetch 响应
   */
  async fetchWithRetry(url, retries = this.maxRetries) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (retries > 0) {
        console.warn(`请求失败，${this.retryDelay}ms 后重试... (剩余重试次数: ${retries})`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.fetchWithRetry(url, retries - 1);
      }
      
      throw error;
    }
  }

  /**
   * 加载所有内容数据
   * @returns {Promise<Array>} 内容数组
   */
  async loadContent() {
    // 检查缓存
    if (this.isCacheValid('content')) {
      return this.getCache('content');
    }
    
    try {
      const response = await this.fetchWithRetry('./data/content.json');
      const data = await response.json();
      
      // 验证数据结构
      if (!data.content || !Array.isArray(data.content)) {
        throw new Error('内容数据格式无效');
      }
      
      // 缓存数据
      this.setCache('content', data.content);
      
      return data.content;
    } catch (error) {
      console.error('加载内容失败:', error);
      
      // 如果有旧缓存，返回旧缓存（即使过期）
      if (this.cache.content.data) {
        console.warn('使用过期缓存数据');
        return this.cache.content.data;
      }
      
      throw new Error(`无法加载内容数据: ${error.message}`);
    }
  }

  /**
   * 根据 ID 获取单个内容项
   * @param {string} id - 内容 ID
   * @returns {Promise<Object|null>} 内容项或 null
   */
  async getContentById(id) {
    if (!id) {
      throw new Error('内容 ID 不能为空');
    }
    
    try {
      const content = await this.loadContent();
      return content.find(item => item.id === id) || null;
    } catch (error) {
      console.error(`获取内容 ${id} 失败:`, error);
      throw error;
    }
  }

  /**
   * 根据类型获取内容列表
   * @param {string} type - 内容类型
   * @returns {Promise<Array>} 内容数组
   */
  async getContentByType(type) {
    if (!type) {
      throw new Error('内容类型不能为空');
    }
    
    try {
      const content = await this.loadContent();
      return content.filter(item => item.type === type);
    } catch (error) {
      console.error(`获取类型 ${type} 的内容失败:`, error);
      throw error;
    }
  }

  /**
   * 加载推荐内容
   * @returns {Promise<Array>} 推荐配置数组
   */
  async loadRecommendations() {
    // 检查缓存
    if (this.isCacheValid('recommendations')) {
      return this.getCache('recommendations');
    }
    
    try {
      const response = await this.fetchWithRetry('./data/recommendations.json');
      const data = await response.json();
      
      // 验证数据结构
      if (!data.recommendations || !Array.isArray(data.recommendations)) {
        throw new Error('推荐数据格式无效');
      }
      
      // 缓存数据
      this.setCache('recommendations', data.recommendations);
      
      return data.recommendations;
    } catch (error) {
      console.error('加载推荐失败:', error);
      
      // 如果有旧缓存，返回旧缓存（即使过期）
      if (this.cache.recommendations.data) {
        console.warn('使用过期缓存数据');
        return this.cache.recommendations.data;
      }
      
      throw new Error(`无法加载推荐数据: ${error.message}`);
    }
  }

  /**
   * 获取推荐的内容项（包含完整内容数据）
   * @returns {Promise<Array>} 推荐内容数组
   */
  async getRecommendedContent() {
    try {
      const recommendations = await this.loadRecommendations();
      const content = await this.loadContent();
      
      // 根据推荐配置获取完整内容项，并按优先级排序
      const recommendedContent = recommendations
        .map(rec => {
          const item = content.find(c => c.id === rec.contentId);
          if (item) {
            return {
              ...item,
              recommendationReason: rec.reason,
              recommendationPriority: rec.priority
            };
          }
          return null;
        })
        .filter(item => item !== null)
        .sort((a, b) => a.recommendationPriority - b.recommendationPriority);
      
      return recommendedContent;
    } catch (error) {
      console.error('获取推荐内容失败:', error);
      throw error;
    }
  }

  /**
   * 加载站点配置
   * @returns {Promise<Object>} 配置对象
   */
  async loadConfig() {
    // 检查缓存
    if (this.isCacheValid('config')) {
      return this.getCache('config');
    }
    
    try {
      const response = await this.fetchWithRetry('./data/config.json');
      const data = await response.json();
      
      // 验证数据结构
      if (!data.site || !data.contentTypes || !data.ageRatings) {
        throw new Error('配置数据格式无效');
      }
      
      // 更新缓存过期时间（如果配置中有指定）
      if (data.performance && data.performance.cacheDuration) {
        this.cacheDuration = data.performance.cacheDuration;
      }
      
      // 缓存数据
      this.setCache('config', data);
      
      return data;
    } catch (error) {
      console.error('加载配置失败:', error);
      
      // 如果有旧缓存，返回旧缓存（即使过期）
      if (this.cache.config.data) {
        console.warn('使用过期缓存数据');
        return this.cache.config.data;
      }
      
      throw new Error(`无法加载配置数据: ${error.message}`);
    }
  }

  /**
   * 清除所有缓存
   */
  clearCache() {
    this.cache = {
      content: { data: null, timestamp: null },
      config: { data: null, timestamp: null },
      recommendations: { data: null, timestamp: null }
    };
  }

  /**
   * 清除指定缓存
   * @param {string} key - 缓存键名 (content, config, recommendations)
   */
  clearCacheByKey(key) {
    if (this.cache[key]) {
      this.cache[key] = { data: null, timestamp: null };
    }
  }

  /**
   * 预加载所有数据
   * @returns {Promise<Object>} 包含所有数据的对象
   */
  async preloadAll() {
    try {
      const [content, config, recommendations] = await Promise.all([
        this.loadContent(),
        this.loadConfig(),
        this.loadRecommendations()
      ]);
      
      return { content, config, recommendations };
    } catch (error) {
      console.error('预加载数据失败:', error);
      throw error;
    }
  }
}

// 创建全局实例
const dataLoader = new DataLoader();
