# Vue-3x-Study
** Vue3系列探究 vue-next **



Vite：[https://github.com/vitejs/vite](https://github.com/vitejs/vite)

Vue-Next：[https://github.com/vuejs/vue-next](https://github.com/vuejs/vue-next)

Vue-Next-Webpack：[https://github.com/vuejs/vue-next-webpack-preview](https://github.com/vuejs/vue-next-webpack-preview)

Vue Composition API：[https://vue-composition-api-rfc.netlify.app/api.html](https://vue-composition-api-rfc.netlify.app/api.html)



## 调试环境搭建 

* 迁出Vue3源码： git clone https://github.com/vuejs/vue-next.git 

* 安装依赖： yarn --ignore-scripts  

* ⽣成sourcemap⽂件，在package.json 文件中添加 --sourcemap 配置 映射源码，以方便查看源码

  ```js
  "dev": "node scripts/dev.js --sourcemap"  
  ```

  

* 编译： yarn dev   

  > ⽣成结果： 
  >
  > packages\vue\dist\vue.global.js  // vue.global.js 就是 vue3生成后的文件啦！
  >
  > packages\vue\dist\vue.global.js.map 



* 调试范例代码： yarn serve 



**源码位置是在packages目录中**，实际上源码主要分为两部分，编译器 和 运⾏时环境。

 ![](https://raw.githubusercontent.com/MuGuiLin/Vue-3x-Study/master/ymjg.png)

+ 编译器 

  - compiler-core 核⼼编译逻辑 

  - compiler-dom 针对浏览器平台编译逻辑 

  - compiler-sfc 针对单⽂件组件编译逻辑 

  - compiler-ssr 针对服务端渲染编译逻辑 

    

* 运⾏时环境

  - runtime-core 运⾏时核⼼ 
  - runtime-dom 运⾏时针对浏览器的逻辑 

  - runtime-test 浏览器外完成测试环境仿真 

  

* reactivity 响应式逻辑 

* template-explorer 模板浏览器 

* vue 代码⼊⼝，整合编译器和运⾏时 

* server-renderer 服务器端渲染 

* share 公⽤⽅法



## Vue 3初探

```html
<div id="app">
	<h1 @click="onclick">{{message}}</h1>
	<comp></comp>
</div>
<script src="../dist/vue.global.js"></script>
<script>
	const { createApp } = Vue;
	const app = createApp({
		components: {
			comp: {
				template: '<div>this is a component</div>'
			}
		},
		data: { message: 'Hello Vue3!' },
		methods: {
			onclick() {
				console.log('ok 666');
			}
		},
	}).mount('#app')
</script>
```





## Composition API 

[Composition API](https://vue-composition-api-rfc.netlify.app/api.html)字⾯意思是组合API，它是为了实现**基于函数**的**逻辑复⽤机制**⽽产⽣的。

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Composition API</title>
    <script src="./js/vue.global.js"></script>
</head>

<body>
    <div id="app">
        <h1>Composition API</h1>
        <hr />

        <div @click="add">点我试试: {{ state.count }}</div>

        <h3>toRefs解构后，前面不用加data啦: {{text}}</h3>

        <h3>{{time}}</h3>

        <h2>doubleCount: {{doubleCount}}</h2>
    </div>
    <script>
        const { createApp, reactive, computed, watch, onMounted, toRefs } = Vue;

        // 声明组件
        const App = {

            // setup是⼀个新的组件选项，它是组件内使⽤Composition API的⼊⼝
            // 调⽤时刻是初始化属性确定后，beforeCreate之前
            setup() {
                // 数据响应式：接收⼀个对象，返回⼀个响应式的代理对象
                const state = reactive({

                    count: 0,

                    // 计算属性 computed()返回⼀个不可变的响应式引⽤对象
                    // 它封装了getter的返回值
                    doubleCount: computed(() => {
                        return state.count * 2;
                    })
                });

                // 可以随处声明多个初始数据（在vue2中只能在data(){return{xxx:xxx}}）
                const data = reactive({
                    text: 'Hello Vue-Next',
                    time: new Date().toLocaleTimeString()
                });

                //侦听器：watch()
                // state.count变化cb会执⾏
                watch(() => state.count, (newVal, oldval) => {
                    console.log('count变了:' + newVal);
                });

                onMounted(() => {
                    console.log('组件实例化完成啦！');

                    setInterval(function () {
                        data.time = new Date().toLocaleTimeString()
                    }, 1000);
                })

                // 添加事件：声明⼀个add函数
                function add() {
                    state.count++
                };

                // 返回对象将和渲染函数上下⽂合并
                return { state, ...toRefs(data), add }
            }
        };

        createApp(App).mount('#app');
    </script>
</body>

</html>
```

