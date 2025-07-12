# 多租户 messages API 前端调用示例

## 获取消息
```js
fetch('/api/messages.js')
  .then(res => res.json())
  .then(data => console.log(data));
```

## 新增消息
```js
fetch('/api/messages.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id: 'xxx', content: 'hello world' })
});
```

// 在任意子产品域名（如 rent.mornhub.net）下调用，自动隔离数据。 