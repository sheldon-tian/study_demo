// 1 - react code
```javascript
const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
);
const container = document.getElementById('root');
ReactDOM.render(element, container);
```

    // 2 - 实现自己的 createElement
    // 2-1 将 jsx 转换为 React.createElement
    ```javascript
const element = React.createElement(
    'div',
    {id: 'foo'},
    React.createElement('a', null, 'bar'),
    React.createElement('b'),
);
const container = document.getElementById('root');
ReactDOM.render(element, container);
```

    // 2-2 重新构造自己的 createElement 函数
    ```javascript
const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children,
        },
    };
};
```

    // 2-3 完善自己的 createElement 函数
    ```javascript
const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => (
                typeof child === 'object'
                ? child
                : createTextElement(child)
            )),
        },
    };
};

const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};
```

    // 2-4 重命名我们自己的 createElement
    ```javascript
const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {(
                typeof child === 'object'
                    ? child
                    : createTextElement(child)
            )),
        },
    };
};

const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};

const Didact = {
    createElement,
};

const element = Didact.createElement(
    'div',
    { id: 'foo' },
    Didact.createElement('a', null, 'bar'),
    Didact.createElement('b'),
);
```

// 2-5 babel 转译 jsx 时使用我们的自定义函数
```javascript
/** @jsx Didact.createElement */
const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
);
const container = document.getElementById('root');
ReactDOM.render(element, container);
```
