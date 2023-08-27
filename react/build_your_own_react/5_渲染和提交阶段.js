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

const createDom = (fiber) => {
    const dom = fiber.type === 'TEXT_ELEMENT'
        ? document.createTextElement('')
        : document.createElement(fiber.type);

    const isProperty = key => key !== 'children';
    Object.keys(fiber.props)
        .filter(key => isProperty(key))
        .forEach(key => {
            dom[key] = fiber.props[key];
        });

    return dom;
};

const render = (element, container) => {
    // TODO set next unit of work
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
    };
    nextUnitOfWork = wipRoot;
};

let nextUnitOfWork = null;
let wipRoot = null;

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

function commitRoot() {
    // TODO add nodes to dom
    commitWork(wipRoot.child);
    wipRoot = null;
}

function commitWork() {
    if (!fiber) {
        return;
    }

    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function performUnitOfWork(fiber) {
    // TODO add dom node
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }

    // TODO create new fiber
    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null;

    while (index < elements.length) {
        const element = elements[index];

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null,
        };

        if (index === 0) {
            fiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
    // TODO return next unit of work
    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (fiber.sibling) {
            return nextFiber.sibling;
        }

        nextFiber = nextFiber.parent;
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
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
