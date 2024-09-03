/**
 * @file: 工具文件
 * @author: gaopengyue(gaopengyue@baidu.com)
 */

enum LanguageTypeEnum {
    HTML = 'html',
    JSON = 'json',
    YAML = 'yaml',
    CSS = 'css',
    LESS = 'less',
    SCSS = 'scss',
    RAZOR = 'razor',
    HANDLEBARS = 'handlebars',
    TYPESCRIPT = 'typescript',
    JAVASCRIPT = 'javascript',
    EDITOR = 'editorWorkerService',
}

// 代码编辑器worker
export const handleRegistMonacoWorker = () => {
    window.MonacoEnvironment = {
        getWorker(moduleId, label) {
            switch (label) {
                case LanguageTypeEnum.EDITOR:
                    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
                case LanguageTypeEnum.CSS:
                case LanguageTypeEnum.LESS:
                case LanguageTypeEnum.SCSS:
                    return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url));
                case LanguageTypeEnum.HANDLEBARS:
                case LanguageTypeEnum.HTML:
                case LanguageTypeEnum.RAZOR:
                    return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url));
                case LanguageTypeEnum.JSON:
                    return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
                case LanguageTypeEnum.JAVASCRIPT:
                case LanguageTypeEnum.TYPESCRIPT:
                    return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url));
                case LanguageTypeEnum.YAML:
                    return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
                default:
                    throw new Error(`未知类型 ${label}`);
            }
        }
    };
};
