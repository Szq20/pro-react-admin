/**
* @file  txt
* @author shenzhiqiang01
* @date 2023-08-03
*/

import React, {useRef, useState, useEffect} from 'react';
import {Input, Spin} from 'antd';
// import style from './index.module.less';
import {BaseProps} from '@typings';

import jschardet from 'jschardet';

export interface docxProps extends BaseProps {
    file: Blob;
}


const TxtRender = (props: docxProps) => {
    const {file} = props;

    const [txtVal, setTxt] = useState<string>();
    const [loading, setLoading] = useState(true);

    // 将Blob流转为字符串
    const blobToString = async (blob, charset) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            // console.log(charset, 'charset');
            reader.readAsText(blob, charset);
        });
    };

    const getCharset = async (blob: Blob) => {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) { // 获取文件真实编码
                let base64Str: string = reader.result as string;
                // console.log(base64Str, 'base64Str');
                let str = atob(base64Str?.split(';base64,')[1]);
                // // console.log(str, 'str---');

                let encoding = jschardet.detect(str);
                // console.log(encoding, 'encoding---');

                let charset = encoding.encoding;
                // console.log(charset, 'charset---');
                if (charset === 'window-1252') {
                    charset = 'ANSI';
                }
                // console.log(charset, 'charset---');
                resolve('window-1252');
            };
        });

    };

    const renderBlob = async file => {
        let charset = await getCharset(file);
        blobToString(file, charset)
            .then((text) => {
                setTxt(text as string);
                setLoading(false);
            })
            .catch(error => {
                console.error('转换失败:', error);
            });

        // console.log(file, 'response');
    };
    useEffect(() => {
        if (file) {
            setLoading(true);
            renderBlob(file);
        }
    }, [file]);


    return (
        <div className={'txt-render'}>
            {/* {loading ? <Spin /> : ''} */}
            <Input.TextArea
                value={txtVal}
                autoSize
                bordered={false}
                allowClear={false}
                style={{
                    color: '#151B26',
                    backgroundColor: '#fff',
                    border: 'none'
                }}
            />
        </div>
    );
};


export default TxtRender;
