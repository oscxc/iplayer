(function () {
    window.KPlayer = function (obj) {
        /////////////////////////////////////////////     公共变量
        var version = "1.0.0";
        var W = window.innerWidth;
        var H = window.innerHeight;
        var currentTimeListener;
        ////////////////////////////////////////////      公共函数
        function extend(t,o) {
            for(var n in o){
                t[n]=o[n] ;
            }
        }
        function type(v) {
            return Object.prototype.toString.apply(v).replace("[object ","").replace("]","");
        }
        function each(v,f) {
            var t = type(v);
            if (t==="Array"||t==="NodeList") {
                for (var i=0;i<v.length;i++) {
                    f(i,v[i]);
                }
            }
            else if(t==="Object"){
                for (var key in v) {
                    f(key,v[key]);
                }
            }
            else if(t==="Number"){
                for (var i=0;i<v;i++) {
                    f(i,v);
                }
            }
            else{
                throw new TypeError("该对象不支持遍历");
            }
        }
        function create(tagName,attrs) {
            var el;
            switch (tagName){
                case "text":
                    el = document.createTextNode(attrs);
                    break;
                case "comment":
                    el = document.createComment(attrs);
                    break;
                case "fragment":
                    el = document.createDocumentFragment();
                    break;
                default:
                    el = document.createElement(tagName);
                    if(attrs){
                        each(attrs,function (k,v) {
                            el.setAttribute(k,v);
                        });
                    }
                    break;
            }
            return el;
        }
        function $(id) {
            return document.getElementById(id);
        }
        function addEvent(el,name,handle,b) {
            el.addEventListener(name,handle,b?b:false);
        }
        function download(src,name) {
            var a = create('a',{
                href:src,
                download:name
            });
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
        ////////////////////////////////////////////      插件变量
        var video = this.video = create("video",obj);

        //定义和获取video的宽高
        var videoW,videoH;
        addEvent(video,"canplay",function () {
            videoW = this.clientWidth;
            videoH = this.clientHeight;
        });


        ////////////////////////////////////////////      插件函数
        this.add_to_wrapper =  function (id) {
            $(id).appendChild(video);
        };
        this.play = function () {
            video.play();
        };
        this.pause = function () {
            video.pause();
        };
        this.stop = function () {
            video.pause();
            video.currentTime = 0;
        };
        this.volume = function (val) {
            return val?video.volume = val:video.volume;
        };
        this.currentTime = function (val) {
            return val?video.currentTime = val:video.currentTime;
        };
        this.snapshot = function (callback,format,Q) {
            var canvas = create("canvas");
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width = videoW, canvas.height = videoH);
            var img = new Image();
            img.onload = function () {
                callback(this);
            };
            img.src = format&&format=="image/jpeg"?canvas.toDataURL("image/jpeg",Q?Q:1):canvas.toDataURL();
        };
        this.saveImage = function (src,name) {
            download(src,name?name:"defaultname");
        };
        this.multipleSnapshot = function (n,ms,callback,format,Q) {
            var imgs = [];
            var count = 0;

            for(var i=0;i<n;i++){
                this.snapshot(function (img) {
                    imgs.push(img);
                    count++;
                    if(count===n){
                        callback(imgs);
                    }
                },format,Q);
                video.currentTime += ms;
            }
        };
        this.openCurrentTimeListener = function (ms,callback) {
            currentTimeListener = setInterval(function () {
                callback(video.currentTime);
            },ms);
        };
        this.closeCurrentTimeListener = function () {
            clearInterval(currentTimeListener);
        };
        this.init = function () {

        };
    };

}());
