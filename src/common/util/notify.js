export const push = (title='聚汇', message='聚汇app正在后台运行') => {
    var NotifyID = 1;
    var main = plus.android.runtimeMainActivity();
    var Context = plus.android.importClass("android.content.Context");
    var Noti = plus.android.importClass("android.app.Notification");
    var NotificationManager = plus.android.importClass("android.app.NotificationManager");
    var nm = main.getSystemService(Context.NOTIFICATION_SERVICE)
    var Notification = plus.android.importClass("android.app.Notification");
    var mNotification = new Notification.Builder(main);
// 新增 810726685@qq.com 的代码
    var Intent = plus.android.importClass("android.content.Intent");
    var PendingIntent = plus.android.importClass("android.app.PendingIntent");
    var intent = new Intent(main, main.getClass());
    var pendingIntent = PendingIntent.getActivity(main, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
// 新增代码
    var r = plus.android.importClass("android.R");

    mNotification.setOngoing(true);
    mNotification.setContentTitle(title)
    mNotification.setContentText(message)

// 新增代码
    mNotification.setSmallIcon(r.drawable.ic_notification_overlay)
    mNotification.setTicker("PadInfo")

// 新增 810726685@qq.com 的代码
    mNotification.setContentIntent(pendingIntent);
    mNotification.setNumber(10)
    var mNb = mNotification.build()
    nm.notify(NotifyID, mNb);
}
