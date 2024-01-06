/**
 * @file src/pages/demoTest/index.jsx index
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
 */

import React, {useState, useEffect} from 'react';
import FixTabPanel from '@stateless/FixTabPanel';
import {Upload, Button, Radio} from 'antd';
import {FileRender} from '@components';

// @ts-ignore
import wordDocx from './testFile/LLM应用架构v1.0-概要设计v5.docx';
// @ts-ignore
import wordDoc from './testFile/Java-测试开发能力doc建设.doc';
// @ts-ignore
import pdfTest from './testFile/test.pdf';
// @ts-ignore
import txtTest from './testFile/莫言文集(全)(上)的副本.txt';


const DemoTest: React.FC = () => {

    const [file, setFile] = useState<Blob>();
    const [testFile, setTestFile] = useState<URL>(wordDocx);
    const [fileType, setFileType] = useState<string>('docx');

    useEffect(() => {
        fetch(testFile) // 替换为您的 PDF 文件路径
            .then(response => response.blob())
            .then(blob => {
                setFile(blob);
            })
            .catch(error => {
                console.error('Error fetching the PDF file:', error);
            });
    }, [testFile]);

    useEffect(() => {
        switch (fileType) {
            case 'pdf':
                setTestFile(pdfTest);
                break;
            case 'docx':
                setTestFile(wordDocx);
                break;
            case 'txt':
                setTestFile(txtTest);
                break;
            default:
                setTestFile(wordDoc);
                break;
        }
    }, [fileType]);


    const props = {
        onChange({fileList}) {
            if (!fileList.length) {
                setFile(undefined);
                return;
            }
            const file = fileList[0];
            const blob = new Blob([file.originFileObj], {type: file.type});
            setFile(blob);
            // setTestFile(URL.createObjectURL(blob));
        }
    };

    return (
        <FixTabPanel>
            <div>
                <Radio.Group
                    defaultValue={fileType}
                    onChange={(event) => {
                        const target = event.target;
                        setFileType(target.value);
                    }}
                >
                    <Radio.Button value='pdf'>PDF</Radio.Button>
                    <Radio.Button value='docx'>DOCX</Radio.Button>
                    <Radio.Button value='txt'>TXT</Radio.Button>
                </Radio.Group>
                <Upload {...props}>
                    <Button>上传</Button>
                </Upload>
            </div>
            <FileRender
                type={fileType}
                file={file}
            />
        </FixTabPanel>
    );
};

export default DemoTest;
