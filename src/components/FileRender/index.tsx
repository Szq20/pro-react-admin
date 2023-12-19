/**
 * @file Foo组件
 * @author jiangting01@baidu.com
 */

import React from 'react';
import classnames from 'classnames';
import {BaseProps} from '@typings';

import DocxRender from './docxRender';
import PdfRender from './pdfRender';
import ErrStatus from './errStatus';
import styles from './index.module.less';
import TxtRender from './txtRender';

export interface FileRenderProps extends BaseProps {
    type: string;
    file: Blob | undefined;
}

const COMPONENT_NAME = 'file-render';

const FileRender: React.FC<FileRenderProps> = props => {
    const {
        className,
        style,
        type,
        file
    } = props;

    console.log(file, 'FileRender-file');
    console.log(type, 'FileRender-type');



    const getFileRenderComponent = type => {
        if (!file) {
            return <ErrStatus des={'请上传文件预览'} />;
        }
        switch (type) {
            case 'docx':
                return <DocxRender file={file} />;
            case 'pdf':
                return <PdfRender file={file} />;
            case 'txt':
                return <TxtRender file={file} />;
            default:
                return <ErrStatus />;
        }
    };


    return (
        <div className={classnames(styles[COMPONENT_NAME], className)} style={style}>
            {getFileRenderComponent(type)}
        </div>
    );
};

export default FileRender;
