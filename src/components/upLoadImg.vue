<!-- 上传图片 组件 -->
<template>
    <div class="vue-uploader" :callback="callback" :num="num" :files_="files_">
        <!-- 添加图片 及 显示效果 -->
        <div class="file-list">
            <!-- 图片列表 files -->
            <section v-for="(file, index) of files" class="file-item draggable-item">
                <img :src="file.src" alt="" ondragstart="return false;">
                <p class="file-name">{{file.name}}</p>
                <span class="file-remove" @click="remove(index)">+</span>
            </section>
            <!-- 添加图片按钮 -->
            <section class="file-item">
                <div @click="add" class="add" v-if="files.length < num">
                    <span>+</span>
                </div>
            </section>
        </div>
        <!-- 上传图片操作 及 显示进程 -->
        <section v-if="files.length != 0" class="upload-func">
            <!-- 上传进度 -->
            <div class="progress-bar">
                <section v-if="uploading" :width="(percent * 100) + '%'">{{(percent * 100) + '%'}}</section>
            </div>
            <!-- 操作按钮 -->
            <div class="operation-box">
                <button v-if="status == 'ready'" @click="submit">上传</button>
                <button v-if="status == 'finished'" @click="finished">完成</button>
            </div>
        </section>
        <!-- 调用相机/图库 ref="file" 指定DOM节点 -->
        <input type="file" accept="image/*" @change="fileChanged" ref="file" multiple="multiple">
        <!--         <input type="file" accept="image/*" @change="fileChanged" ref="file" capture="camera" multiple>-->
    </div>
</template>

<script>
    import {Toast,Indicator} from 'mint-ui'

    export default {
        props: {
            src: { // 后台接受图片的http地址
                type: String,
                // required: true,
                default: ''
            },
            num: {
                type: Number,
                default: 1
            },
            callback: {
                type: [Function, String],
                default: ''
            },
            files_: {
                type: [Array, String],
                default: ''
            }
        },
        data () {
            return {
                status: 'ready', // 状态
                files: [], // 图片数组
                uploading: false, // 进度条
                percent: 0 // 上传进度
            }
        },
        mounted () {
            // alert(this.files_)
            // this.files = this.files_
            // if(this.files_){
            //     console.log('====================')
            //     this.files = this.files_
            //     this.add()
            // }
        },
        methods: {
            // 添加图片操作
            add () {
                this.$refs.file.click()
            },
            // 上传图片操作
            submit () {
                if (this.files.length === 0) {
                    console.warn('no file!')
                    return
                }
                // 创建formData对象
                // const formData = new FormData()
                this.uploading = true
                var imgs = []
                Indicator.open()
                this.files.forEach((item) => {
                    console.log(JSON.stringify(item))
                    let formData = new FormData()
                    formData.append('file', item.file)
                    // let param = item.src
                    this.$miniapi.saveImage(formData).then(res => {
                        this.uploading = false
                        if (res.data.code === '2000') {
                            this.status = 'finished'
                            // this.uploading = false
                            console.log(res.data.data.id)
                            imgs.push(res.data.data.id)
                            this._callback(imgs)
                        } else {
                            console.log(`error：error code ${res.data.msg}`)
                            Toast(res.data.msg)
                        }
                    }).catch((res)=>{
                        Indicator.close()
                        Toast('照片上传失败，请检查您的网络，或者稍后重试。')
                    })
                })
                Indicator.close()
                console.log(imgs)
                // this._callback(imgs)
                // const xhr = new XMLHttpRequest()
                // xhr.upload.addEventListener('progress', this.uploadProgress, false)
                // xhr.open('POST', this.src, true)
                // this.uploading = true
                // xhr.send(formData)
                // xhr.onload = () => {
                //   this.uploading = false
                //   if (xhr.status === 200 || xhr.status === 304) {
                //     this.status = 'finished'
                //     console.log('upload success!')
                //   } else {
                //     console.log(`error：error code ${xhr.status}`)
                //   }
                // }
            },
            _callback (res) {
                Indicator.close()
                if (this.callback && this.callback instanceof Function) {
                    this.callback(res)
                }
            },
            // 完成操作 还原状态
            finished () {
                console.log('完成')
                // this.files = []
                // this.status = 'ready'
            },
            // 上传图片列表中的某个图片
            remove (index) {
                this.files.splice(index, 1)
                this.status = 'ready'
            },
            // 唤醒相机/图库
            fileChanged () {
                const list = this.$refs.file.files
                for (let i = 0; i < list.length; i++) {
                    if (!this.isContain(list[i])) {
                        const item = {
                            name: list[i].name,
                            size: list[i].size,
                            file: list[i]
                        }
                        // 转换图片格式
                        if (list[i].size / 1024 > 100) {
                            let _this = this
                            const reader = new FileReader()
                            reader.readAsDataURL(list[i])
                            reader.onload = function () {
                                var re = this.result
                                _this.canvasDataURL(re, {quality: 0.2}, function (res) {
                                    console.log('==========')
                                    console.log(res)
                                    // item.src = res
                                    var arr = res.split(','), mime = arr[0].match(/:(.*?);/)[1],
                                        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
                                    while (n--) {
                                        u8arr[n] = bstr.charCodeAt(n)
                                    }
                                    // return
                                    item.size = bstr.length
                                    item.file = new Blob([u8arr], {type: mime})
                                    item.src = res
                                })
                            }
                        }
                        this.html5Reader(list[i], item)
                        this.files.push(item)

                    }
                }
                this.$refs.file.value = ''
            },
            // 将图片文件转成BASE64格式
            html5Reader (file, item) {
                let _this = this
                const reader = new FileReader()
                reader.onload = (e) => {
                    // console.log(e.target.result)
                    this.$set(item, 'src', e.target.result)
                }
                reader.readAsDataURL(file)
                // reader.onload=function(){
                //     var re=this.result;
                //     _this.canvasDataURL(re,{quality: 0.2},_this.ysBack)
                // }

            },
            canvasDataURL (path, obj, callback) {
                var img = new Image()
                console.log('压缩')
                img.src = path
                img.onload = function () {
                    var that = this
                    // 默认按比例压缩
                    var w = that.width,
                        h = that.height,
                        scale = w / h
                    w = obj.width || w
                    h = obj.height || (w / scale)
                    var quality = 0.7  // 默认图片质量为0.7
                    //生成canvas
                    var canvas = document.createElement('canvas')
                    var ctx = canvas.getContext('2d')
                    // 创建属性节点
                    var anw = document.createAttribute('width')
                    anw.nodeValue = w
                    var anh = document.createAttribute('height')
                    anh.nodeValue = h
                    canvas.setAttributeNode(anw)
                    canvas.setAttributeNode(anh)
                    ctx.drawImage(that, 0, 0, w, h)
                    // 图像质量
                    if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                        quality = obj.quality
                    }
                    // quality值越小，所绘制出的图像越模糊
                    var base64 = canvas.toDataURL('image/jpeg', quality)
                    // console.log(base64)
                    // return base64
                    // 回调函数返回base64的值
                    callback(base64)
                }
            },
            // 判断是否包含
            isContain (file) {
                this.files.forEach((item) => {
                    if (item.name === file.name && item.size === file.size) {
                        return true
                    }
                })
                return false
            },
            // 上传进度
            uploadProgress (evt) {
                const component = this
                if (evt.lengthComputable) {
                    const percentComplete = Math.round((evt.loaded * 100) / evt.total)
                    component.percent = percentComplete / 100
                } else {
                    console.warn('upload progress unable to compute')
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .vue-uploader {
        border: 1px solid #e5e5e5;

        .file-list {
            padding: 10px 0px;

            &:after {
                content: '';
                display: block;
                clear: both;
                visibility: hidden;
                line-height: 0;
                height: 0;
                font-size: 0;
            }

            .file-item {
                float: left;
                position: relative;
                width: 100px;
                text-align: center;

                img {
                    width: 80px;
                    height: 80px;
                    border: 1px solid #ececec;
                }

                .file-remove {
                    position: absolute;
                    right: 12px;
                    display: none;
                    top: 4px;
                    width: 14px;
                    height: 14px;
                    color: white;
                    cursor: pointer;
                    line-height: 12px;
                    border-radius: 100%;
                    transform: rotate(45deg);
                    background: rgba(0, 0, 0, 0.5);
                }

                &:hover {
                    .file-remove {
                        display: inline;
                    }
                }

                .file-name {
                    margin: 0;
                    height: 40px;
                    word-break: break-all;
                    font-size: 14px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
            }
        }

        .add {
            width: 80px;
            height: 80px;
            margin-left: 10px;
            float: left;
            text-align: center;
            line-height: 80px;
            border: 1px dashed #ececec;
            font-size: 30px;
            cursor: pointer;
        }

        .upload-func {
            display: flex;
            padding: 10px;
            margin: 0px;
            background: #f8f8f8;
            border-top: 1px solid #ececec;

            .progress-bar {
                flex-grow: 1;

                section {
                    margin-top: 5px;
                    background: #00b4aa;
                    border-radius: 3px;
                    text-align: center;
                    color: #fff;
                    font-size: 12px;
                    transition: all .5s ease;
                }
            }

            .operation-box {
                flex-grow: 0;
                padding-left: 10px;

                button {
                    padding: 4px 12px;
                    color: #fff;
                    background: #007ACC;
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                }
            }
        }

        & > input[type="file"] {
            display: none;
        }
    }
</style>
