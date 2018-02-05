import {jumpUrl} from "../../../util/base.js";
/**
 * slot
 * header : 头部
 * footer:尾部
 * slot低优先级
 */
Component({
    options: {
        multipleSlots: true
    },
    properties: {
        icon: Object, //{type:'chat',color:'#f00'} 字体大小默认16
        title: String,
        desc: String,
        footer: String,
        isSwitch: Boolean,
        isField:Boolean,
        isLink: {
            type: Boolean,
            value: false,
        },
        link: {
            type: null,
            value: null
        }
    },
    data: {
        types: ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack'],
    },
    methods: {
        linkAction(){
            let link = this.data.link;
            let strType = typeof link === 'string', objType = typeof link === 'object';
            if (!strType && !objType || !link) return false;


            let {href, isRedirect} = objType ? this.data.link : {href: link, isRedirect: false};
            if (!href) return false;

            isRedirect = !!isRedirect; //默认不跳转
            jumpUrl(href, isRedirect);
        },
    }
})