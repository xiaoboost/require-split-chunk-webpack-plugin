import Webpack from 'webpack';
import path from 'path';

import * as utils from './utils';

type Chunk = Webpack.Chunk;
type Target = Webpack.Configuration['target'];

/** 模块变量名称 */
const moduleVarName = '__webpack_modules__';
/** 替换语句 */
const replaceStatement = `__webpack_require__.m = ${moduleVarName}`;

interface Options {
    /**
     * 引用代码的公共路径
     *  - 此值为空，且`webpack.output.publicPath`是字符串，将会使用后者的值
     */
    publicPath?: string;
}

export class RequireSplitChunkPlugin {
    /** 名称 */
    private name = 'require-split-chunk-plugin';
    /** 公共路径 */
    private publicPath?: string;

    constructor(opt: Options = {}) {
        this.publicPath = opt.publicPath ?? '';
    }

    /** 生成代码 */
    generatedCode(requires: string[]) {
        const requireList = requires.map((item) => {
            return path.join(this.publicPath ?? '', item).replace(/[\\/]+/g, '/');
        });
        const StatementList = requireList.map((item) => {
            return `    require(\'${item}\').modules,`;
        });

        return (
            '\n// The modules merge function\n' +
            'function __webpack_modules_merge(modules) {\n' +
            '    var i = 0, merged = {}, chunkModule;\n\n' +
            '    for (; i < modules.length; i++) {\n' +
            '        chunkModule = modules[i];\n\n' +
            '        if (!chunkModule) {\n' +
            '            continue;\n' +
            '        }\n\n' +
            '        for (var key in chunkModule) {\n' +
            '            if (chunkModule.hasOwnProperty(key)) {\n' +
            '                merged[key] = chunkModule[key];\n' +
            '            }\n' +
            '        }\n' +
            '    }\n\n' +
            '    return merged;\n' +
            '}\n\n' +
            '// expose the modules object (__webpack_modules__)\n' +
            `${moduleVarName} = __webpack_require__.m = __webpack_modules_merge([\n` +
            `    ${moduleVarName},\n` +
            `${StatementList.join('\n')}\n` +
            ']);\n'
        );
    }

    /** 更新入口文件 */
    requireChunkInEntry(cached: Webpack.sources.Source, requires: string[]): Webpack.sources.ConcatSource {
        const origin = cached.source().toString();
        const replacement = new Webpack.sources.ReplaceSource(cached);
        const originExposeModuleStatementStart = origin.indexOf(replaceStatement);

        // 未找到，则直接退出
        if (originExposeModuleStatementStart < 0) {
            return new Webpack.sources.ConcatSource(cached);
        }

        // 模块赋值语句的起点和终点
        const exposeStart = utils.findNewLineStart(origin, originExposeModuleStatementStart);
        const exposeEnd = utils.findNewLineEnd(origin, originExposeModuleStatementStart);
        // 模块赋值语句的上一行
        const exposeLastLine = utils.findNewLineStart(origin, exposeStart - 1);

        // 替换代码
        replacement.replace(
            exposeLastLine,
            exposeEnd,
            utils.normalizeCode(this.generatedCode(requires)),
        );

        return new Webpack.sources.ConcatSource(replacement);
    }

    /** 获取 chunk 列表中的 js 文件 */
    getScriptFile(chunks: Chunk[]) {
        return chunks
            .reduce((files, chunk) => files.concat(Array.from(chunk.files)), [] as string[])
            .filter((file) => path.extname(file) === '.js');
    }

    /** 完成编译后的同步钩子 */
    afterCompilation(compilation: Webpack.Compilation) {
        // 优化资源时触发
        compilation.hooks.optimizeChunkAssets.tap(this.name, (chunks) => {
            const assets = compilation.assets;
            const entryFiles = this.getScriptFile(Array.from(chunks).filter((chunk) => chunk.hasEntryModule()));
            const splitFiles = this.getScriptFile(Array.from(chunks).filter((chunk) => !chunk.hasEntryModule()));

            entryFiles.forEach((file) => {
                assets[file] = this.requireChunkInEntry(assets[file], splitFiles);
            });
        });
    }

    /** 是否启用 */
    checkAllow(compiler: Webpack.Compiler) {
        const { target } = compiler.options;
        const allows: Target[] = ['node', 'electron-main', 'electron-renderer', 'electron-preload', 'node-webkit'];

        return allows.includes(target);
    }

    apply(compiler: Webpack.Compiler) {
        // 不启用，则跳过
        if (!this.checkAllow(compiler)) {
            return;
        }

        const { output } = compiler.options;

        // 读取编译配置
        if (!this.publicPath) {
            if (typeof output.publicPath === 'string') {
                this.publicPath = output.publicPath || output?.path || '';
            }
        }

        // 完成编译时触发
        compiler.hooks.compilation.tap(this.name, this.afterCompilation.bind(this));
    }
}
