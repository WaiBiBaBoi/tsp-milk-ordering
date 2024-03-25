// registerGlobalComponents.js
// 用来快速注册指定文件夹下的vue组件
export default function registerGlobalComponents(app) {
    const requireComponent = require.context(
      // 组件所在的目录的相对路径
      '@/components/neecg',
      // 是否查询其子目录
      false,
      // 匹配基础组件文件名的正则表达式
      /N[A-Z]\w+\.(vue|js)$/
    );
  
    requireComponent.keys().forEach(fileName => {
      // 获取组件配置
      const componentConfig = requireComponent(fileName);
      
      // 获取组件的 PascalCase 命名
      const componentName = fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
        // .replace(/^Base/, '');
  
      // 全局注册组件
      app.component(
        componentName,
        componentConfig.default || componentConfig
      );
    });
  }