export class Printer {
    constructor () {
        this.printer = false
        try {
            this.init()
        } catch (e) {
            console.log('app log Err:' + e)
            // this.init()
        }
    }

    async init () {
        let Xia = plus.android.importClass('com.smartdevice.Printer')
        let main = plus.android.runtimeMainActivity()
        let xia = new Xia()
        xia.init(main)
        this.activity = main
        this.printer = xia
        xia.printerInit()
        console.log('app log:打印机状态' + xia.getPrinterStatus())
    }

    close () {
        this.printer.close(this.activity)
        this.printer = false
    }

    getPrinter () {
        console.log('app log: printer dddddddddddd')
        if (this.checkPrinter()) {
            console.log('app log: pinter ss' + this.printer)
            return this.printer
        }
        return new Printer()

    }

    checkPrinter () {
        console.log('app log: pinter ss ===sddd ' + this.printer)
        console.log('app log: check pinter ss ====' + typeof this.printer)
        // if (typeof this.printer == 'object') {
        //     return true
        // }
        // return false

        try {
            let st = this.printer.getPrinterStatus()
            console.log('app log:' + st)
            return true
        } catch (e) {
            console.log('app log: Printer checkPrinter' + e)
            return false
        }
    }

}
