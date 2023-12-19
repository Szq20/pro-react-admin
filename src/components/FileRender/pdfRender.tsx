/**
* @file  pdf 渲染器
* @author shenzhiqiang01
* @date 2023-08-02
*/
import React, {useState, useMemo, useRef, useCallback} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import classNames from 'classnames';
import {Spin} from 'antd';
import {useMeasure} from 'react-use';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import {map} from 'lodash';
import {BaseProps} from '@typings';
import ErrStatus from './errStatus';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const COMPONENT_NAME = 'pdf-render';

export interface PdfRenderProps extends BaseProps {
    file: Blob;
}

const PdfRender = (props: PdfRenderProps) => {
    const {file, className} = props;
    const [ref, {width: wrapWidth}] = useMeasure<HTMLDivElement>();
    const [numPages, setNumPages] = useState(0);// pdf总页数;
    const currRef = useRef(null); // backtop父元素dom信息

    const onDocumentLoaded = ({numPages}) => {
        setNumPages(numPages);
    };

    const pdfRenderer = useMemo(() => {
        if (!file) {
            return <Spin />;
        }
        return (
            <div
                ref={currRef}
            >
                <Document
                    file={file}
                    onLoadSuccess={onDocumentLoaded}
                    onLoadError={() => {
                        return <ErrStatus />;
                    }}
                    loading={<Spin size="large" />}
                    renderMode="canvas"
                >
                    {
                        map(new Array(numPages).fill(Math.random()), ((item, index) => {
                            return (
                                <Page
                                    key={index}
                                    width={wrapWidth}
                                    pageNumber={index + 1}
                                    loading={<Spin size="large" />}
                                />
                            );
                        }))
                    }

                </Document>
            </div>
        );
    }, [file, numPages, wrapWidth]);

    return (
        <div ref={ref} className={classNames(COMPONENT_NAME, className)}>
            {pdfRenderer}
        </div>
    );
};


export default PdfRender;
