/* eslint-disable react/jsx-indent-props */
/* eslint-disable @babel/new-cap */
/**
 * @file  index
 * @author shenzhiqiang01
 * @date 2022-09-06
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'

import { OutlinedButtonUpload } from 'acud-icon'

import WebUploader from 'webuploader'
import { nanoid } from 'nanoid'
import './index.less'
import api from '@api'
import { Button, Row, toast, Tooltip } from 'acud'

import { getPrefix, showWarning, FILENAME_SIZE_LIMIT } from '@utils'
import { initMultipartUpload, uploadPart, completePart, abortPart } from './services'
import { formatFileSize } from './templateData'
import { FileHeader, FileProgress, FileOperations } from './components'

/**
 * @description
 * @param {*} props
 * @fileList {*} status : START UPLOADING UPLOADED COMPLETED ERROR CANCELLED。
 *           {*} isInit : FinishInit 完成初始化接口 完成初始化-合并分片之间调用abort接口取消分片。
 *           {*} progress : 进度值0-1
 *           {*} byt : 0kb/1M 展示
 *           {*} loading : 转圈icon
 *           {*} fileState : echo 该item，编辑回显支持下载
 * @file     {*} md5 : 文件前50MHash+SZIE+name+lastModifiedDate
 * @return {*}
 */
const WebuploaderLargeFiles = (props) => {
  const { fileNameSize = FILENAME_SIZE_LIMIT } = props
  const PREFIX = `${getPrefix()}-webuploader-large-file`

  const { value, onChange, detailData } = props // 配合FormItem使用
  const [uploader, setUploader] = useState()
  const [fileList, setFileList] = useState([])
  const [filesObj, setFilesObj] = useState({})
  const [speedObj, setspeedObj] = useState({
    startTime: 0,
    nowTime: 0,
    loadedSzie: 0,
  })
  const notUpStatus = ['UPLOADING', 'START'] // 按钮警用状态
  const SZIE = 10 * 1024 * 1024
  const FileSizeLimit = 2 * 1024 * 1024 * 1024
  const FileNumLimit = 1
  useEffect(() => {
    initWebuploader()
  }, [])
  const speed = useMemo(() => {
    const sendLoadSize =
      speedObj.loadedSzie / (parseInt(speedObj.nowTime / 1000, 10) - parseInt(speedObj.startTime / 1000, 10))
    return sendLoadSize === Infinity ? '0kb/s' : `${formatFileSize(sendLoadSize)}/s`
  }, [speedObj])
  useEffect(() => {
    if (detailData?.imageDTO?.objectName) {
      // 回显处理
      const { imageDTO } = detailData
      const detail = {
        fileList: [
          {
            file: {
              name: imageDTO.fileName,
              status: 'COMPLETED',
              file: {
                name: imageDTO.fileName,
                fileSize: imageDTO.fileSize,
              },
            },
            fileUrl: imageDTO.fileUrl,
            byt: `${formatFileSize(imageDTO.fileSize)}/${formatFileSize(imageDTO.fileSize)}`,
            fileSize: imageDTO.fileSize,
            fileId: '-1',
            bucket: imageDTO.bucket,
            loading: false,
            fileState: 'echo', // 回显支持下载
            objectName: imageDTO.objectName,
            status: 'COMPLETED',
          },
        ],
      }
      setFileList(detail.fileList)
    }
  }, [detailData])
  useEffect(() => {
    if (!uploader) {
      return
    } // 避免初始调用form change触发校验
    const newFileList = {
      file: fileList[0]?.file || null, // null为初始化时
      fileList: [...fileList],
    }
    setFilesObj(newFileList)
    onChange && onChange(newFileList)
  }, [fileList])

  function initWebuploader() {
    WebUploader.Uploader.unRegister('contractUpload')
    WebUploader.Uploader.register(
      {
        name: 'contractUpload',
        // 在文件发送之前执行
        'before-send-file': 'beforeSendFile',
        // 在文件分片后，上传之前执行（如果没有启用分片，整个文件被当成一个分片）
        'before-send': 'beforeSend',
        // 在文件所有分片都上传完后，且服务端没有错误返回后执行
        'after-send-file': 'afterSendFile',
      },
      {
        beforeSendFile(file) {
          const deferred = WebUploader.Deferred()
          // 1、计算文件的唯一标记MD5，用于断点续传
          if (file && file.md5) {
            // 重传逻辑
            initUploader({ file, deferred, uploader })
          } else {
            new WebUploader.Uploader()
              .md5File(file, 0, 50 * 1024 * 1024)
              .progress((percentage) => {})
              .then(async (fileMd5) => {
                // 完成
                file.md5 = fileMd5 + file.size + file.name + file.lastModifiedDate.getTime()
                initUploader({ file, deferred, uploader })
              })
          }
          return deferred.promise()
        },
        beforeSend(block) {
          const deferred = WebUploader.Deferred()
          // 获取已经上传过的下标
          const indexchunk = block.chunk + 1 // 分片索引partNumber从1开始
          if (block.file.completing) {
            const completedPartsArr = block.file.completedParts.map((e) => e.partNumber)
            if (completedPartsArr.indexOf(indexchunk) !== -1) {
              // 分块已上传，跳过
              deferred.reject()
            } else {
              // 未上传
              deferred.resolve()
            }
          } else {
            deferred.resolve()
          }
          return deferred.promise()
        },
      }
    )
    let uploader = WebUploader.create({
      // 设置选完文件后是否自动上传
      auto: false,
      // 文件接收服务端。
      server: api.uploadPart,
      pick: {
        id: '#hosted-application-large-file-picker',
      },
      chunked: true, // 开启分块上传
      chunkSize: SZIE,
      chunkRetry: false, // 网络问题上传失败后重试次数
      threads: 3, // 上传并发数
      accept: {
        // 配置帮助加载速度
        title: 'tar',
        extensions: 'tar',
        mimeTypes: 'application/x-gzip,application/x-gtar,application/x-tgz', // 修改这行
      },
      duplicate: true, // 允许webuploader 内部文件队列有重复文件（使用destroy，文件队列清空，无法重传）。
      // fileNumLimit: 1000, // 验证文件总数量
      // fileSizeLimit: 2 * 1024 * 1024 * 1024, // 文件队列总共size不超过2GB，超过则不添加
      fileSingleSizeLimit: FileSizeLimit, // b 验证单个文件大小是否超出限制, 超出则不允许加入队列
    })
    uploader.on('beforeFileQueued', (file) => {
      if (file.size > FileSizeLimit) {
        // b
        showWarning(`文件不允许超过${formatFileSize(FileSizeLimit, 0)}`)
        return false
      }
      if (file.ext !== 'tar') {
        showWarning(`支持tar格式,可上传${FileNumLimit}个附件`)
        return false
      }
      if (fileNameSize && file.name.length > fileNameSize) {
        showWarning(`文件名称长度不能超过${fileNameSize}个字符，请重新上传`)
        return false
      }
      return true
    })
    // 当有文件被添加进队列的时候
    uploader.on('fileQueued', (file) => {
      setFileList((fileList) => {
        const appendFile = [...fileList]
        file.status = 'START'
        if (fileList && fileList.length < FileNumLimit) {
          appendFile.push({
            file, // 把file对象也保存下来
            fileId: file.id,
            progress: 0,
            byt: `0kb/${formatFileSize(file.size)}`,
            status: 'START', // 'START' 'ERROR' 'PENDING'
            statusName: '待开始',
            loading: true,
          })
        } else {
          appendFile.splice(FileNumLimit - 1, 1, {
            file, // 把file对象也保存下来
            fileId: file.id,
            progress: 0,
            byt: `0kb/${formatFileSize(file.size)}`,
            status: 'START', // 'START' 'ERROR' 'PENDING'
            statusName: '待开始',
            loading: true,
          })
        }
        return appendFile
      })
      uploader.upload(file)
    })
    uploader.on('uploadBeforeSend', (obj, data) => {
      data.partNumber = obj.file.preSignedURLs.shift().partNumber
      data.fileMD5 = obj.file.md5
    })
    uploader.on('uploadProgress', (upFile, percentage) => {
      setspeedObj((speedObj) => ({
        ...speedObj,
        nowTime: new Date().getTime(),
        loadedSzie: Math.trunc(percentage * upFile.size),
      }))
      setFileList((fileList) =>
        fileList.map((file) => {
          if (file.fileId === upFile.id) {
            const loaded = formatFileSize(Math.trunc(percentage * upFile.size))
            const total = formatFileSize(upFile.size)
            file.status = 'UPLOADING'
            file.file.status = 'UPLOADING'
            file.statusName = '上传中'
            file.progress = Math.floor(percentage * 100)
            file.byt = `${loaded}/${total}`
          }
          return file
        })
      )
    })
    uploader.on('uploadAccept', (object, ret) => {
      object.file.completedParted = object.file.completedParted.concat(ret.result)
    })
    uploader.on('uploadError', (upFile, reason) => {
      if (reason !== 'CANCELLED') {
        // 删除逻辑
        setFileList((fileList) => {
          if (fileList.length) {
            // 接口错误逻辑
            return fileList.map((file) => {
              if (file.fileId === upFile.id) {
                file.status = 'ERROR'
                file.file.status = 'ERROR'
                file.statusName = '错误'
                file.loading = false
                file.reason = typeof reason === 'object' ? JSON.stringify(reason) : reason
              }
              return file
            })
          }
        })
      }
    })
    uploader.on('uploadSuccess', async (upFile) => {
      // init结束 ->x会取消uploadPart-> 走到uploadSuccess，
      const { completedParted } = upFile // 部分的重传
      setFileList((fileList) =>
        fileList.map((e) => {
          if (e.fileId === upFile.id) {
            const loaded = formatFileSize(upFile.size)
            const total = formatFileSize(upFile.size)
            e.status = 'UPLOADED'
            e.file.status = 'UPLOADED'
            e.progress = 100
            e.statusName = '已完成'
            e.byt = `${loaded}/${total}`
          }
          return e
        })
      )

      let res
      if (!upFile.completed && completedParted.length) {
        // 初次上传和重传
        try {
          res = await completePart({
            fileMD5: upFile.md5, // 分片前文件的fileMD5
            parts: completedParted,
          })
        } catch (error) {
          setFileList((fileList) =>
            fileList.map((e) => {
              if (e.fileId === upFile.id) {
                e.reason = error && error.global
                e.status = 'ERROR'
                e.file.status = 'ERROR'
              }
              return e
            })
          )
        }
      }
      // 初次上传和重传,秒传
      setFileList((fileList) =>
        fileList.map((e) => {
          if (e.fileId === upFile.id) {
            e.bucket = upFile.bucket
            e.status = 'COMPLETED'
            e.file.status = 'COMPLETED'
            e.objectName = upFile.objectName
          }
          return e
        })
      )
    })

    setUploader(uploader)
  }

  const initUploader = async ({ file, deferred, uploader }) => {
    // 处理分片初始化接口
    const initParam = {
      fileName: file.name, // 分片前文件的fileName
      fileMD5: file.md5, // 分片前文件的fileMD5
      fileSize: file.size, // 分片前文件的fileSize
      totalChunks: Math.ceil(file.size / SZIE), // 文件的分片数
      preSigned: true,
      resumed: true,
    }
    if (file.status === 'CANCELLED') {
      // hash过程中文件已经删除
      deferred.reject('CANCELLED')
    } else {
      try {
        const { result: initRes } = await initMultipartUpload(initParam)
        setFileList((fileList) =>
          fileList.map((e) => {
            if (e.fileId === file.id) {
              e.loading = false
              e.isInit = 'FinishInit'
            }
            return e
          })
        )
        file.preSignedURLs = initRes.preSignedURLs
        file.bucket = initRes.bucket
        file.objectName = initRes.objectName
        if (initRes.uploadStatus === 0 || initRes.uploadStatus === 2) {
          // 重传
          if (initRes.completedParts && initRes.completedParts.length) {
            file.completedParted = initRes.completedParts
            file.completedParts = initRes.completedParts
            file.completing = true // 已上传部分分片重传
          } else {
            file.completedParted = []
          }
        }
        if (initRes.uploadStatus === 1) {
          // 秒传
          uploader.skipFile(file)
          file.completed = true
        }
        deferred.resolve()
        setspeedObj({ ...speedObj, startTime: new Date().getTime() })
      } catch (error) {
        deferred.reject(error?.toast)
      }
    }
  }

  const renderFiles = useCallback(
    () => (
      <>
        <div className={`${PREFIX}-item`}>
          {fileList.map((item, i, arr) => (
            <div key={item.fileId} className={item.status === 'ERROR' ? `${PREFIX}-item-ERROR` : ''}>
              <Tooltip title={item.status === 'ERROR' ? item.reason : item.file.name}>
                <Row>
                  <FileHeader item={item} className={PREFIX} />
                  <FileOperations item={item} className={PREFIX} uploader={uploader} setFileList={setFileList} />
                </Row>
              </Tooltip>
              <Row key={nanoid()}>
                <FileProgress item={item} className={PREFIX} speed={speed} />
              </Row>
            </div>
          ))}
        </div>
      </>
    ),
    [fileList, speed, uploader]
  )
  const renderUpButton = useCallback(
    () => (
      <Button
        id={'hosted-application-large-file-picker'}
        disabled={fileList.length === FileNumLimit && notUpStatus.indexOf(fileList[fileList.length - 1]?.status) !== -1}
        icon={<OutlinedButtonUpload style={{ marginRight: '4px' }} />}
      >
        上传文件
      </Button>
    ),
    [fileList, uploader]
  )
  return (
    <section className={`${PREFIX}`}>
      {renderUpButton()}
      {renderFiles()}
    </section>
  )
}

export default WebuploaderLargeFiles
