"use strict";
window.iplayer = function (wrapperId,src) {
    ////////////////////////////////////////////      公共变量
    var currentTimeListener;
    ////////////////////////////////////////////      公共函数

    ////////////////////////////////////////////      插件变量
    var video = this.video = $("#iplayer").el;

    video.src= src;

    // var mediaSource = new MediaSource();
    // video.src = URL.createObjectURL(mediaSource);
    // mediaSource.addEventListener('sourceopen', function (_) {
    //     var mediaSource = this;
    //     var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    //     function fetchAB (url, cb) {
    //         var xhr = new XMLHttpRequest;
    //         xhr.open('get', url);
    //         xhr.responseType = 'arraybuffer';
    //         xhr.onload = function () {
    //             cb(xhr.response);
    //         };
    //         xhr.send();
    //     };
    //     fetchAB(src, function (buf) {
    //         sourceBuffer.addEventListener('updateend', function (_) {
    //             mediaSource.endOfStream();
    //         });
    //         sourceBuffer.appendBuffer(buf);
    //     });
    // });




    this.W = this.H = this.P = 0;
    this.duration = 0;
    this.state = {
        progressMouseDown:false,
        playing:false,
        timeOver:false,
        fullScreen:false
    };




    ////////////////////////////////////////////      插件函数
    var _this = this;
    this.play = function () {
        !_this.state.timeOver && video.play();
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
    this.timeUpdate = function (callback) {
        $(video).addEvent("timeupdate",callback);
    };
    this.progress = function (callback) {
        $(video).addEvent("progress",callback);
    };
    this.loadedData = function (callback) {
        $(video).addEvent("loadeddata",callback);
    };
    this.canPlay = function (callback) {
        function handle() {
            $(video).delEvent("canplay",handle);
            callback();
        }
        $(video).addEvent("canplay",handle);
    };
    this.seeking = function (callback) {
        $(video).addEvent("seeking",callback);
    };
    this.seeked = function (callback) {
        $(video).addEvent("seeked",callback);
    };
    this.init = function () {
        this.duration = video.duration;
        var w = video.clientWidth;
        var h = video.clientHeight;
        this.P = w/h;
        this.W = 1000;
        this.H = this.W/this.P;
        $(video).W(this.W).T(($.H-this.H)/2);
    };
    ////////////////////////////////////////////      事件

};


