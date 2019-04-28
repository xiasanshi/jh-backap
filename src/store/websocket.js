export class JHWebSocket {
  constructor (url) {
    this.ws = null
    this.url = url
    this.reloadsocket()
  }

  reloadsocket () {
    if ('WebSocket' in window) {
      console.log('您的浏览器支持 WebSocket!')
      // 打开一个 web socket
      let url = this.url
      this.ws = new WebSocket(url)
      let self = this
      this.ws.onmessage = function (evt) {
        console.log('收到数据： ' + evt.data)
        self.messaged(evt)
      }
      this.ws.onopen = function () {
        console.log('send: ' + JSON.stringify({'shopId': '1'}))
        self.open(JSON.stringify({'shopId': '1'}))
      }
      this.ws.onclose = function () {
        // 关闭 websocket
        self.ws = 'closed'
        console.log('连接已关闭...')
      }
      this.ws.onerror = function () {
        self.ws = 'closed'
        console.log('连接异常')
      }
    } else {
      // 浏览器不支持 WebSocket
      console.log('您的浏览器不支持 WebSocket!')
    }
  }

  open (message) {
    let audio = document.createElement('audio')
    audio.src = 'http://boscdn.bpc.baidu.com/v1/developer/daffd18a-1bbd-4f85-98a3-4e8d254eb102.mp3'
    const playPromise = audio.play()
    if (playPromise !== null) {
      playPromise.catch(() => { audio.play() })
    }
    // audio.play()
    // audio.play()
    // audio.play()
    // audio.play()
    console.log('send: ' + message)
    this.ws.send(message)
  }

  closed () {
    this.ws = 'closed'
    console.log('连接已关闭...')
  }

  error () {
    this.ws = 'closed'
    console.log('连接异常')
    this.reloadsocket(this.url)
  }

  messaged (mes) {
    if (mes.data.orderStatus === 2) {
      let audio = document.createElement('audio')
      audio.src = 'http://boscdn.bpc.baidu.com/v1/developer/daffd18a-1bbd-4f85-98a3-4e8d254eb102.mp3'
      audio.play()
    }
    let audio = document.createElement('audio')
    audio.src = 'http://boscdn.bpc.baidu.com/v1/developer/daffd18a-1bbd-4f85-98a3-4e8d254eb102.mp3'
    const playPromise = audio.play()
    if (playPromise !== null) {
      playPromise.catch(() => { audio.play() })
    }
    console.log('收到数据： ' + mes.data)
  }

  socket () {
    return this.ws
  }

  sendMessage (message) {
    console.log('send: ' + message)
    this.ws.send(message)
  }
}
