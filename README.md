# 浏览器插件

## 安装依赖项

```shell
npm install
```

## 项目打包

> 打包之后会生成一个`dist`文件夹，浏览器加载插件时，选择该文件夹。

```shell
npm build
```

## 插件配置文件

> 加载插件之前，需要将`dist2`文件夹下的`4`个文件，拷贝到`dist`文件夹下。

```
dist2
 |__ js
     |__ background.js
     |__ content.js
     |__ logo.png
     |__ manifest.json
```

## 加载浏览器插件

> 文件拷贝到`dist`文件夹之后，在浏览器中输入网址[chrome://extensions/](chrome://extensions/)，打开扩展程序管理页面。
