function showHelp(help) {
    document.getElementById('help').innerHTML = help;
}

// Method1: 增加更多闭包
// function makeShowHelpFunc(help) {
//     return showHelp(help);
// }

function setupHelp() {
    const helpText = [
        { id: "email", help: "Your e-mail address" },
        { id: "name", help: "Your full name" },
        { id: "age", help: "Your age (you must be over 16)" },
    ];

    // Method 3: 使用 for-of（类似于 Method 2）
    // for (const item of helpText) {
    //     document.getElementById(item.id).onfocus = () => {
    //         showHelp(item.help);
    //     };
    // }

    for (var i = 0; i < helpText.length; i++) {
        var item = helpText[i];
        document.getElementById(item.id).onfocus = function () {
            showHelp(item.help);
        }
    }

    // Method 2: 使用匿名闭包，马上将当前循环项的 item 和事件关联起来
    for (var i = 0; i < helpText.length; i++) {
        (function () {
            var item = helpText[i];
            document.getElementById(item.id).onfocus = function () {
                showHelp(item.help);
            }
        })()
    }

    // other method: use let / const or for-of / forEach
}

setupHelp();