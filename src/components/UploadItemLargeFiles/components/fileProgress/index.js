/**
 * @file  index
 * @author shenzhiqiang01
 * @date 2022-09-16
 */

import React, { useState, useEffect } from 'react'
import { Col, Progress } from 'acud'
import './index.less'

const FileProgress = ({ item, speed, className }) => (
  <Col span={24} className={`${className}-render-progress`}>
    <div className={`${className}-render-progress-info`}>
      <div className={`${className}-render-progress-info-num`}>{item.byt}</div>
      {item.status === 'UPLOADING' ? <div className={`${className}-render-progress-info-speed`}>- {speed}</div> : ''}
    </div>
    {item.status === 'UPLOADING' ? <Progress percent={item.progress} strokeWidth={2} showInfo={false} /> : ''}
    {item.status === 'ERROR' ? (
      <Progress percent={item.progress} strokeWidth={2} showInfo={false} strokeColor={'#F33E3E'} />
    ) : (
      ''
    )}
  </Col>
)

export default FileProgress
