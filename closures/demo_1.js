// 简单闭包 Demo
function init() {
    const name = 'gary';
    function displayName() {
        console.log(name);
    }
    displayName();
}

init();

function makeFunc() {
    const name = 'gary tian';
    function displayName() {
        console.log(name);
    }

    return displayName;
}

const myFunc = makeFunc();
myFunc();

function makeAdder(x) {
    return function (y) {
        return x + y;
    }
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);

console.log(add5(2));
console.log(add10(2));