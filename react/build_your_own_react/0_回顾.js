// 1 - react code
```javascript
const element = <h1 title="foo">Hello</h1>;
const container = document.getElementById('root');
ReactDOM.render(element, container);
```

// 2 - 将 jsx 转换为 js
// 2-1 将标签内的代码替换为对 createElement 的调用，并传递标签名称、道具和子元素作为参数。
```javascript
const element = React.createElement(
    'h1',
    {title: 'foo'},
    'Hello',
});
const container = document.getElementById('root');
ReactDOM.render(element, container);
```

// 2-2 不使用 react 替换上述 react code
```javascript
const element = {
    type: 'h1',
    props: {
        title: 'foo',
    },
    children: 'Hello',
};

const container = document.getElementById('root');

const node = document.createElement(element.type);
node.title = 'foo';

const textNode = document.createTextNode('');
textNode.nodeValue = element.children;

node.appendChild(textNode);
container.appendChild(node);
```




const createElement = (type, props, children) => {
    const element = document.createElement(type);
    props.keys().forEach(key => {
        element[key] = props[key];
    });

};



