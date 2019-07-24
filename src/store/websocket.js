import {push} from '../common/util/notify'

let _this = this

export class JHWebSocket {
    constructor (url, shopid, callback) {
        this.ws = null
        this.url = url
        this.shop_id = shopid
        this.reloadsocket()
        this.orderNum = 0
        this._callback = callback
        this.num = 0
        // this.websocket_test()
    }

    reloadsocket () {
        console.log('app log:重新链接websocket')
        this.num += 1
        let n = this.num
        if (n > 1) {
            push('聚汇', '重新链接websocket: ' + n)
            plus.push.createMessage('聚汇提醒' + n, '', {
                title: '聚汇商家在后台执行' + new Date()
            })
        }

        if (this.ws && this.ws != 'closed') {
            // this.closed()
            console.log('app log: debug websocket 还活着')
            this.ws.send(this.shop_id + '还活着')
            return
        }
        if ('WebSocket' in window) {
            console.log('app log:您的浏览器支持 WebSocket!')
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
                // self.reloadsocket()
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

    getOrderNum () {
        return this.orderNum
    }

    messaged (mes) {
        // alert(_this.$orderFlag)
        console.log('app log 收到数据： ' + mes.data)
        if (mes.data.indexOf('微信') === -1) {
            return
        }
        try {
            this._callback()
        } catch (e) {
            console.log('app log: error websocket ' + e)
        }
    }

    socket () {
        return this.ws
    }

    sendMessage (message) {
        console.log('send: ' + message)
        this.ws.send(message)
    }

    websocket_test () {
        console.log('app log: ==================')
        let _this = this
        let t = null
        document.addEventListener('pause', function () {
            console.log('app log: 进入后台')
            console.log('app log: websocket')
            if (t) {
                clearInterval(t)
            }
            t = setInterval(function (e) {
                _this.reloadsocket()
            }, 5000)
        })
        // 注册应用切换到前台事件
        document.addEventListener('resume', function () {
            console.log('app log: 进入前台')
            clearInterval(t)
            t = null
        })
        // document.addEventListener('visibilitychange', function () {
        //     console.log('app log: websocket')
        //     let t = null
        //     if (document.visibilityState == 'hidden') {
        //         //记录页面隐藏时间
        //         // _this.ws.close()
        //         if (t) {
        //             clearInterval(t)
        //         }
        //         t = setInterval(function (e) {
        //             _this.reloadsocket()
        //         }, 1000)
        //     } else {
        //         clearInterval(t)
        //         t = null
        //     }
        // })
    }
}
