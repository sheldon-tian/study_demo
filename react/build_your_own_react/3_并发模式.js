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

let nextUnitOfWork = null;

const workLoop = (deadLine) => {
    let shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(
            nextUnitOfWork
        );
        shouldYield = deadLine.timeRemaining() < 1;
    }

    requestIdleCallback(workLoop);
};

requestIdleCallback(workLoop);

function performUnitOfWork(nextUnitOfWork) {
    // TODO
}

const Didact = {
    createElement,
    render,
};

/** @jsx Didact.createElement */
const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
);
const container = document.getElementById('root');
Didact.render(element, container);
