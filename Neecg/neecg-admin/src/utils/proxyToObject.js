// 将 proxy 转化 成 正常对象
export function proxyToObject(proxy) {
    const target = {}; // 创建一个普通的空对象
    // 使用Reflect.ownKeys而不是Object.keys，因为它包括不可枚举属性和符号属性
    Reflect.ownKeys(proxy).forEach(key => {
      // 获取proxy中每个属性的值
      const value = proxy[key]; 
      // 检查属性值是否是对象，如果是，递归调用以拷贝
      if (value && typeof value === 'object') {
        target[key] = proxyToObject(value); // 递归复制
      } else {
        target[key] = value; // 直接赋值
      }
    });
    return target; // 返回新构建的普通对象
  }