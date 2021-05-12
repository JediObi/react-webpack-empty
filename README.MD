### 项目说明



该项目是 react+antd+webpack+router 的空工程，后续可以扩展 recux 和 saga



测试运行和打包要看 `package.json` 里的 `build` 和 `start` 两个脚本



### webpack 配置说明



`注意: webpack 版本是 5.x, 该版本仅支持 webpack-cli 3.x 版本。`



由于 webpack 5.x 剔除了一些默认配置，如果你不手动引入就会报错。



主要是 `resolve.fallback` 和 两个 providerplugin `buffer`和`process`， 配置你可以在 `./config/webpack.config.common.js` 里看到，所需要的 npm 包已经安装到`package.json`



### fetch api 说明



原始的fetchapi 至少需要使用promise 的一个then 链，一个提取 Response对象后做 json()转换获取response.body。但使用 await 可以直接提取promise中的数据。



await fetch(...) 会直接提取出 Response对象， 

然后 做一个 response.json() 转换既可



#### 代理配置



```js

proxy: {

  "/packet-right": {

    target: "http://localhost:8080",

    pathRewrite: { "^/packet-right": "" },

  },

},

```

或者

```js

proxy: {

  "/packet-right/*": {

    target: "http://localhost:8080",

    pathRewrite: { "/packet-right": "" },

  },

},

```



### babel 说明



babel 对 react 的处理现在单独放在 `./.babelrc` 里。



```json

{

  "presets": ["@babel/preset-env", "@babel/preset-react"],

  "plugins": [

    "syntax-dynamic-import",

    "@babel/plugin-transform-runtime",

    ["@babel/plugin-proposal-decorators", { "legacy": true }],

    [

      "import",

      {

        "libraryName": "antd",

        "libraryDirectory": "es",

        "style": "css"

      }

    ]

  ]

}

```



`@babel/preset-env, @babel/preset-react` 是处理 jsx 代码的配置, npm 依赖就是这两个名字

`syntax-dynamic-import` 是识别 import 导入的, npm 依赖 `babel-plugin-syntax-dynamic-import`

`@babel/plugin-transform-runtime` 识别es6 generator 语法的, npm 依赖就是这个包名

`"@babel/plugin-proposal-decorators` 识别装饰器模式(注解),  npm 依赖就是这个包名



  使用装饰器，ide会提示错误, 根路径添加 jsconfig.json 

```json

{

    "compilerOptions":{

        "experimentalDecorators":true

    }

}

```



### antd 配置说明



我们指定 antd 使用 css 替代其默认的 less, 需要在 `./.babelrc` 里配置。



antd 一般还有主题配置，这里就不说了。



### router 使用说明



我们使用 `react-router-dom` 替代 `react-router`



react-router-dom 封装了一些 dom 简化了 react-router 的使用。



demo 中所有的 route 全部都在 `routes.js` 里创建，其他组件只需要使用 Link 跳转即可。



### 引入 redux



组件的动态渲染依靠组件自身的 state 以及组件之间的 props 传递，这导致动态渲染依赖的数据过于分散，难以管理。



redux 提供函数创建一个公共的 store 对象并赋值给根组件 Provider，所有需要数据管理的组件只要引入 store, 再把自己的 state 绑定到 store 上，然后就可以通过 store.dispatch(action) 执行 store 数据的修改，而 store 数据的修改逻辑在 reducer 函数中，由于 state 绑定到 store 上了，数据变更就会触发组件动态渲染。



综上，你要做以下几点



    创建 store, 赋值给根组件 Provider

    在组件中引入store, 并在需要数据变更的地方调用store.dispatch(action)函数

    编写reducer函数监听action



./src/index.js



```js

import React from "react";

import ReactDOM from "react-dom";

import { Provider } from "react-redux";

import createStore from "./redux/create";

import App from "./App";



const store = createStore();



ReactDOM.render(

  <Provider store={store}>

    <App />

  </Provider>,

  document.getElementById("root")

);

```



- store 创建

  ./src/redux/create.js



```js

import { createStore as _createStore, applyMiddleware } from "redux";

import reducers from "./modules/reducer";



export default function createStore() {

  const store = _createStore(reducers());

  return store;

}

```



./src/redux/modules/reducer.js



在执行 combileReducers 时可以指定 reducer 模块的名称或不指定，这主要影响后续 mapStateToProps 函数从 state 里取出数据，

如果此处指定了名称比如 module1, 则后续是 state.module1.data。如果没自定名称，则可以从 state 里直接取出



```js

import { combineReducers, Reducer } from "redux";

import demo1 from "./demo1";

import demo2 from "./demo2";



const reducers = () =>

  combineReducers({

    demo1,

    demo2: demo2,

  });



export default reducers;

```



以上几点，又引出几个问题



    action 从哪里来的？



        可以手写，但这很不优雅，因为action的特点是 数据在变，而type基本不变。

        所以我们需要写 action 生成函数，你只要给该函数传入数据即可，简化了type部分。





    代码侵入严重



        你要在组件中引入 store, 要使用 store.dispatch 函数，还要写action生成函数。

        对比以往，你的函数来源只有组件自身的函数和props传入的函数，所以引入redux后，组件引入了redux相关的代码。



        redux提供了三个api： mapStateToProps, mapDispatchToProps, connect，`把store里的数据state和函数dispatch映射给组件的props，然后通过connect函数重新包装组件`，这样你可以把action和dispatch逻辑写到独立的文件中了，使组件继续保持优雅。



        但是以上3个api要在组件里显式定义，所以后续又引入了 @connect 注解，直接把定义写到独立的文件中



        比如以下demo



./src/components/demo/connect.js



```js

import { connect } from "react-redux";

import { changeAction } from "../../redux/modules/demo";



export default connect(

  (state) => ({

    //   此处指定了从 state.demo 获取数据，那么你在 combileReducer 时就要给 该模块的reducer指定名称

    userName: state.demo.userName,

  }),

  (dispatch) => ({

    changeName: (name) => dispatch(changeAction(name)),

  })

);

```



- ./src/components/demo/Demo.js



```js

import React from "react";

import connect from "./connect";



@(connect as any)

export class Demo extends React.Component {



  render(){

    let userName = this.props.userName;

    return (

        <div>

            <div>{userName}<div>

            <button onClick={()=>this.props.changeName("测试")}>修改名称</button>

        </div>

    );

  }

}

```



- ./src/redux/modules/demo.js



```js

const actionType = {

  CHANGE: "/demo/changeName",

};



const initState = {

  userName: "originName",

};



// reducer

export default function reducer(state = initState, action) {

  switch (action.type) {

    case actionType.CHANGE:

      return {

        ...state,

        userName: action.data.userName,

      };

    default:

      return state;

  }

}



export const changeAction = (userName) => {

  return {

    type: actionType.CHANGE,

    data: { userName: userName },

  };

};

```



#### 多 reducer



一般每个组件都有自己的 reducer 函数，但 redux 只能处理一个 reduer，所以要把多个分散的 reducer 合并成一个



redux 提供了 combineReducer 函数



#### redux 和 路由



当引入异步之后，可能就需要用 dispatch 的方式来做路由跳转了。



这里使用 connected-react-router 而不是 react-router-redux 。



connected-react-router 使用 ConnectedRouter 替代 之前的 router， 使用 push 函数来创建 action。



以下是改造点



1. store 的修改



   为 reducer 创建函数传参(因为 reducer 里要添加 router 的 reducer，需要 history 参数)



   然后还要加一个中间件 routerMiddleware



./src/redux/create.js



```js

import { createStore as _createStore, applyMiddleware, compose } from "redux";

import reducers from "./modules/reducer";

import { createBrowserHistory } from "history";

import { routerMiddleware } from "connected-react-router";



export const history = createBrowserHistory();



export default function createStore() {

  const store = _createStore(

    reducers(history),

    compose(applyMiddleware(routerMiddleware(history)))

  );

  return store;

}

```



2. reducer 添加 router 的 reducer



```js

import { combineReducers, Reducer } from "redux";

import { connectRouter } from "connected-react-router";

import demo1 from "./demo1";

import demo2 from "./demo2";



const reducers = (history) =>

  combineReducers({

    router: connectRouter(history),

    demo1,

    demo2: demo2,

  });



export default reducers;

```



3. 根 router 替换



它有个 history 属性， 用 store 里创建的那个 history



这里省略其他代码



```js

import { ConnectedRouter } from "connected-react-router";

import { history } from "./redux/create";



<ConnectedRouter history={history}></ConnectedRouter>;

```



### 引入 saga



异步的框架有很多，这里用 `redux-saga`



异步，就是指网络请求的异步处理，传统的网络请求都放在组件内的函数里，但是现在对数据的操作都放在了 reducer 函数中， 如何根据请求结果动态渲染呢，通常的想法就是请求返回数据后，在 reducer 里做 dispatch, 不过 redux 没有提供 reducer 里 dispatch 的能力，所以要依赖异步框架来做。



redux-saga 提供了 异步的 reducer, 并提供了再 reducer 中执行 dispatch 的 put 函数。



- 首先改造 store 创建函数



既然是异步的 reducer 肯定要改造 store, 引入 saga 中间件，并且启动 saga 函数(你可以理解为 saga 函数启动后一直处于循环运行中,这样就实现了类似于 reducer 的监听处理逻辑)



```js

import { createStore as _createStore, applyMiddleware, compose } from "redux";

import createSagaMiddleware from "redux-saga";

import reducers from "./modules/reducer";

import rootSaga from "./rootSaga";

import { createBrowserHistory } from "history";

import { routerMiddleware } from "connected-react-router";



const sagaMiddleware = createSagaMiddleware();

export const history = createBrowserHistory();



export default function createStore() {

  const store = _createStore(

    reducers(history),

    compose(applyMiddleware(routerMiddleware(history), sagaMiddleware))

  );

  sagaMiddleware.run(rootSaga);

  return store;

}

```



然后是 saga 的 reducer 编写



./src/redux/saga/demo.js



```js

import { push } from "connected-react-router";



import { put, call, takeLatest } from "redux-saga/effects";



function* getUserList(action) {

  try {

    const data = yield call(

      fetch,

      "getUserList",

      JSON.stringify(action.userId)

    );

    yield put({ type: "getUserList/success", data: data });

  } catch (e) {

    yield put({ type: "getUserList/fail", error: e.message });

  }

}



export default function* taskSaga() {

  yield takeLatest("getUserList", getUserList);

}

```



`put` 是一个封装的 dispatch

`call` 提供函数的异步执行能力

`taskLatest` 对 es6 generator 的封装, 它会把异步处理函数与 action#type 绑定并监听，这样就构成了 reducer。takeLatest 只处理最后一次触发的 action(多次触发只响应最后一次), taskEvery 每次触发都会响应。



函数带`*` 是因为这是 es6 generator 的写法，表示异步函数，这种函数可以多次返回。`yield`就是返回时的暂存标志。



多模块 saga reducer 合并



saga 的 reducer 也可以分模块编写，最后合并在一起即可, store 的创建代码里引入的 saga 对象就是合并后的这个



./src/redux/rootSaga.js



```js

import { all } from "redux-saga/effects";

import demo from "./saga/demo";



export default function* rootSaga() {

  yield all([taskSaga()]);

}

```
