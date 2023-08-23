// demo 利用闭包实现字体大小切换
const adjustFontSize = (fontSize) => {
    return () => {
        console.log(fontSize);
        document.body.style.fontSize = fontSize + 'px';
    };
}

const size12 = adjustFontSize(12);
const size14 = adjustFontSize(14);
const size16 = adjustFontSize(16);

document.getElementById('size-12').onclick = size12;
document.getElementById('size-14').onclick = size14;
document.getElementById('size-16').onclick = size16;
