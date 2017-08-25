
require("./css/test.css");
require("./mjjm.js");
require("./KPlayer.js");

$(function () {
    var player = new KPlayer({
        src :"http://172.16.64.166:80/vod/000000000000/99999999999999999999999999999999/0_1503471590-1503471600.mp4",
        //src :"../../../../../Tests/videos/1.mp4",
        controls:"controls"
    });
    player.add_to_wrapper("wrapper");

    player.video.addEventListener("seeking",function () {
        console.log("seeking!");
    });
    player.video.addEventListener("seeked",function () {
        console.log("seeked!");
    });
    //播放
    $("#play").click(function () {
        player.play();
    });
    $("#pause").click(function () {
        player.pause();
    });
    $("#stop").click(function () {
        player.stop();
    });
    $("#currentTime").click(function () {
        console.log(player.currentTime(40));
    });
    $("#setVolume").click(function () {
        console.log(player.volume(0.5));
    });
    $("#snapshot").click(function () {
        player.snapshot(function (img) {
            $.log(img);
            //document.body.appendChild(img);
            $("#saveImage").click(function () {
                player.saveImage(img.src,"test.jpg");
            });
        },"image/jpeg",0.8);
    });
    $("#multipleSnapshot").click(function () {
        player.multipleSnapshot(4,3000,function (imgs) {
            $.each(imgs,function (k,v) {
                $.log(v);
                document.body.appendChild(v);
            });

        });
    });
    $("#openCurrentTimeListener").click(function () {
        player.openCurrentTimeListener(100,function (time) {$.log(time);});
    });
    $("#closeCurrentTimeListener").click(function () {
        player.closeCurrentTimeListener();
    });
});

