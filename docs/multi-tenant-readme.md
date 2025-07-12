# 多租户/多产品全栈模板

## 架构说明
- 所有产品共用一套 API 和数据库表，通过 product_slug 字段自动隔离数据。
- API 路由自动识别 subdomain，前端无需关心多租户逻辑。
- 支持 5 个及以上产品横向扩展，支持用户增长。

## 快速扩展新产品
1. 在 products 表新增 slug（如 newproduct）
2. 新建前端页面或复用现有模板
3. 通过 newproduct.mornhub.net 访问即可自动隔离数据

## 业务表结构建议
- 所有业务表都加 product_slug 字段
- 支持批量导入、权限隔离、无限扩展

## API 路由建议
- 所有 API 路由自动识别 subdomain
- 前端调用无需传 product_slug，体验极致友好 