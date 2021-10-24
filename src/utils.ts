function findSomethingStart(isSomething: (code: string) => boolean) {
    return function findSomethingStartInner(source: string, offset: number) {
        for (; offset >= 0; offset--) {
            if (isSomething(source[offset])) {
                break;
            }
        }

        return offset;
    };
}

function findSomethingEnd(isSomething: (code: string) => boolean) {
    return function findSomethingEndInner(source: string, offset: number) {
        for (; offset < source.length; offset++) {
            if (isSomething(source[offset])) {
                break;
            }
        }

        return offset;
    };
}

const isNewLine = (char: string) => char === '\n' || char === '\r';

/** 以输入下标为起点向左,，输出第一个换行符的下标 */
export const findNewLineStart = findSomethingStart(isNewLine);
/** 以输入下标为起点向右,，输出第一个换行符的下标 */
export const findNewLineEnd = findSomethingEnd(isNewLine);

/** webpack 启动部分左侧装饰性注释 */
const codeLeftComment = '/******/  ';

/** 装饰代码 */
export function normalizeCode(code: string) {
    const newCode = code
        .trim()
        .split(/[\n\r\f]/)
        .map((line) => `${codeLeftComment}${line}`)
        .join('\n');

    return `\n${newCode}\n`;
}
