/**
 * title: 基本使用
 * description: 通过配置 schema 实现 json 格式的校验。
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import CodeEditor from '@components/Editor/index';
// import type {CodeEditorRef} from '@baidu/aibc/es/code-editor';

import {handleRegistMonacoWorker} from './utils';
import {DEFAULT_CODE, DEFAULT_SCHEMAS} from './constants';

export default () => {
    const [code, setCode] = useState(DEFAULT_CODE);
    const ref = useRef<any>(null);

    const handleChange = useCallback(
        value => {
            setCode(value);
        },
        []
    );

    const handleError = useCallback(
        error => {
            console.log('error', error);
        },
        []
    );

    useEffect(
        () => {
            // 格式化代码
            ref.current?.formatCode();
        },
        []
    );

    return (
        <div style={{height: 200}}>
            <CodeEditor
                ref={ref}
                theme="vs"
                language="json"
                code={code}
                schemas={DEFAULT_SCHEMAS}
                onChange={handleChange}
                onError={handleError}
                onRegistMonacoWorker={handleRegistMonacoWorker}
            />
        </div>
    );
};
