// 1 - current version
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

const Didact = {
    createElement,
};

const element = Didact.createElement(
    'div',
    { id: 'foo' },
    Didact.createElement('a', null, 'bar'),
    Didact.createElement('b'),
);

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

// 2 - 构建自己的 render
// ```javascript
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

const render = (element, container) => {
    const dom = element.type === 'TEXT_ELEMENT'
        ? document.createTextElement('')
        : document.createElement(element.type);

    const isProperty = key => key !== 'children';
    Object.keys(element.props)
        .filter(key => isProperty(key))
        .forEach(key => {
            dom[key] = element.props[key];
        });

    element.props.children.forEach(child => {
        render(child, dom);
    });

    container.appendChild(dom);
};

const Didact = {
    createElement,
    render,
};

// babel 做的事
// const element = Didact.createElement(
//     'div',
//     { id: 'foo' },
//     Didact.createElement('a', null, 'bar'),
//     Didact.createElement('b'),
// );

/** @jsx Didact.createElement */
const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
);
const container = document.getElementById('root');
Didact.render(element, container);
// ```
