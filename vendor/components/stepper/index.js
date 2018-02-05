Component({
    properties: {
        size: String,
        min: {
            type: Number,
            value: 0
        },
        max: {
            type: Number,
            value: 1000
        },
        value: null,
        step: {
            type: Number,
            value: 1,
            observer: function (newVal) {
                //step 值 验证
                let stepper = isNaN(newVal) ? 1 : newVal <= 0 ? 1 : newVal;
                this.setData({
                    stepper: stepper
                })
            }
        }
    },
    data: {
        inputValue: 0,
        stepper: 0
    },
    ready: function () {
        let {value, min, max} = this.data;
        if (min >= max) {
            console.log('最小值大于最大值');
        }
        this._filterNum(value);
    },
    methods: {
        _callback(value){
            let {min, max} = this.data;
            if (min >= max || value < min || value > max) return false;
            let myEventDetail = {value: value}
            this.triggerEvent('change', myEventDetail);
        },
        _filterNum(num){
            let {min, max} = this.data;
            let inputVal = parseInt(num);
            inputVal = isNaN(num) ? min : inputVal <= min ? min : inputVal >= max ? max : inputVal;
            this.setData({
                inputValue: inputVal,
                value: inputVal
            })
        },
        _handleStepperAction(ev){
            let {type} = ev.target.dataset;
            let flag = type === 'plus';
            let {inputValue, stepper, min, max} = this.data;
            if (min >= max) return false;
            let curNum = flag ? inputValue + stepper : inputValue - stepper;
            curNum = curNum <= min ? min : curNum;
            curNum = curNum >= max ? max : curNum;
            this.setData({
                inputValue: curNum,
                value: curNum
            });

            this._callback(curNum);
        },
        _handleStepperInput(ev){
            let value = ev.detail.value;
            this._filterNum(value);
            this._callback(this.data.inputValue);
        }
    }
})