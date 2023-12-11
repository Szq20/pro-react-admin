/*
 * @author shenzhiqiang01
 * @date 2022-08-30
 * @Description 大文件上传相关处理
 */
const SIZE = 10 * 1024 * 1024 // 切片大小

function formatFileSize(fileSize, def = 2) {
  if (fileSize < 1024) {
    return `${fileSize}B`
  }
  if (fileSize < 1024 * 1024) {
    var temp = fileSize / 1024
    temp = temp.toFixed(def)
    return `${temp}KB`
  }
  if (fileSize < 1024 * 1024 * 1024) {
    var temp = fileSize / (1024 * 1024)
    temp = temp.toFixed(def)
    return `${temp}MB`
  }
  var temp = fileSize / (1024 * 1024 * 1024)
  temp = temp.toFixed(def)
  return `${temp}GB`
}
export { formatFileSize }
