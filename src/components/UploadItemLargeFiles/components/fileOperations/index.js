/**
 * @file  index
 * @author shenzhiqiang01
 * @date 2022-09-16
 */

import React, {useState, useEffect} from 'react';
import {Col} from 'acud';
import {OutlinedButtonRefresh, OutlinedClose} from 'acud-icon';
import {abortPart} from '../../services';
import './index.less';
import {formatFileSize} from '../../templateData';

const FileOperations = ({item, uploader, className, initWebuploader, setFileList}) => (
    <Col span={3}>
        <div className={`${className}-operations`}>
            {item.status === 'ERROR' ? (
                <OutlinedButtonRefresh
                    onClick={() => {
                        setFileList((fileList) =>
                            fileList.map((file) => {
                                if (file.fileId === item.fileId) {
                                    file.loading = true;
                                    file.fileId = item.fileId;
                                    file.progress = 0;
                                    file.byt = `0kb/${formatFileSize(item.file.size)}`;
                                    file.status = 'START';
                                    file.statusName = '待开始';
                                }
                                return file;
                            })
                        );
                        uploader.upload(item.file);
                    }}
                />
            ) : (
                ''
            )}
            <OutlinedClose
                onClick={() => {
                    setFileList((fileList) => fileList.filter((file) => file.fileId !== item.fileId));
                    if (item.fileId !== '-1') {
                        // 编辑回显状态码
                        uploader.removeFile(item.file, true);
                        const files = uploader.getFiles();
                        const upFile = files.find((file) => {
                            if (file.id === item.fileId) {
                                return file;
                            }
                        });
                        upFile.status = 'CANCELLED'; // 取消态无法init
                    }
                    if (item.isInit === 'FinishInit' && item.status !== 'COMPLETED') {
                        // 完成init，并且在调用合并分片之间才能调用abortPart
                        item.file.md5
              && abortPart({
                  fileMD5: item.file.md5
              });
                    }
                }}
            />
        </div>
    </Col>
);

export default FileOperations;
