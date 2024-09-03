/**
 * @file: 代码编辑器
 * @author: gaopengyue(gaopengyue@baidu.com)
 */

import {useEffect, useRef, useImperativeHandle, forwardRef, useCallback} from 'react';
import type {ForwardedRef} from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import MonacoEditor from 'react-monaco-editor';
import yaml from 'js-yaml';

import {MONACO_STYLES, DEFAULT_ERROR_MESSAGE} from './constants';
import {CodeEditorProps, LanguageTypeEnum, LanguageType, CodeEditorRef, ThemeEnum, ThemeType} from './types';
import {configMonacoYaml, configMonacoJson, createOpenApiValidator} from './utils';

function CodeEditor(props: CodeEditorProps, ref: ForwardedRef<CodeEditorRef>) {
    const {
        width = '100%',
        code,
        theme = ThemeEnum.LIGHT,
        language = LanguageTypeEnum.JSON,
        schemas,
        monacoEditorOptions,
        isOpenApi,
        isRealTimeValidate = true,
        onChange,
        onError,
        onRegistMonacoWorker
    } = props;

    const monacoRef = useRef<typeof monaco | null>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const validateTimer = useRef<any>(null);

    // 组件加载完成回调
    const editorDidMount = useCallback(
        (editor, currMonaco) => {
            editorRef.current = editor;
            monacoRef.current = currMonaco;
        },
        []
    );

    // 格式化代码
    const formatCode = useCallback(
        (lang?: LanguageType) => {
            if (lang) {
                const model = editorRef.current?.getModel() as monaco.editor.ITextModel;
                monacoRef?.current?.editor.setModelLanguage(model, lang);
            }

            setTimeout(
                () => {
                    editorRef?.current?.getAction?.('editor.action.formatDocument')?.run();
                },
                lang ? 100 : 0
            );

            return editorRef.current?.getValue();
        },
        []
    );

    // 获取 model 和 markers
    const getModelAndMarkers = useCallback(
        () => {
            const model = editorRef.current?.getModel() as string | monaco.editor.ITextModel | any;
            const markers = monacoRef.current?.editor?.getModelMarkers?.({owner: model});
            return {
                model,
                markers
            };
        },
        []
    );

    // 设置代码行、列错误信息
    const setMarks = useCallback(
        customMarkers => {
            const {model} = getModelAndMarkers() as {model: monaco.editor.ITextModel};
            monacoRef.current?.editor.setModelMarkers(model, language, [...customMarkers]);
        },
        [language, getModelAndMarkers]
    );

    // openaip：设置代码行、列错误信息
    const setOpenApiMarks = useCallback(
        errors => {
            if (!errors?.length) {
                return setMarks([]);
            }

            const item = errors.filter(el => el?.mark)[0];
            const {reason, mark} = item || {};
            const {line, column} = mark || {};
            if (!line && line !== 0) {
                return setMarks([]);
            }

            setMarks([
                {
                    startLineNumber: line,
                    endLineNumber: line,
                    startColumn: column,
                    endColumn: column,
                    severity: 8,
                    message: reason
                }
            ]);
        },
        [setMarks]
    );

    // 通过onError回调发送错误信息
    const sendErrors = useCallback(
        (errors, result: boolean = false) => {
            onError?.({
                result,
                errors
            });

            if (isOpenApi) {
                setOpenApiMarks(errors);
            }
            return errors;
        },
        [isOpenApi, onError, setOpenApiMarks]
    );

    // 校验 open api
    const validateOpenApi = useCallback(
        () => {
            // 获取code
            const codeVal = editorRef.current?.getValue();

            // code为空
            if (!codeVal) {
                return sendErrors([], true);
            }

            let jsonCode: any = null;

            try {
                jsonCode = language === LanguageTypeEnum.JSON ? codeVal : yaml.load(codeVal);
            } catch (error) {
                return sendErrors([DEFAULT_ERROR_MESSAGE, error]);
            }

            try {
                // 获取openapi版本，并根据版本加载
                const openApiVersion = jsonCode?.openapi || jsonCode?.swagger;
                // 创建 open api 校验器
                const openApiValidator = createOpenApiValidator(openApiVersion);
                const validateResult = openApiValidator(jsonCode);
                return sendErrors(openApiValidator.errors, validateResult);
            } catch (error) {
                return sendErrors([DEFAULT_ERROR_MESSAGE, error]);
            }
        },
        [language, sendErrors]
    );

    // 校验代码
    const validateCode = useCallback(
        () => {
            try {
                const {markers} = getModelAndMarkers();
                const errors = markers?.filter(
                    item => item.severity === monacoRef.current?.MarkerSeverity.Error && item.owner === language
                );

                return sendErrors(errors, errors?.length === 0);
            } catch (error) {
                return sendErrors([DEFAULT_ERROR_MESSAGE, error]);
            }
        },
        [language, sendErrors, getModelAndMarkers]
    );

    // 触发校验，返回校验结果
    const callValidateCode = useCallback(
        () => {
            return new Promise(resolve => {
                // 校验 open api 格式
                if (isOpenApi) {
                    const errors = validateOpenApi();
                    resolve(errors);
                    return;
                }

                // 校验其他代码格式
                validateTimer.current && clearTimeout(validateTimer.current);
                validateTimer.current = setTimeout(() => {
                    const errors = validateCode();
                    resolve(errors);
                }, 500);
            });
        },
        [validateOpenApi, validateCode, isOpenApi]
    );

    // 编辑器内容变化事件
    const handleChange = useCallback(
        value => {
            onChange?.(value);

            // 校验代码
            if (isRealTimeValidate) {
                callValidateCode();
            }
        },
        [isRealTimeValidate, callValidateCode, onChange]
    );

    // set ref handle
    useImperativeHandle(
        ref,
        () => ({
            setMarks,
            formatCode,
            callValidateCode
        })
    );

    useEffect(
        () => {
            if (editorRef.current && monacoRef.current) {
                if (language === LanguageTypeEnum.YAML) {
                    configMonacoYaml(monacoRef.current, schemas);
                } else if (language === LanguageTypeEnum.JSON) {
                    configMonacoJson(monacoRef.current, schemas);
                }
            }
        },
        [language, schemas, configMonacoYaml, configMonacoJson]
    );

    useEffect(
        () => {
            // 由于webpack和vite对worker的打包方式不同，无法同时兼容两种打包方式，所以注册worker的方法改为在使用时传入
            typeof onRegistMonacoWorker === 'function' && onRegistMonacoWorker();
        },
        [onRegistMonacoWorker]
    );

    useEffect(
        () => {
            return () => {
                editorRef.current?.dispose();
                monacoRef.current?.editor?.getModels()?.forEach(model => model?.dispose());
            };
        },
        []
    );

    return (
        <>
            <MonacoEditor
                theme={theme}
                width={width}
                language={language}
                value={code}
                options={{
                    tabSize: 2,
                    automaticLayout: true,
                    overviewRulerBorder: false,
                    lineNumbersMinChars: 2,
                    lineDecorationsWidth: 1,
                    scrollBeyondLastLine: false,
                    contextmenu: false,
                    minimap: {
                        enabled: false
                    },
                    ...monacoEditorOptions
                }}
                editorDidMount={editorDidMount}
                onChange={handleChange}
            />
            <style>{MONACO_STYLES}</style>
        </>
    );
}

export default forwardRef<CodeEditorRef, CodeEditorProps>(CodeEditor);

export type {CodeEditorProps, CodeEditorRef, LanguageType, ThemeType};
