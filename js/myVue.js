/*
 * @Author: zhy
 * @Date: 2022-01-11 11:17:27
 * @Description: 
 * @LastEditTime: 2022-01-12 12:35:52
 */
class MyVue {
    constructor(options) {
        this.$options = options || {};
        const data = this._data = this.$options.data;
        // 数据代理
        // 实现 vm.xxx -> vm._data.xxx
        Object.keys(data).forEach((key) => {
            this._proxyData(key);
        });
        this._initComputed();
        new Observer(data, this);
        this.$compile = new Compile(options.el || document.body, this)
        this._watch();
    }
    _proxyData(key, setter, getter) {
        const _this = this;
        setter = setter ||
        Object.defineProperty(_this, key, {
            configurable: false,
            enumerable: true,
            get() {
                return _this._data[key];
            },
            set(newVal) {
                _this._data[key] = newVal;
            }
        });
    }
    _initComputed() {
        const _this = this;
        const computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(_this, key, {
                    get: typeof computed[key] === 'function'
                            ? computed[key]
                            : computed[key].get,
                    set() {}
                });
            });
        }
    }
    _watch() {
        const watch = this.$options.watch;
        if (typeof watch === 'object') {
            Object.keys(watch).forEach((key) => {
                new Watcher(this, key, watch[key]);
            });
        }
    }
}