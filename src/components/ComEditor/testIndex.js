import React, {useRef} from 'react';
import './index.less';
import MonacoEditor from '@monaco-editor/react';

const Index = (props) => {
    const {
        className,
        value, // 手动输入，获取文件读取输入内容
        onChange,
        width = 752,
        height = 76,
        language = 'yaml',
        minHeight = 76,
        maxHeight = 300,
        schemaKey = 'requestParameters',
        // editorRef = null,
        hasMarkCallBack, // 是否有代码标记（错误、警告）回调函数
        ...editorOptions
    } = props;
    const editorRef = useRef();
    const transSug = (items) => {
        const newSug = [...items, 'and', 'or', '(', ')'].map((item) => ({
            label: item, // 显示的label
            detail: !items.includes(item) ? '符号' : '字段', // 描述
            insertText: item, // 选择后插入的value
            icon: items.includes(item)
        }));
        return newSug;
    };
    const editorDidMount = (language) => (editor, monaco) => {
        const suggestions = transSug(['代码提示']);
        if (suggestions.length) {
            editorRef.current = monaco.languages.registerCompletionItemProvider(language, {
                provideCompletionItems() {
                    return {
                        suggestions: suggestions.map((item) => ({
                            ...item,
                            kind: item.icon
                                ? monaco.languages.CompletionItemKind.Variable // 图标
                                : null
                        }))
                    };
                },
                triggerCharacters: [' '] // 触发代码提示的关键字，ps：可以有多个
            });
        }
    };
    return (
        <div>
            <MonacoEditor
                width="500px"
                theme="vs-dark"
                height="300px"
                language="plaintext" // 注意此处language必须与 monaco 注册的代码提示里的保持一致
                onMount={editorDidMount(language)}
            />
        </div>
    );
};

export default Index;
