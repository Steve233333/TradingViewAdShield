# TradingView Ad Shield

一个针对 TradingView 图表页的轻量广告拦截扩展。它采用两层拦截：

1. 使用 Manifest V3 的 `declarativeNetRequest` 在浏览器网络层阻止广告请求。
2. 使用 TradingView 页面内容脚本隐藏已经生成或残留的广告容器。

## 拦截范围

- Google 广告域名：`googlesyndication.com`、`doubleclick.net`、`googleadservices.com`、`adservice.google.com`
- TradingView 图表页广告容器：`#charting-ad`、`div-gpt-ad-toast-ad-*`、Google Ads iframe

网络规则只在 `tradingview.com` 发起的请求中生效，不会变成全局广告拦截器。

## Chrome / Edge 安装

1. 打开 `chrome://extensions` 或 `edge://extensions`。
2. 开启“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本项目目录 `/Library/Project/TradingViewAdShield`。
5. 打开或刷新 TradingView 图表页面。

扩展图标弹窗内可以在线开关拦截。切换后建议刷新当前页面。

## 浏览器限制

- Codex 内置浏览器通常不允许加载本地第三方扩展。要在其中生效，需要由宿主应用提供内容脚本注入入口。
- Safari 需要额外的 Xcode 工程、签名和 Safari Web Extension 配置；本目录当前提供的是 Chrome/Edge 兼容版本。
- 为避免误伤 TradingView 正常功能，不拦截 Google Tag Manager、行情数据或 `static.tradingview.com` 资源。

## 开发检查

```bash
node scripts/validate.mjs
```

该检查会验证 Manifest、规则文件和 JavaScript 语法。
