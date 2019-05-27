let _this = this
export class JHWebSocket {
    constructor (url, shopid, callback) {
        this.ws = null
        this.url = url
        this.shop_id = shopid
        this.reloadsocket()
        this.orderNum = 0
        this._callback = callback
    }

    reloadsocket () {
        if ('WebSocket' in window) {
            console.log('您的浏览器支持 WebSocket!')
            // 打开一个 web socket
            let url = this.url
            this.ws = new WebSocket(url)
            let self = this
            this.ws.onmessage = function (evt) {
                _this.$orderFlag = 1
                // console.log('收到数据： ' + evt.data)
                self.messaged(evt)
            }
            this.ws.onopen = function () {
                console.log('send: ' + JSON.stringify({'shopId': self.shop_id + ''}))
                self.open(JSON.stringify({'shopId': self.shop_id + ''}))
            }
            this.ws.onclose = function () {
                // 关闭 websocket
                self.ws = 'closed'
                console.log('连接已关闭...')
            }
            this.ws.onerror = function () {
                self.ws = 'closed'
                console.log('连接异常')
                self.reloadsocket()
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
        // this.ws.close()
        this.ws.close()
        this.ws = 'closed'
        console.log('连接已关闭...')
    }

    error () {
        this.ws = 'closed'
        console.log('连接异常')
        this.reloadsocket(this.url)
    }

    getWs () {
        return this.ws
    }

    getOrderNum(){
        return this.orderNum
    }

    messaged (mes) {
        // alert(_this.$orderFlag)
        console.log('收到数据： ' + mes.data)
        if (mes.data.indexOf('微信') === -1) {
            return
        }
        this._callback()
    }

    socket () {
        return this.ws
    }

    sendMessage (message) {
        console.log('send: ' + message)
        this.ws.send(message)
    }
}
