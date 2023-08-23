// 避免使用闭包 demo
function MyObject(name, msg) {
    this.name = name;
    this.msg = msg;

    this.getName = () => {
        return this.name;
    };

    this.getMsg = () => {
        return this.msg;
    };
}

// 上述 demo 会在每次创建新的 类实例 时，方法都会被重新赋值一次（没必要）

// 改良：没必要使用闭包
function MyObject2(name, message) {
    this.name = name;
    this.msg = message;
}

MyObject2.prototype.getName = function () {
    return this.name;
};

MyObject2.prototype.getMsg = function () {
    return this.msg;
};

// 继承的原型可以为所有对象共享，不必在每一次创建对象时定义方法。