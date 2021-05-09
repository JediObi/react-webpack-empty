### 项目说明

该项目是 react+antd+webpack+router 的空工程，后续可以扩展 recux和saga

测试运行和打包要看 `package.json` 里的 `build` 和 `start` 两个脚本

### webpack 配置说明

`注意: webpack 版本是 5.x, 该版本仅支持 webpack-cli 3.x 版本。`

由于 webpack 5.x 剔除了一些默认配置，如果你不手动引入就会报错。

主要是 `resolve.fallback` 和 两个providerplugin `buffer`和`process`， 配置你可以在 `./config/webpack.config.common.js` 里看到，所需要的npm包已经安装到`package.json`

### babel 说明

babel 对 react 的处理现在单独放在 `./.babelrc` 里。

### antd 配置说明

我们指定antd使用css替代其默认的less, 需要在 `./.babelrc` 里配置。

antd 一般还有主题配置，这里就不说了。

### router 使用说明

我们使用 `react-router-dom` 替代 `react-router` 

react-router-dom 封装了一些 dom 简化了 react-router 的使用。

demo中所有的 route 全部都在 `routes.js` 里创建，其他组件只需要使用Link跳转即可。

### 引入redux

组件的动态渲染依靠组件自身的state以及组件之间的props传递，这导致动态渲染依赖的数据过于分散，难以管理。

redux可以提供一个公共store 以树形结构存储所有组件的数据，便于管理数据。

通常的做法就是把组件的props与store关联， 组件通过dispatch函数和reducer函数 与 redux的store交互。

dispatch函数负责分发 action对象, action对象携带动作标志和数据，reducer函数负责监听action对象并可以修改store对象，store关联的props被修改就触发了组件的动态渲染。

### 引入saga

saga 提供了对请求的异步处理能力，在没有异步时，你只能在dispatch里可以根据请求结果做dispatch和路由跳转
