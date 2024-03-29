export function getCookies() {
  var cookies = {}; // 创建一个空对象来存储结果
  var all = document.cookie; // 获取所有cookie字符串
  if (all === "") {
    return cookies; // 如果cookie为空，直接返回空对象
  }
  var list = all.split("; "); // 分割cookie字符串，得到单独的key=value对
  for (var i = 0; i < list.length; i++) {
    var cookie = list[i];
    var p = cookie.indexOf("="); // 找到第一个'='，这将分隔键和值
    var name = cookie.substring(0, p); // 获取key
    var value = cookie.substring(p + 1); // 获取value
    value = decodeURIComponent(value); // 对value进行解码
    cookies[name] = value; // 将key=value对存到结果对象中
  }
  return cookies; // 返回对象
}
export function getCookieValue(name) {
  var cookies = getCookies(); // 使用上面的函数获取所有cookies
  return cookies[name]; // 返回特定name的cookie值
}

export function deleteCookie(name) {
  // 设置该cookie的过期时间为当前时间之前的任意时间，这里使用UTC时间
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}
