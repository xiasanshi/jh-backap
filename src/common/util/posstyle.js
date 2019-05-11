import {Toast} from 'mint-ui'

export const bold = (writer, flag) => {
  if (flag) {
    writer.write(0x1B)
    writer.write(69)
    writer.write(0xF)
  } else {
    writer.write(0x1B)
    writer.write(69)
    writer.write(0)
  }
}

/**
 * 排版
 *
 * @param position 0：居左(默认) 1：居中 2：居右
 * @return
 * @throws IOException
 */
export const align = (writer, position) => {
  writer.write(0x1B)
  writer.write(97)
  writer.write(position)
  return this
}
/**
 * 字体大小
 *
 * @param size 1-8 选择字号
 * @return
 * @throws IOException
 */
export const sizePos = (writer, size) => {
  writer.write(0x1D)
  writer.write(33)
  writer.write(size)
}
/**
 * 进纸并全部切割
 *
 * @return
 * @throws IOException
 */
export const feedAndCut = (writer) => {
  writer.write(0x1D)
  writer.write(86)
  writer.write(65)
  writer.write(0)
  writer.flush()
}

// export default pos
export class PosMachine {
  constructor (ipAddr, port) {
    let u = navigator.userAgent
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
    if (ipAddr && port && (isAndroid | isiOS)) {
      this.connect(ipAddr, port)
    } else {
      Toast('web端')
      console.log('打印机等待链接')
    }
  }

  connect (ipAddr, port) {
    if (plus.os.name == 'Android') {
      var Socket = plus.android.importClass('java.net.Socket')
      var InetSocketAddress = plus.android.importClass('java.net.InetSocketAddress')
      var PrintWriter = plus.android.importClass('java.io.PrintWriter')
      var BufferedWriter = plus.android.importClass('java.io.BufferedWriter')
      var OutputStreamWriter = plus.android.importClass('java.io.OutputStreamWriter')
      var BufferedReader = plus.android.importClass('java.io.BufferedReader')
      var InputStreamReader = plus.android.importClass('java.io.InputStreamReader')
      var StrictMode = plus.android.importClass('android.os.StrictMode')
      var Build = plus.android.importClass('android.os.Build')
      if (Build.VERSION.SDK_INT > 9) {
        var policy = new StrictMode.ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)
      }
      var socket = null
      this.posMaWriter = null
      try {
        // socket = new Socket(ipAddr, port)
        socket = new Socket()
        var ipc = new InetSocketAddress(ipAddr, port)
        console.log('ssssssssssssssss')
        socket.connect(ipc, 1000)
        console.log('ssssssssssssssss')
        var outputStreamWriter = new OutputStreamWriter(socket.getOutputStream(), 'gbk')
        var bufferWriter = new BufferedWriter(outputStreamWriter)
        this.posMaWriter = new PrintWriter(bufferWriter, true)
      } catch (e) {
        console.log(`链接超时：${ipAddr}:${port}`)
        socket = null
      }
    }
  }

  setBold (flag) {
    if (flag) {
      this.posMaWriter.write(0x1B)
      this.posMaWriter.write(69)
      this.posMaWriter.write(0xF)
    } else {
      this.posMaWriter.write(0x1B)
      this.posMaWriter.write(69)
      this.posMaWriter.write(0)
    }
  }

  /**
   * 排版
   *
   * @param position 0：居左(默认) 1：居中 2：居右
   * @return
   * @throws IOException
   */
  setAlign (position) {
    this.posMaWriter.write(0x1B)
    this.posMaWriter.write(97)
    this.posMaWriter.write(position)
  }

  /**
   * 字体大小
   *
   * @param size 1-8 选择字号
   * @return
   * @throws IOException
   */
  setSize (size) {
    this.posMaWriter.write(0x1D)
    this.posMaWriter.write(33)
    this.posMaWriter.write(size)
  }

  /**
   * 进纸并全部切割
   *
   * @return
   * @throws IOException
   */
  feedAndCut () {
    this.posMaWriter.write(0x1D)
    this.posMaWriter.write(86)
    this.posMaWriter.write(65)
    this.posMaWriter.write(0)
    this.posMaWriter.flush()
  }

  getPosHandle () {
    return this.posMaWriter
  }
}
