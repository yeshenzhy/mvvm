/*
 * @Author: zhy
 * @Date: 2022-01-11 11:17:27
 * @Description: 
 * @LastEditTime: 2022-01-12 12:18:32
 */

class Observer {
    constructor(data) {
        this.data = data;
        this.walk(data);
    }
    walk(data) {
        Object.keys(data).forEach((key) => {
            this.defineReactive(this.data, key, data[key]);
        });
    }
    defineReactive(data, key, val) {
        const _this = this;
        const dep = new Dep();
        let childObj = this.observe(val);
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get() {
                if (Dep.target) {
                    // console.log(Dep.target,44);
                    dep.depend();
                }
                return val;
            },
            set(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = _this.observe(newVal);
                // 通知订阅者
                dep.notify();
            }
        });
    }
    observe(value, vm) {
        if (!value || typeof value !== 'object') {
            return;
        }
        return new Observer(value);
    }
}
let uid = 0;
class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    depend() {
        Dep.target.addDep(this);
    }
    removeSub(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    }
    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}
Dep.target = null;

