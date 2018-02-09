import { debounce,jumpUrl } from "../../../util/base.js";

const STORAGE_KEYS = {
    SEARCH_ELEMENT: "SEARCH_ELEMENT",
    SEARCH_HISTORY: "SEARCH_HISTORY"
};
const HISTORY_KEY = `${STORAGE_KEYS}_sc`;
Component({
    properties: {
        // 类似vue中的prop属性,也属于单向数据传递,通过自定义事件输出
        value: String,
    },
    data: {
        inputWord:'',
        going:false,
        history:[]
    },
    ready:function () {
        let value = this.data.value;
        this.setData({
            inputWord: value,
        });
        /*let history = wx.getStorageSync(HISTORY_KEY);
        history = Array.isArray(history) ? history : [];
        console.log('h1', history);
        name = decodeURIComponent(name || "");
        this.setData({
            inputWord: name,
            history
        })*/
    },
    methods: {
        input: debounce(function (e) {
            let { value } = e.detail;
            this.setData({
                inputWord: value
            })
        },100),
        inputfocus:function(){
            this.setData({
                focus:true
            })
        },
        inputblur:function(){
            this.setData({
                focus: false
            })
        },
        clear:function(){
            wx.setStorageSync(HISTORY_KEY, []);
            this.setData({
                history:[]
            })
        },
        tapHistory:function(e){
            let keyword = encodeURIComponent(e.currentTarget.dataset.name || "");
            keyword = keyword.trim();
            //TODO 跳转链接
            jumpUrl(`/pages/category/category?keyword=${keyword}`, true);
        },
        search:function(){
            let { inputWord, going, history } = this.data;
            inputWord = inputWord.trim();
            if(going) return ;
            this.data.going = true;
            if(history.every(function (h) {
                    return h != inputWord
                })){
                [].unshift.call(history, inputWord);
            }
            if (inputWord){
                wx.setStorageSync(HISTORY_KEY, history)
            }
            let keyword = encodeURIComponent(inputWord || "");
            var myEventDetail = {myDetail:keyword}
            this.triggerEvent('change', myEventDetail);
        },
    }
})