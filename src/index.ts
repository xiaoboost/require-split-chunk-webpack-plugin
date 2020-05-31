import Webpack from 'webpack';
import path from 'path';

import { ConcatSource, CachedSource } from 'webpack-sources';

type Chunk = Webpack.compilation.Chunk;
type Target = Webpack.Configuration['target'];
type Assets = Record<string, CachedSource | ConcatSource>;

module.exports = class OptimizationPathPlugin {
    /** 名称 */
    private name = 'optimization-path-plugin';
    /** 公共路径 */
    private publicPath = '';

    /** 更新入口文件 */
    requireChunkInEntry(cached: CachedSource | ConcatSource, requires: string[]): ConcatSource {
        const content = new ConcatSource(cached);

        debugger;
        return content;
        
        // new ConcatSource(
        //     '\/** Sweet Banner **\/',
        //     '\n\n',
        //     // nodes.setSourceContent,
        // );
    }

    /** 获取 chunk 列表中的 js 文件 */
    getScriptFile(chunks: Chunk[]) {
        return chunks
            .reduce((files, chunk) => files.concat(chunk.files), [] as string[])
            .filter((file) => path.extname(file) === '.js');
    }

    /** 完成编译后的同步钩子 */
    afterCompilation(compilation: Webpack.compilation.Compilation) {
        // 优化每个资源时触发
        compilation.hooks.optimizeChunkAssets.tap(this.name, (chunks) => {
            const assets: Assets = compilation.assets;
            const entryFiles = this.getScriptFile(chunks.filter((chunk) => chunk.hasEntryModule()));
            const splitFiles = this.getScriptFile(chunks.filter((chunk) => !chunk.hasEntryModule()));

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
        
        // 读取编译配置
        this.publicPath = compiler.options.output?.publicPath || '';
        // 完成编译时触发
        compiler.hooks.compilation.tap(this.name, this.afterCompilation.bind(this));
    }
};
