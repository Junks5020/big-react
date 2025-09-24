## React项目结构

    - react（宿主环境无关的公用方法）
    - react-reconciler(协调器的实现，宿主环境无关)
    - 各种宿主环境的包
    - shred（公共辅助方法，宿主环境无关）

JSX ——> react包

```js
//jsx转换
<div>123</div>  ->  _jsx('div', { children: '123' })
```

包括两部分

- 编译时
- 运行时： jsx方法或React.createElement方法的实现（包括dev、prod两个环境）

编译时由babel进行实现，运行时我们来实现，工作量包括:

- 1、实现jsx方法
- 2、实现打包流程
- 3、实现调试打包结果的环境

实现jsx方法
包括：

- jsxDev方法（dev环境）
- jsx方法（prod环境）
- React.createElement方法

实现打包流程
对应上述方法，打包对应文件
react/jsx-dev-runtime.js
react/jsx-runtime.js
react
