[中文](./README.md) | [English](./README.en.md)

# name2email

> 一个基于 Vite + Vue 开发的Chrome Manifest v3 扩展

## 安装

1. `Node.js` 版本 >= **18.27.0**
2. 运行 `npm install` 安装依赖

## 开发

### Chrome 扩展开发模式

```shell
$ cd name2email

$ npm run dev
```

1. 打开Chrome浏览器开发者模式
2. 扩展界面中选点击 `加载已解压的扩展程序`, 然后选择 `name2email/build` 文件夹

### 前端项目开发模式

```shell
$ cd name2email

$ npm run dev
```

1. 访问 `http://localhost:5173/` 或者修改后的vite服务器地址
2. popup弹窗页面的调试请打开 `http://localhost:5173/popup.html`
3. sidepanel侧边栏页面的调试请打开 `http://localhost:5173/sidepanel.html`

## 打包

完成开发后请执行以下命令

```shell
$ npm run build
```

`build` 文件夹的内容将是可以提交到 Chrome
应用商店的扩展程序，查看 [官方指南](https://developer.chrome.com/webstore/publish) 以获取有关发布的更多信息。
