/**
 * @file docx 预览组件
 * @author shenzhiqiang01(shenzhiqiang01@baidu.com)
*/

import React, {useRef, useState, useEffect} from 'react';
import classNames from 'classnames';
import * as docx from 'docx-preview';
import {Spin} from 'antd';

import {BaseProps} from '@typings';
import ErrStatus from './errStatus';


const COMPONENT_NAME = 'docx-render';

export interface docxProps extends BaseProps {
    file: Blob;
}

const DocxRender = (props: docxProps) => {
    const {file, className} = props;
    const ref = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isErr, setIsErr] = useState(false);

    const renderBlob = async (file, ref) => {

        docx.renderAsync(file, ref.current, undefined)
            .then(x => {
                setLoading(false);
            }).catch(err => {
                setIsErr(true);
            }).finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        if (file && ref.current) {
            setLoading(true);
            setIsErr(false);
            renderBlob(file, ref);
        }
    }, [file, ref]);


    return (
        <div className={classNames(COMPONENT_NAME, className)}>
            {loading ? <Spin /> : null}
            {
                isErr ? <ErrStatus /> : <div id="doc" ref={ref}></div>
            }
        </div>
    );
};


export default DocxRender;
