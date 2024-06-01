/* eslint-disable max-len */
/*
 * @author shenzhiqiang01
 * @date 2023-10-20
 * @Description 代码编辑器 json yaml
 *   <ComEditor
                    schemaKey={schemaKey}
                    value={value}
                    editorRef={editorRef}
                    language={defLange}
                    readOnly={readOnly}
                    onChange={onChange ? onChange : custOnchange}
                    editorID={editorID}
                    defLangeType={defLangeType}
                />
*/
import {useState, useRef, useCallback, useEffect} from 'react';
import classnames from 'classnames';
import {OutlinedMenuFold, OutlinedMenuUnfold} from 'acud-icon';

import {Button, Radio} from 'acud';

import {debounce} from 'lodash';

import * as monaco from 'monaco-editor';
// 使用
// 注意不要使用esm方式引入，webpack会提前打包，导致语言包设置失败，使用动态import
// const monaco = require('monaco-editor/esm/vs/editor/editor.api');

import MonacoEditor from 'react-monaco-editor';

import {configureMonacoYaml} from 'monaco-yaml';

import {API_COMMON_PREFIX} from '@constants/global';
import {getPrefix, showError} from '../../../utils';

import {defaultSchema, defaultJsonSchema, fromatCode, jsonToYamlFormat, yamlToJsonFormat} from './utils';

import './index.less';

const PREFIX = `${getPrefix()}-com-editor`;

const getMarks = (editor, model, hasMarkCallBack, uri) => {
    // 获取编辑器的模型 // 获取模型的所有标记
    const ownerModel = editor?.getModel() || model;
    const markers = monaco.editor.getModelMarkers({owner: ownerModel});
    const realMarks = markers.filter((item) => item?.resource?._formatted === uri?._formatted);
    hasMarkCallBack && hasMarkCallBack(realMarks);
};

function ComEditor(props) {
    const {
        className, // 组件的CSS类名
        value, // 手动输入，获取文件读取输入内容
        onChange, // 发生改变时的回调函数
        width = 752, // 编辑器区域的宽度，如果没有指定，则为752像素
        language = 'json', // 编辑器区域的文本语言 json-yaml，默认为'json'
        minHeight = 76, // 编辑器区域的最小高度，默认为76像素
        maxHeight = 300, // 编辑区域的最大高度，默认为300像素
        schemaKey = 'requestParameters', // 编辑器区域的schema key，默认为'requestParameters'
        editorID = null, // 编辑器的ID，如果没有指定，则为null
        readOnly, // 编辑器是否只读
        hasMarkCallBack, // 是否有代码标记（错误、警告）回调函数
        ...editorOptions // 更多的编辑器选项
    } = props;

    const {origin} = window.location;
    // eslint-disable-next-line max-len
    const getSchemaUri = `${origin}${API_COMMON_PREFIX}/api/getSchema?key=${schemaKey}`; // 获取后端schema

    const cls = classnames(PREFIX, className);
    const editorRef = useRef(null); // 编辑器
    const editorContainer = useRef(null); // 编辑器容器
    const editorOperates = useRef(null); // 操作栏
    const [isInit, setInit] = useState(false);

    const [languageType, setLanguageType] = useState(language); // 语言类型 json yaml
    const [editorHeight, setEditorHeight] = useState(minHeight); // 编辑器高度
    const [model, setModel] = useState(null); // 每次编辑器实例的唯一Model
    const [yamlModel, setYamlModel] = useState(null); // 每次编辑器实例的唯一Model
    // const [jsonModel, setJsonModel] = useState(null);// 每次编辑器实例的唯一Model
    const [uri, setUri] = useState(null);
    const formattingJsonEdits = (model) => {
    // 加载YAML数据
        try {
            const text = model.getValue(); // 获取文件内容
            const forMatText = yamlToJsonFormat(text);
            forMatText && model.setValue(forMatText); // 更新编辑器内容

            // const ownerModel = editor?.getModel();
        } catch (error) {
            console.error('formattingJsonEdits', error);
        } finally {
            const markers = monaco.editor.getModelMarkers({owner: model});
            const realMarks = markers.filter((item) => item?.resource?._formatted === uri?._formatted);

            hasMarkCallBack && hasMarkCallBack(realMarks);
        }
    };

    monaco.languages.registerDocumentFormattingEditProvider('json', {
        provideDocumentFormattingEdits: (model, options, token) => {
            formattingJsonEdits(model);
            return [];
        }
    });
    useEffect(() => {
        const {editor} = editorRef.current;
        fromatCode(editor);
        // 获取编辑器的模型 // 获取模型的所有标记
        const ownerModel = editor?.getModel();
        const markers = monaco.editor.getModelMarkers({owner: ownerModel});
        const realMarks = markers.filter((item) => item?.resource?._formatted === uri?._formatted);
        hasMarkCallBack && hasMarkCallBack(realMarks);
    }, [languageType]);

    useEffect(() => {
        setLanguageType(language);
    }, [language]);

    useEffect(() => {
        try {
            /*
       * @author shenzhiqiang01
       * @date 2023-10-27
       * @Description 配置不同语言的worker
       * Monaco Editor 不支持直接在主线程中构造 Worker，
       * 它使用 Web Worker 作为分离的线程来处理语言服务。
       *  Monaco Editor 要求在 Worker 中加载语言服务，而不是直接在主线程中加载。
       */
            window.MonacoEnvironment = {
                getWorker(moduleId, label) {
                    try {
                        switch (label) {
                            case 'editorWorkerService':
                                return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
                            case 'css':
                            case 'less':
                            case 'scss':
                                return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url));
                            case 'handlebars':
                            case 'html':
                            case 'razor':
                                return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url));
                            case 'json':
                                try {
                                    return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
                                } catch (error) {
                                    // // console.log(error, 'error：：：：');
                                }

                            case 'javascript':
                            case 'typescript':
                                return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url));
                            case 'yaml':
                                return new Worker(new URL('monaco-yaml/yaml.worker', import.meta.url));
                            default:
                                throw new Error(`Unknown label ${label}`);
                        }
                    } catch (error) {
                        // // console.log(error, 'error：：：：');
                    }
                }
            };

            const {editor} = editorRef.current;
            const yamlMatch = `${editorID}.yaml`;
            // // console.log(editorID, 'editorID');
            const yamlModelUri = monaco.Uri.parse(schemaKey + yamlMatch);
            const yamlSchemas = defaultSchema(getSchemaUri, yamlMatch, schemaKey, 'yaml');
            const monacoYaml = configureMonacoYaml(monaco, {
                enableSchemaRequest: true,
                schemas: yamlSchemas,
                // format: false,
                yamlVersion: '1.1'
            });
            const yamlModel = monaco.editor.createModel(editor.getValue(), 'yaml', yamlModelUri);
            setModel(yamlModel);
            setYamlModel(yamlModel);
            editor.setModel(yamlModel);
            setUri(yamlModelUri);

            const formattingYamlEdits = (model) => {
                // 加载YAML数据
                try {
                    const text = model.getValue(); // 获取文件内容
                    const forMatText = jsonToYamlFormat(text);
                    // // console.log(model, 'model');
                    model.setValue(forMatText); // 更新编辑器内容
                    getMarks(editor, model, null, yamlModelUri);
                } catch (error) {
                    console.error('YAML解析错误:', error);
                    // // console.log(error, 'error---');
                } finally {
                    const markers = monaco.editor.getModelMarkers({owner: yamlModel});
                    const realMarks = markers.filter((item) => item?.resource?._formatted === yamlModelUri?._formatted);
                    // // console.log(markers, 'markers-yaml');
                    // // console.log(realMarks, 'realMarks-yaml');
                    hasMarkCallBack && hasMarkCallBack(realMarks);
                }
            };
            monaco.languages.registerDocumentFormattingEditProvider('yaml', {
                provideDocumentFormattingEdits: (model, options, token) => {
                    formattingYamlEdits(model);
                    return [];
                }
            });

            monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                validate: true,
                schemas: defaultJsonSchema(getSchemaUri, schemaKey, editorID, yamlMatch)
            });
            monaco.editor.setModelLanguage(yamlModel, languageType);
        } catch (error) {
            // // console.log(error, 'error：：：：');
        }
    }, [editorRef, editorID]);

    useEffect(() => {
        try {
            // 初始化注册事件
            // // console.log('初始化注册事件');

            if (editorRef.current && editorOperates?.current && model) {
                const {editor} = editorRef.current;
                const editorOperatesHeight = 42;
                const formatCodeContent = debounce((editor, editorOperatesHeight = 42, model, uri) => {
                    // 输入编辑器内容事件回调
                    let newValue = editor?.getValue();
                    newValue = newValue.trim();
                    const contentHeight = editor.getContentHeight();
                    // 获取编辑器容器
                    const container = editorContainer?.current;
                    // 根据内容高度调整容器高度
                    if (contentHeight >= minHeight) {
                        if (contentHeight >= maxHeight) {
                            container.style.height = `${maxHeight + editorOperatesHeight}px`; // 42为编辑器顶部部操作栏高度
                            setEditorHeight(maxHeight);
                        } else {
                            container.style.height = `${contentHeight + editorOperatesHeight}px`; // 42为编辑器顶部部操作栏高度
                            setEditorHeight(contentHeight);
                        }
                    }
                    if (!newValue) {
                        // 空值时收缩
                        container.style.height = `${minHeight + editorOperatesHeight}px`; // 42为编辑器顶部部操作栏高度
                        setEditorHeight(minHeight);
                    }

                    if (!newValue) {
                        // 空值为无标记
                        hasMarkCallBack && hasMarkCallBack([]);
                        return;
                    }

                    // 获取编辑器的模型 // 获取模型的所有标记
                    const ownerModel = editor?.getModel();
                    const markers = monaco.editor.getModelMarkers({owner: ownerModel});
                    const realMarks = markers.filter((item) => item?.resource?._formatted === uri?._formatted);
                    hasMarkCallBack && hasMarkCallBack(realMarks);
                }, 800);
                fromatCode(editor);
                formatCodeContent(editor, editorOperatesHeight, model, uri); // 初试掉一次
                editor.getModel()?.onDidChangeContent((props) => {
                    // 获取编辑器内容的高度 设置最小和最大高度，可以根据需要进行调整
                    formatCodeContent(editor, editorOperatesHeight, model, uri);
                });
            }
        } catch (error) {
            // // console.log(error, 'error');
        }
        return () => {
            model && model?.dispose();
        };
    }, [model]);

    const foldFn = useCallback(
        (type) => {
            const {editor} = editorRef.current;
            const editorOperatesHeight = 42; // 42为编辑器顶部部操作栏高度
            const container = editorContainer?.current;
            if (type === 'foldAll') {
                setEditorHeight(minHeight);
                container.style.height = `${minHeight + editorOperatesHeight}px`; // 42为编辑器顶部部操作栏高度
            } else {
                container.style.height = `${maxHeight + editorOperatesHeight}px`; // 42为编辑器顶部部操作栏高度
                setEditorHeight(maxHeight);
            }
            if (!editor.getValue()) {
                return;
            }
            editor.getAction(`editor.${type}`).run();
        },
        [editorRef.current, model]
    );
    const optionsLang = [
        {value: 'json', label: 'json'},
        {value: 'yaml', label: 'yaml'}
    ];
    return (
        <div className={cls} ref={editorContainer}>
            <div className={`${cls}-operates`} ref={editorOperates}>
                <div className={`${cls}-operates-left`}>
                    <div
                        className={`${cls}-operates-foldAll ${!value ? `${cls}-operates-foldAll-disabled` : ''}`}
                        onClick={() => {
                            if (!value) {
                                return;
                            }
                            foldFn('foldAll');
                        }}
                    >
                        <OutlinedMenuFold width={16} />
                        折叠
                    </div>
                    <div
                        className={`${cls}-operates-unfoldAll ${!value ? `${cls}-operates-unfoldAll-disabled` : ''}`}
                        onClick={() => {
                            if (!value) {
                                return;
                            }
                            foldFn('unfoldAll');
                        }}
                    >
                        <OutlinedMenuUnfold width={16} />
                        展开
                    </div>
                </div>
                <div className={`${cls}-operates-right`}>
                    {readOnly ? (
                        language
                    ) : (
                        <>
                            <div className={`${cls}-operates-select`}>
                                <Radio.Group
                                    defaultValue={language}
                                    value={languageType}
                                    optionType="button"
                                    options={optionsLang}
                                    size="small"
                                    onChange={(e) => {
                                        // // console.log(e, 'value');
                                        setLanguageType(e.target.value);
                                    }}
                                />
                            </div>
                            <div className={`${cls}-operates-unfoldAll`}>
                                <Button
                                    onClick={() => {
                                        const editor = editorRef.current?.editor;
                                        fromatCode(editor);
                                    }}
                                    disabled={!value}
                                >
                                    格式化
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <MonacoEditor
                width={`${width}`}
                ref={editorRef}
                id={editorID}
                height={`${editorHeight}`}
                language={languageType}
                theme="vs"
                autoIndent
                options={{
                    automaticLayout: true, // 自适应布局
                    overviewRulerBorder: false, // 不要滚动条的边框
                    lineNumbersMinChars: 2,
                    lineDecorationsWidth: 1,
                    highlightActiveIndentGuide: false,
                    cursorSmoothCaretAnimation: true,
                    readOnly,
                    contextmenu: false,
                    minimap: {
                        enabled: false
                    },
                    ...editorOptions
                }}
                onChange={onChange} // 配合form使用
                value={value}
            />
        </div>
    );
}

export default ComEditor;
