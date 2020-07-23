
// 导入Vue
const { createApp, reactive, computed, watch, toRefs, onMounted, onUpdated, onUnmounted } = Vue;

// Vue实例化
const app = createApp({

    setup() {

        // 数据响应式
        let state = reactive({
            matter: [
                { status: 0, title: '周末去打球' }
            ],

            time: new Date().toLocaleString(),
            date: '',
            myDate: {
                time: new Date().toLocaleString(),
            },

            notNum: 0,
            yesNum: 0,

            obj: { id: 101, name: 'admin' },

            // 计算属性
            notMatter: computed(() => {
                return state.matter.filter((item, index, arr) => {
                    // console.log(item);
                    return 0 == item.status;
                }).length;
            }),

            // 计算已己办事项
            yesMatter: computed(() => {
                return state.matter.filter(o => (1 == o.status)).length;
            })
        });

        // 侦听器
        watch(() => state.matter, (newVal, oldVal) => {
            saveData();
            state.notNum = newVal.filter(o => (0 == o.status)).length;
            state.yesNum = newVal.filter(o => (1 == o.status)).length;

            console.log('state.matter被修改了：', newVal);
        });

        watch(() => state.time, (newVal, oldVal) => {
            // console.log('state.time被修改了：', newVal, oldVal);
            state.date = newVal;
        });

        watch(() => state.myDate, (newVal, oldVal) => {
            console.log('state.myDate.time被修改了：', newVal, oldVal);
        });

        // watch: {
        //     myDate: {
        //         deep: true,
        //         handler(newVal, oldVal) {
        //             console.log('state.obj.id被修改了：', newVal, oldVal);
        //         }
        //     }
        // }

        watch({
            "myDate": {
                deep: true,
                handler(newVal, oldVal) {
                    console.log('state.obj.id被修改了：', newVal, oldVal);
                }
            }
        })

        // watch(() => state.obj, (newVal, oldVal) => {
        //     console.log('state.obj被修改了：', newVal, oldVal);
        // });

        // watch({
        //     obj: {
        //         deep: true,
        //         handler(newVal, oldVal) {
        //             console.log('state.obj.id被修改了：', newVal, oldVal);
        //         }
        //     }
        // });


        // Vue组件实例化完成
        onMounted(() => {

            // 页面初始化时，获取本地数据
            let matter = storage.get('matter');
            if (matter) state.matter = matter;

            // state.obj = { id: 101, name: 'root' };
            state.obj.id = 102;

            setInterval(function () {
                state.time = new Date().toLocaleString();
                state.myDate.time = new Date().toLocaleString();
            }, 1000);
        });

        onUpdated(() => {
            // console.log('组件更新了！');
        });

        onUnmounted(() => {
            // console.log('组件卸载了！');
        });

        function objArrIsReset(objArr, key, value) {
            // 判断数据中是否有已存在的对象值
            for (let i = 0; i < objArr.length; i++) {
                if (value == objArr[i][key]) return true;
            };
            return false;
        }

        function saveData() {
            // 数据本地持久化
            storage.set('matter', state.matter);
        }

        function onChange() {
            saveData();
        }

        function addMatter(e) {
            if (13 == e.keyCode) {
                let value = e.target.value;
                if (value) {
                    if (!objArrIsReset(state.matter, 'title', value)) {
                        state.matter.unshift({
                            title: value,
                            status: 0
                        });
                        e.target.value = '';
                        console.log(state.matter);

                        saveData(); // 本地数据持久化
                    } else {
                        alert('您输入的待办事项已存在！');
                    }
                } else {
                    alert('请输入待办事项！');
                }
            }
        };

        function delMatter(i) {
            if (confirm(`您确定要删除【${state.matter[i].title}】这个事项吗？`)) {
                state.matter.splice(i, 1);
                saveData();
            }
        };

        // 向外暴露数据和事件
        return { ...toRefs(state), addMatter, delMatter, onChange }
    }
});

// 全局实例组件
app.component('Item', {
    template: `
     <li v-for="(item, i) in matter" v-show="1 == item.status">
        <label>
            <input type="checkbox" v-model="item.status" @change="onChange($event)" />
            {{item.title}}
        </label>
        <i @click="delMatter(i)">×</i>
    </li>`
})

// 实例挂载
app.mount('#app');
