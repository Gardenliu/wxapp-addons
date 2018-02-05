## document

### Component 

- location : vendor/components/ 下面定义
- structure

```javascript
├─vendor 插件目录[+]
│  ├─components  组件目录[+]
│  │  ├─icon    icon组件目录[+]
│  │  │  ├─icon.wxss  icon样式文件
│  │  │  ├─icon.wxml  icon样式文件
│  │  │  ├─icon.json  icon样式文件
│  │  │  ├─icon.js  icon样式文件
│  ├─shop-model 应用子树目录[+]
│  │  ├─....
├─pages
```

### Development steps

1. The test component to create

```
//location page/custom/pages/ 目录下面创建
├─icon    icon组件目录[+]
│  ├─icon.wxss  icon样式文件
│  ├─icon.wxml  icon中Dom文件
│  ├─icon.json  注册组件 
│  ├─icon.js    逻辑编写
```

2. The test component registration
```
//在app.json 内部 注册测试页面
{
  "root": "page/custom/",
  "pages": [
    "pages/badge/index",
    "pages/cell/index",
    "pages/capsule/index"
  ]
}
```
3. The component list for test data to add
```
//location: pages/tarBar/index.js
list: [
  {
    id: 'view',
    name: 'viewname',
    open: false,
    pages: ['badge', 'cell', 'capsule'] //list for test data to add
  }
]
```