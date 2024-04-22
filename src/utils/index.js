import { sha256 } from 'js-sha256'
import { version as APP_VERSION } from '../../package.json'


const uniFormVali = async (formEl, validFunc = () => {
}, invalidFunc = () => {
}) => {
  if (!formEl) {
    console.log('formEl is null')
    return
  }
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      validFunc()
    } else {
      console.log('error submit!', fields)
      invalidFunc(fields)
    }
  })
}

const calcSHA256 = (inputString) => {
  // const hash = crypto.createHash('sha256');
  // hash.update(inputString);
  // return hash.digest('hex');
  return sha256(inputString)
}

const timeStampedText = (text) => {
  return `[${new Date().toLocaleTimeString()}] ${text}`
}

export { uniFormVali, calcSHA256, timeStampedText, APP_VERSION }
