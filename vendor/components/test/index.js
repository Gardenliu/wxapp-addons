let behav=Behavior({
    methods: {
        submits: function(){
            console.log('触发混合模式/行为 behavior中的submit事件')
        }
    }
})
Component({
    behaviors:[behav],  //功能:混合组件参数对象,扩展组件参数对象,降低耦合度.(触发-扩展行为/混合模式,类似vue中的mixins,)
    options: {
        multipleSlots: true // 功能:启用多slot支持,vue中不需要,可直接定义
    },
    properties: {
        // 类似vue中的prop属性,也属于单向数据传递,通过自定义事件输出
        list: {
            type: Array,
            value: [],
            observer: function(newVal, oldVal){} // 功能:属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串
        }
    },
    data: {
        // 这里是一些组件内部数据
        mydata:1
    },
    ready:function () {
        console.log('组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息')
    },
    methods: {
        // 这里是一个自定义方法
        customMethod: function(){
            console.log('检查组件是否具有 behavior',this.hasBehavior(behav));
            var myEventDetail = {myDetail:this.data.mydata} // detail对象，提供给事件监听函数
            var myEventOption = { bubbles: true, composed: true } // bubbles--事件是否冒泡,composed--事件将只能在引用组件的节点树上触发，不进入其他任何组件内部
            this.triggerEvent('myevent', myEventDetail, myEventOption); //触发器,和vue中的this.$emit类似,自定义事件(本例自定义myevent事件)
        }
    }
})