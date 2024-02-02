export const getMaxWidth = (texts: string[]) => {
    const fontFamily = getComputedStyle(document.documentElement).getPropertyValue('font-family');
    const fontSize = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('font-size'));
    const context = document.createElement('canvas').getContext('2d');
    // @ts-ignore
    context.font = fontSize + 'px ' + fontFamily;
    const sizes: number[] = [];
    texts.forEach((text) => {
        // @ts-ignore
        const metrics = context.measureText(text);
        sizes.push(metrics.width);
    });

    return Math.max(...sizes);
}