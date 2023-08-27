type Deadline = {
    timeRemaining: () => number; // 当前剩余的可用时间。即该帧剩余时间。
    didTimeout: boolean; // 是否超时。
};

function work(deadline: Deadline) {
    // deadline 上面有一个 timeRemaining() 方法，能够获取当前浏览器的剩余空闲时间，单位：ms
    // 有一个属性 didTimeout，表示是否超时
    console.log(`当前帧剩余时间: ${deadline.timeRemaining()}`);
    if (deadline.timeRemaining() > 1 || deadline.didTimeout) {
        // 时间有余，可以执行自己的逻辑
    }
    // 时间不够了，应该让出控制权给主线程，下次空闲时继续调用
    requestIdleCallback(work);
}

// 可以传一个回调函数(必须)和参数(目前就一个超时参数)
requestIdleCallback(work, { timeout: 1000 });