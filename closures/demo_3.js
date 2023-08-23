const makeCounter = function () {
    let privateCounter = 0;
    function changeBy(val) {
        privateCounter += val;
    }

    return {
        increment: (value) => {
            changeBy(value);
        },
        decrement: (value) => {
            changeBy(-value);
        },
        getValue: () => {
            return privateCounter;
        },
    };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

console.log(counter1.getValue());
counter1.increment(10);
console.log(counter1.getValue());
counter1.decrement(20);
console.log(counter1.getValue());

console.log(counter2.getValue());
