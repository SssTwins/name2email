[中文](./README.md) | [English](./README.en.md)

# name2email

> a chrome extension tools built with Vite + Vue, and Manifest v3

## Installing

1. Check if your `Node.js` version is >= **14.18.0**
2. Run `npm install` to install the dependencies

## Developing

### Chrome Extension Developer Mode

```shell
$ cd name2email

$ npm run bulid
```

1. set your Chrome browser 'Developer mode' up
2. click 'Load unpacked', and select `name2email/build` folder

### Normal FrontEnd Developer Mode

```shell
$ cd name2email

$ npm run dev
```

1. access `http://localhost:5173/` or the modified vite server address
2. when debugging popup page, open `http://localhost:5173/popup.html`
3. when debugging sidepanel page, open `http://localhost:5173/sidepanel.html`

## Packing

After the development of your extension run the command

```shell
$ npm run build
```

Now, the content of `build` folder will be the extension ready to be submitted to the Chrome Web Store. Just take a look
at the [official guide](https://developer.chrome.com/webstore/publish) to more infos about publishing.
