export class JHWebSocket {
  constructor (url) {
    this.ws = null
    this.reloadsocket(url)
  }

  reloadsocket (url) {
    if ('WebSocket' in window) {
      console.log('您的浏览器支持 WebSocket!')
      // 打开一个 web socket
      this.ws = new WebSocket(url)
      this.ws.onmessage = function (evt) {
        console.log('收到数据： ' + evt.data)
        this.messaged(evt)
      }
      this.ws.onopen = function () {
        console.log('send: ' + JSON.stringify({'businessId': localStorage.getItem('bussnessId')}))
        this.ws.send(JSON.stringify({'businessId': localStorage.getItem('bussnessId')}))
      }
      this.ws.onclose = function () {
        // 关闭 websocket
        this.ws = 'closed'
        console.log('连接已关闭...')
      }
      this.ws.onerror = function () {
        this.ws = 'closed'
        console.log('连接异常')
      }
    } else {
      // 浏览器不支持 WebSocket
      console.log('您的浏览器不支持 WebSocket!')
    }
  }

  open (message) {
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
  }

  messaged (mes) {
    if (mes.data.orderStatus === 2) {
      var audio = document.createElement('audio')
      audio.src = 'http://boscdn.bpc.baidu.com/v1/developer/daffd18a-1bbd-4f85-98a3-4e8d254eb102.mp3'
      audio.play()
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
