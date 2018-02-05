Component({
    properties: {
        list: {
            type: Array,
            value: [],
            observer: function (newVal) {
                let {fieldTitle, fieldDesc, curent} = this.data;
                fieldTitle = fieldTitle ? fieldTitle : 'title';
                fieldDesc = fieldDesc ? fieldDesc : 'desc';
                let stepper = isNaN(curent) ? 1 : curent <= 0 ? 1 : curent > newVal.length ? newVal.length : curent;
                let arr = newVal.map((item, index) => {
                    return {
                        done: (index <= stepper-1),
                        current: (index === stepper-1),
                        title: item[`${fieldTitle}`],
                        desc: item[`${fieldDesc}`]
                    }
                });
                this.setData({
                    steps: arr,
                })
            }
        },
        curent: Number,
        fieldTitle: String,
        fieldDesc: String,
        type: String, //默认:横向,参数: 'vertical'
        isDesc: Boolean //是否显示描述
    },
    data: {
        steps: null,
    }
})