// 工具函数模块
// 提供通用工具函数，支持 URL 解析、日期格式化、防抖、懒加载等功能

/**
 * 解析 URL 查询参数
 * @param {string} url - URL 字符串（可以是完整 URL 或仅查询字符串）
 * @returns {Object} 参数对象，键值对形式
 * @example
 * parseQueryString('?q=搜索&page=1') // { q: '搜索', page: '1' }
 * parseQueryString('https://example.com?q=test') // { q: 'test' }
 */
function parseQueryString(url) {
  const params = {};
  
  // 如果没有传入 URL，使用当前页面的 URL
  if (!url) {
    url = window.location.href;
  }
  
  // 提取查询字符串部分
  const queryString = url.includes('?') ? url.split('?')[1] : url;
  
  // 移除可能存在的 hash 部分
  const cleanQueryString = queryString.split('#')[0];
  
  if (cleanQueryString) {
    cleanQueryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) {
        try {
          params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        } catch (e) {
          // 如果解码失败，使用原始值
          params[key] = value || '';
        }
      }
    });
  }
  
  return params;
}

/**
 * 格式化日期
 * @param {string|Date} dateString - ISO 日期字符串或 Date 对象
 * @param {string} format - 格式类型：'short'（默认）、'long'、'relative'
 * @returns {string} 格式化后的日期
 * @example
 * formatDate('2024-01-01') // '2024/1/1'
 * formatDate('2024-01-01', 'long') // '2024年1月1日'
 * formatDate('2024-01-01', 'relative') // '3天前'
 */
function formatDate(dateString, format = 'short') {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  switch (format) {
    case 'long':
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    
    case 'relative':
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return '今天';
      if (diffDays === 1) return '昨天';
      if (diffDays < 7) return `${diffDays}天前`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
      return `${Math.floor(diffDays / 365)}年前`;
    
    case 'short':
    default:
      return date.toLocaleDateString('zh-CN');
  }
}

/**
 * 防抖函数
 * 在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒），默认 300ms
 * @returns {Function} 防抖后的函数
 * @example
 * const debouncedSearch = debounce(search, 500);
 * input.addEventListener('input', debouncedSearch);
 */
function debounce(func, delay = 300) {
  let timeoutId;
  
  return function debounced(...args) {
    const context = this;
    
    // 清除之前的定时器
    clearTimeout(timeoutId);
    
    // 设置新的定时器
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * 图片懒加载
 * 使用 Intersection Observer API 实现图片懒加载，提升页面性能
 * @param {HTMLElement} container - 容器元素，默认为 document
 * @param {Object} options - 配置选项
 * @param {string} options.rootMargin - 提前加载的边距，默认 '50px'
 * @param {number} options.threshold - 触发阈值，默认 0.01
 * @example
 * lazyLoadImages(document.querySelector('.content-grid'));
 */
function lazyLoadImages(container = document, options = {}) {
  const {
    rootMargin = '50px',
    threshold = 0.01
  } = options;
  
  // 查找所有需要懒加载的图片
  const images = container.querySelectorAll('img[loading="lazy"]');
  
  if (images.length === 0) return;
  
  // 检查浏览器是否支持 Intersection Observer
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // 如果有 data-src 属性，使用它作为真实图片地址
          if (img.dataset.src) {
            img.src = img.dataset.src;
            delete img.dataset.src;
          }
          
          // 加载完成后添加类名，可用于淡入动画
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
          
          // 停止观察已加载的图片
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin,
      threshold
    });
    
    // 开始观察所有图片
    images.forEach(img => imageObserver.observe(img));
  } else {
    // 不支持 Intersection Observer 的浏览器，直接加载所有图片
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        delete img.dataset.src;
      }
    });
  }
}

/**
 * 检测设备类型
 * 根据视口宽度判断当前设备类型
 * @returns {string} 设备类型：'mobile'（< 768px）、'tablet'（768-1023px）、'desktop'（>= 1024px）
 * @example
 * const deviceType = getDeviceType();
 * if (deviceType === 'mobile') { // 移动端特殊处理 }
 */
function getDeviceType() {
  const width = window.innerWidth;
  
  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * 设置本地存储
 * 将数据存储到 localStorage，自动进行 JSON 序列化
 * @param {string} key - 存储键名
 * @param {*} value - 要存储的值（会自动 JSON 序列化）
 * @param {number} expiry - 可选的过期时间（毫秒），默认不过期
 * @returns {boolean} 是否存储成功
 * @example
 * setStorage('user', { name: '张三' });
 * setStorage('token', 'abc123', 3600000); // 1小时后过期
 */
function setStorage(key, value, expiry = null) {
  try {
    const item = {
      value: value,
      timestamp: Date.now(),
      expiry: expiry
    };
    localStorage.setItem(key, JSON.stringify(item));
    return true;
  } catch (e) {
    console.error('本地存储失败:', e);
    return false;
  }
}

/**
 * 获取本地存储
 * 从 localStorage 读取数据，自动进行 JSON 反序列化，并检查过期时间
 * @param {string} key - 存储键名
 * @returns {*} 存储的值，如果不存在或已过期则返回 null
 * @example
 * const user = getStorage('user');
 * if (user) { console.log(user.name); }
 */
function getStorage(key) {
  try {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    
    // 检查是否有过期时间设置
    if (item.expiry) {
      const now = Date.now();
      const age = now - item.timestamp;
      
      // 如果已过期，删除并返回 null
      if (age > item.expiry) {
        localStorage.removeItem(key);
        return null;
      }
    }
    
    return item.value;
  } catch (e) {
    console.error('读取本地存储失败:', e);
    return null;
  }
}

/**
 * 删除本地存储
 * @param {string} key - 存储键名
 * @returns {boolean} 是否删除成功
 */
function removeStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('删除本地存储失败:', e);
    return false;
  }
}

/**
 * 清空所有本地存储
 * @returns {boolean} 是否清空成功
 */
function clearStorage() {
  try {
    localStorage.clear();
    return true;
  } catch (e) {
    console.error('清空本地存储失败:', e);
    return false;
  }
}

/**
 * 生成唯一 ID
 * 基于时间戳和随机数生成唯一标识符
 * @param {string} prefix - 可选的前缀
 * @returns {string} 唯一 ID
 * @example
 * generateId() // 'lm3k9x7a2b'
 * generateId('user') // 'user-lm3k9x7a2b'
 */
function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 11);
  const id = timestamp + randomStr;
  
  return prefix ? `${prefix}-${id}` : id;
}

/**
 * HTML 转义，防止 XSS 攻击
 * @param {string} str - 要转义的字符串
 * @returns {string} 转义后的字符串
 * @example
 * escapeHtml('<script>alert("xss")</script>') // '&lt;script&gt;alert("xss")&lt;/script&gt;'
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * 节流函数
 * 在指定时间内只执行一次函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 时间限制（毫秒），默认 300ms
 * @returns {Function} 节流后的函数
 * @example
 * const throttledScroll = throttle(handleScroll, 200);
 * window.addEventListener('scroll', throttledScroll);
 */
function throttle(func, limit = 300) {
  let inThrottle;
  
  return function throttled(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * 深拷贝对象
 * @param {*} obj - 要拷贝的对象
 * @returns {*} 拷贝后的对象
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * 检查是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 平滑滚动到指定元素
 * @param {string|HTMLElement} target - 目标元素或选择器
 * @param {number} offset - 偏移量（像素），默认 0
 */
function smoothScrollTo(target, offset = 0) {
  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;
  
  if (!element) return;
  
  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth'
  });
}

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @param {number} decimals - 小数位数，默认 2
 * @returns {string} 格式化后的文件大小
 * @example
 * formatFileSize(1024) // '1.00 KB'
 * formatFileSize(1048576) // '1.00 MB'
 */
function formatFileSize(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * 等待指定时间
 * @param {number} ms - 等待时间（毫秒）
 * @returns {Promise} Promise 对象
 * @example
 * await sleep(1000); // 等待 1 秒
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 导出所有函数（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseQueryString,
    formatDate,
    debounce,
    throttle,
    lazyLoadImages,
    getDeviceType,
    setStorage,
    getStorage,
    removeStorage,
    clearStorage,
    generateId,
    escapeHtml,
    deepClone,
    isMobile,
    smoothScrollTo,
    formatFileSize,
    sleep
  };
}

/**
 * 初始化导航栏搜索框
 * 为搜索框添加交互逻辑，包括空搜索验证和视觉反馈
 * @param {string} formSelector - 搜索表单选择器，默认 '.search-box form'
 * @param {string} inputSelector - 搜索输入框选择器，默认 '#search-input'
 * @example
 * // 在页面加载后调用
 * initSearchBox();
 * // 或使用自定义选择器
 * initSearchBox('.my-search-form', '#my-search-input');
 */
function initSearchBox(formSelector = '.search-box form', inputSelector = '#search-input') {
  const searchForm = document.querySelector(formSelector);
  const searchInput = document.querySelector(inputSelector);
  
  if (!searchForm || !searchInput) {
    console.warn('搜索框元素未找到');
    return;
  }
  
  // 防止提交空搜索
  searchForm.addEventListener('submit', function(e) {
    const keyword = searchInput.value.trim();
    
    if (!keyword) {
      e.preventDefault();
      searchInput.focus();
      
      // 添加视觉反馈（抖动动画）
      searchInput.classList.add('shake');
      setTimeout(() => {
        searchInput.classList.remove('shake');
      }, 500);
      
      return false;
    }
    
    // 允许表单正常提交到 search.html
    return true;
  });
  
  // 输入时移除错误状态
  searchInput.addEventListener('input', function() {
    searchInput.classList.remove('shake');
    searchInput.classList.remove('error-shake');
  });
  
  // 可选：添加防抖优化（如果需要实时搜索建议）
  // const debouncedSearch = debounce(function() {
  //   const keyword = searchInput.value.trim();
  //   if (keyword.length >= 2) {
  //     // 这里可以添加搜索建议功能
  //     console.log('搜索建议:', keyword);
  //   }
  // }, 300);
  // 
  // searchInput.addEventListener('input', debouncedSearch);
}

