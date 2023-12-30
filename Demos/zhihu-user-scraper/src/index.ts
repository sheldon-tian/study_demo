const add = (x: number, y: number) => {
    return x + y;
}

(window as any).add = add;

export default add;

