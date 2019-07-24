<template>
    <div id="app">
        <!--<img src="./assets/logo.png">-->
        <router-view/>
    </div>
</template>

<script>
    // import {Toast, MessageBox} from 'mint-ui'

    export default {
        name: 'App',
        data () {
            return {
                g_wakelock: null
            }
        },
        created () {
            let _this = this
            document.addEventListener('pause', function () {
                console.log('app log: 进入后台')
                _this.wakeLock()
                localStorage.setItem('isAppActive', false)
                // plus.push.createMessage('聚汇提醒', '', {
                //     title: '聚汇商家在后台执行'
                // })
            })
            // 注册应用切换到前台事件
            document.addEventListener('resume', function () {
                console.log('app log: 进入前台')
                localStorage.setItem('isAppActive', true)
                _this.releaseWakeLock()
            })

        },
        methods: {
            test () {
                var NotifyID = 1
                var main = plus.android.runtimeMainActivity()
                var Context = plus.android.importClass('android.content.Context')
                var Noti = plus.android.importClass('android.app.Notification')
                var NotificationManager = plus.android.importClass('android.app.NotificationManager')
                var nm = main.getSystemService(Context.NOTIFICATION_SERVICE)
                var Notification = plus.android.importClass('android.app.Notification')
                var mNotification = new Notification.Builder(main)
// 新增 810726685@qq.com 的代码
                var Intent = plus.android.importClass('android.content.Intent')
                var PendingIntent = plus.android.importClass('android.app.PendingIntent')
                var intent = new Intent(main, main.getClass())
                var pendingIntent = PendingIntent.getActivity(main, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT)
// 新增代码
                var r = plus.android.importClass('android.R')

                mNotification.setOngoing(true)
                mNotification.setContentTitle('聚汇')
                mNotification.setContentText('聚汇app正在后台运行...')

// 新增代码
                mNotification.setSmallIcon(r.drawable.ic_notification_overlay)
                mNotification.setTicker('PadInfo')

// 新增 810726685@qq.com 的代码
                mNotification.setContentIntent(pendingIntent)
                mNotification.setNumber(10)
                var mNb = mNotification.build()
                nm.notify(NotifyID, mNb)
                var t = null

                // if (t) {
                //     clearInterval(t)
                // }
                // t = setInterval('console.log(new Date())', 2000)
            },
            wakeLock () {
                //Android
                console.log('app log: wakeLock后台执行')
                var main = plus.android.runtimeMainActivity()
                var Context = plus.android.importClass('android.content.Context')
                var PowerManager = plus.android.importClass('android.os.PowerManager')
                var pm = main.getSystemService(Context.POWER_SERVICE)
                this.g_wakelock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, 'ANY_NAME')
                this.g_wakelock.acquire()
            },
            //结束程序后台运行
            releaseWakeLock () {
                if (this.g_wakelock != null && this.g_wakelock.isHeld()) {
                    console.log('app log: wakeLock结束后台执行')
                    this.g_wakelock.release()
                    this.g_wakelock = null
                }
            }
        }
    }
</script>

<style>

</style>
