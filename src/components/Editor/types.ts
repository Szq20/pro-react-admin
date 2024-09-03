/**
 * @file: 类型文件
 * @author: gaopengyue(gaopengyue@baidu.com)
 */
import * as monacoEditor from 'monaco-editor/esm/vs/editor/editor.api';

// 主题
export enum ThemeEnum {
    LIGHT = 'vs',
    DARK = 'vs-dark',
    HC_LIGHT = 'hc-light',
    HC_BLACK = 'hc-black',
}

// 语言
export enum LanguageTypeEnum {
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

// 语言type
export type LanguageType = `${LanguageTypeEnum}`;

// 主题type
export type ThemeType = `${ThemeEnum}`;

export interface ErrorParams {
    result: boolean;
    errors?: any[];
}
export interface CodeEditorProps {
    code: string;
    language: LanguageType;
    theme?: ThemeType;
    width?: number | string;
    isRealTimeValidate?: boolean; // 是否实时校验
    schemas?: any[];
    monacoEditorOptions?: monacoEditor.editor.IStandaloneEditorConstructionOptions;
    isOpenApi?: boolean;
    onChange?: (value: string) => void;
    onError?: (errorParams: ErrorParams) => void;
    onRegistMonacoWorker?: () => void;
}

export interface CodeEditorRef {
    setMarks: (marks: monacoEditor.editor.IMarkerData[]) => void;
    formatCode: (lang?: LanguageType) => void;
    callValidateCode: () => any;
}
