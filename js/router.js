// 前端路由管理器
// 支持路径参数匹配、History API 导航、浏览器前进后退

class Router {
  constructor() {
    this.routes = [];
    this.currentParams = {};
  }

  /**
   * 初始化路由
   * 设置浏览器前进后退监听，并处理当前路由
   */
  init() {
    // 监听浏览器前进后退按钮
    window.addEventListener('popstate', () => {
      this.handleRoute();
    });
    
    // 处理初始路由
    this.handleRoute();
  }

  /**
   * 注册路由规则
   * @param {string} pattern - 路由模式，支持参数如 '/category/:type' 或 '/detail/:id'
   * @param {Function} handler - 处理函数，接收匹配的参数对象
   * @example
   * router.register('/', () => { console.log('首页'); });
   * router.register('/category/:type', (params) => { console.log(params.type); });
   * router.register('/detail/:id', (params) => { console.log(params.id); });
   */
  register(pattern, handler) {
    // 将路由模式转换为正则表达式
    const paramNames = [];
    const regexPattern = pattern
      .replace(/\//g, '\\/')  // 转义斜杠
      .replace(/:(\w+)/g, (match, paramName) => {
        paramNames.push(paramName);
        return '([^\\/]+)';  // 匹配除斜杠外的任意字符
      });
    
    this.routes.push({
      pattern,
      regex: new RegExp(`^${regexPattern}$`),
      paramNames,
      handler
    });
  }

  /**
   * 导航到指定路径
   * 使用 History API 进行导航，不会刷新页面
   * @param {string} path - 目标路径
   * @param {boolean} replace - 是否替换当前历史记录，默认 false
   * @example
   * router.navigate('/category/books');
   * router.navigate('/search?q=测试', true);
   */
  navigate(path, replace = false) {
    // 使用 History API 更新 URL
    if (replace) {
      history.replaceState(null, '', path);
    } else {
      history.pushState(null, '', path);
    }
    
    // 处理新路由
    this.handleRoute();
  }

  /**
   * 处理当前路由
   * 匹配当前路径并执行对应的处理函数
   */
  handleRoute() {
    const path = window.location.pathname;
    
    // 遍历所有注册的路由，找到匹配的路由
    for (const route of this.routes) {
      const match = path.match(route.regex);
      
      if (match) {
        // 提取路径参数
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });
        
        // 保存当前参数
        this.currentParams = params;
        
        // 执行处理函数
        try {
          route.handler(params);
        } catch (error) {
          console.error('路由处理函数执行错误:', error);
        }
        
        return;
      }
    }
    
    // 如果没有匹配的路由，显示 404
    console.warn('未找到匹配的路由:', path);
    this.handle404();
  }

  /**
   * 处理 404 情况
   * 可以被覆盖以自定义 404 处理
   */
  handle404() {
    // 默认 404 处理：显示提示信息
    const container = document.querySelector('main') || document.body;
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 60px 20px;">
          <h1 style="font-size: 72px; margin: 0; color: #ccc;">404</h1>
          <p style="font-size: 18px; color: #666; margin: 20px 0;">页面未找到</p>
          <a href="/" style="color: #2196F3; text-decoration: none;">返回首页</a>
        </div>
      `;
    }
  }

  /**
   * 解析当前 URL 参数（查询字符串）
   * @returns {Object} 参数对象，包含查询字符串参数
   * @example
   * // URL: /search?q=测试&page=1
   * router.getParams() // { q: '测试', page: '1' }
   */
  getParams() {
    return parseQueryString(window.location.href);
  }

  /**
   * 获取当前路径参数
   * @returns {Object} 路径参数对象
   * @example
   * // URL: /category/books
   * router.getPathParams() // { type: 'books' }
   */
  getPathParams() {
    return { ...this.currentParams };
  }

  /**
   * 获取所有参数（路径参数 + 查询参数）
   * @returns {Object} 合并后的参数对象
   * @example
   * // URL: /category/books?page=2
   * router.getAllParams() // { type: 'books', page: '2' }
   */
  getAllParams() {
    return {
      ...this.currentParams,
      ...this.getParams()
    };
  }

  /**
   * 获取当前路径
   * @returns {string} 当前路径
   */
  getCurrentPath() {
    return window.location.pathname;
  }

  /**
   * 获取当前完整 URL
   * @returns {string} 当前完整 URL
   */
  getCurrentUrl() {
    return window.location.href;
  }

  /**
   * 清除所有路由
   */
  clearRoutes() {
    this.routes = [];
    this.currentParams = {};
  }
}

// 创建全局实例
const router = new Router();
