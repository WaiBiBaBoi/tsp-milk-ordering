
const  safeJSONParse = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      // 解析出错时，你可以在这里处理错误，或者返回 null 或其他指示无效的值
    //   console.error('解析JSON出错：', e);
      return str; // 或者返回undefined或者抛出错误，根据你的错误处理策略决定
    }
  }

export const setItem = (name, data) => {
    if (typeof data === 'object') {
        data = JSON.stringify(data)
    }
     sessionStorage.setItem(name, data)
    
}

export const getItem = (name) => {
    let result = sessionStorage.getItem(name)
    if (result) {
        return safeJSONParse(result)
    } else {
        return null
    }
}

export const getUser = () => {
    let result = sessionStorage.getItem('delivery-user')
    if (result) {
        return safeJSONParse(result)
    } else {
        return null
    }
}

export const clearUser = () => {
    sessionStorage.removeItem('delivery-user');
    sessionStorage.removeItem('delivery-token');
}

export const getToken = () => {
    let result = sessionStorage.getItem('delivery-token')
    if (result) {
        return safeJSONParse(result)
    } else {
        return null
    }
}