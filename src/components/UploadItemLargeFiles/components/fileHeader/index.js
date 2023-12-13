/**
 * @file  index
 * @author shenzhiqiang01
 * @date 2022-09-16
 */

import React, {useState, useEffect} from 'react';
import {Col} from 'acud';
import {OutlinedLoading, OutlinedButtonRefresh} from 'acud-icon';
import filePng from '@assets/images/filePng2x.png';
import fileError from '@assets/images/file2xError.png';
import './index.less';
import {getPrefix} from '@utils';

const FileHeader = ({item, className}) => (
    <Col
        span={21}
        className={`${className}-header`}
        onClick={() => {
            if (item.fileState === 'echo') {
                const aEl = document.createElement('a');
                aEl.href = item.fileUrl;
                aEl.target = '_blank';
                aEl.rel = 'nofollow noreferrer';
                aEl.click();
            }
        }}
    >
        {item.loading ? <OutlinedButtonRefresh width={15} animation="spin" /> : ''}
        <img className={`${className}-header-icon`} src={item.status === 'ERROR' ? fileError : filePng} />
        <div className={`${className}-header-name`}>
            {item.fileState === 'echo' ? <a href={item.fileUrl}>{item.file.name}</a> : item.file.name}
        </div>
    </Col>
);

export default FileHeader;
