# TradingView Ad Shield

一个针对 TradingView 图表页的轻量广告拦截扩展。它采用两层拦截：

1. 使用 Manifest V3 的 `declarativeNetRequest` 在浏览器网络层阻止广告请求。
2. 使用 TradingView 页面内容脚本隐藏已经生成或残留的广告容器。

## 拦截范围

- Google 广告域名：`googlesyndication.com`、`doubleclick.net`、`googleadservices.com`、`adservice.google.com`
- TradingView 图表页广告容器：`#charting-ad`、`div-gpt-ad-toast-ad-*`、Google Ads iframe

网络规则只在 `tradingview.com` 发起的请求中生效，不会变成全局广告拦截器。

仓库：<https://github.com/Steve233333/TradingViewAdShield>

## Chrome / Edge 安装

1. 打开 `chrome://extensions` 或 `edge://extensions`。
2. 开启“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本项目目录 `/Library/Project/TradingViewAdShield`。
5. 打开或刷新 TradingView 图表页面。

扩展图标弹窗内可以在线开关拦截。切换后建议刷新当前页面。

## Safari 安装

`Safari/TradingView Ad Shield/TradingView Ad Shield.xcodeproj` 是由 Apple 官方转换工具生成的 macOS Safari Web Extension 工程。

1. 用 Xcode 打开该工程。
2. 在 Signing & Capabilities 中选择可用的签名身份。
3. 构建并运行 App。
4. 在 Safari 的“设置 → 开发者”中开启“允许未签名的扩展”。
5. 在 Safari 的“设置 → 扩展”中启用 `TradingView Ad Shield Extension`。
6. 刷新 TradingView 页面。

没有 Apple Developer Team 时，也可以使用本机已有的代码签名证书手动构建：

```bash
xcodebuild \
  -project "Safari/TradingView Ad Shield/TradingView Ad Shield.xcodeproj" \
  -scheme "TradingView Ad Shield" \
  -configuration Debug \
  -destination "platform=macOS" \
  -derivedDataPath /tmp/TradingViewAdShieldDerived \
  CODE_SIGN_STYLE=Manual \
  CODE_SIGN_IDENTITY="Codex Patched Signing" \
  DEVELOPMENT_TEAM="" \
  PROVISIONING_PROFILE_SPECIFIER="" \
  build
```

Safari 对本地签名扩展的开发限制可能需要同时开启“允许未签名的扩展”。

## 浏览器限制

- Codex 内置浏览器通常不允许加载本地第三方扩展。要在其中生效，需要由宿主应用提供内容脚本注入入口。
- Safari 扩展必须通过 Safari 设置启用，且本地签名版本可能要求开启“允许未签名的扩展”。
- 为避免误伤 TradingView 正常功能，不拦截 Google Tag Manager、行情数据或 `static.tradingview.com` 资源。

## 开发检查

```bash
node scripts/validate.mjs
```

该检查会验证 Manifest、规则文件和 JavaScript 语法。
