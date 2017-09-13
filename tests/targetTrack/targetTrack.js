'use strict';
window.targetTrack = function (_cfg) {
    ////////////////////////////////////////////      公共变量
    var W,H; //浏览器可用区域宽高

    ////////////////////////////////////////////      公共函数

    function extend(t,o) {
        for(var n in o){
            t[n]=o[n] ;
        }
    }
    function type(v) {
        return Object.prototype.toString.apply(v).replace('[object ',"").replace(']',"");
    }
    function each(v,f) {
        var t = type(v);
        if (t==='Array'||t==='NodeList') {
            for (var i=0;i<v.length;i++) {
                f(i,v[i]);
            }
        }
        else if(t==='Object'){
            for (var key in v) {
                f(key,v[key]);
            }
        }
        else if(t==='Number'){
            for (var i=0;i<v;i++) {
                f(i,v);
            }
        }
        else{
            throw new TypeError('该对象不支持遍历');
        }
    }
    function create(tagName,attrs) {
        var el;
        switch (tagName){
            case 'text':
                el = document.createTextNode(attrs);
                break;
            case 'comment':
                el = document.createComment(attrs);
                break;
            case 'fragment':
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
    function createTree(obj) {
        var el = obj.el;
        var childs = obj.childs;
        if(childs){
            each(childs,function (k,v) {
                createTree(v);
                el.appendChild(v.el);
            });
        }
    }
    function addEvent(el,name,handle,b) {
        el.addEventListener(name,handle,b?b:false);
    }
    function delEvent(el,name,handle) {
        el.removeEventListener(name,handle);
    }
    function Throttle(interval,callback) {
        var time;
        this.filter = function (args) {
            if(time&&new Date()-time<interval)
                return;
            time = new Date();
            args?callback(args):callback();
        };
    }
    function changeWH() {
        W = window.innerWidth;
        H = window.innerHeight;
    }
    function setLT(el,L,T) {
        el.style.left = L + 'px';
        el.style.top = T + 'px';
    }
    function setRT(el,R,T) {
        el.style.right = R + 'px';
        el.style.top = T + 'px';
    }
    function setWH(el,W,H) {
        el.style.width = W + 'px';
        el.style.height = H + 'px';
    }
    function LT(el,bxy,exy,time,callback) {
        //state = init | running | pause | finish
        function draw(v,current) {
            v.style.left = current[0] + 'px';
            v.style.top = current[1] + 'px';
        }
        this.el = el;
        this.begin = [bxy[0],bxy[1]];
        this.end = [exy[0],exy[1]];
        this.value = [bxy[0],bxy[1]];
        this.time = time;
        this.state = 'init';
        var runCallback = null;
        var _n = Math.ceil(this.time * 60 / 1000);
        var n = _n;
        var stepX = (exy[0] - bxy[0]) / n;
        var stepY = (exy[1] - bxy[1]) / n;
        var _this = this;
        function change() {
            if(_this.state === 'running'){
                n--;
                _this.value[0] += stepX;
                _this.value[1] += stepY;
                if(n>0){
                    if(n===1){
                        _this.value = _this.end;
                    }
                    draw(el,_this.value);
                    runCallback && runCallback(_this.value);
                    requestAnimationFrame(change);
                }
                else{
                    _this.state = 'finish';
                    callback && callback();
                }
            }
        }
        this.run = function (_callback) {
            if(this.state === 'init' || this.state === 'pause'){
                this.state = 'running';
                runCallback = _callback?_callback:null;
                requestAnimationFrame(change);
            }
        };
        this.pause = function () {
            if(this.state === 'running'){
                this.state = 'pause';
            }
        };
        this.reset = function () {
            if(this.state != 'init'){
                this.state = 'init';
                this.value[0] = bxy[0];
                this.value[1] = bxy[1];
                n = _n;
                draw(el,_this.value);
            }
        };
    }
    function setText(els,texts) {
        each(els.length,function (k,v) {
            els[k].innerText = texts[k];
        });
    }
    function cannotSelect() {
        window.getSelection().removeAllRanges();
    }
    function insert(el,data,_mode) {
        var mode = _mode?_mode:"beforeEnd";
        var arr = type(data)=="Array"?data:[data];
        each(arr,function (k,v) {
            if(type(v)=="String"){
                el.insertAdjacentHTML(mode, v);
            }
            else{
                el.insertAdjacentElement(mode, v);
            }
        });
        return el;
    }
    function show(el) {
        el.style.display = 'block';
    }
    function hide(el) {
        el.style.display = 'none';
    }
    ////////////////////////////////////////////      dom 元素
    var container = create('div',{
        id:'tt_container'
    });
    //region header
    var header = create('header',{
        id:'tt_header'
    });
    var title = create('div',{
        id:'tt_title'
    });
    //endregion

    //region main
    var main = create('div',{
        id:'tt_main'
    });
    var targetWrapper = create('div',{
        id:'tt_targetWrapper'
    });
    var targetList = create('div',{
        id:'tt_targetList'
    });
    var addTarget = create('div',{
        id:'tt_addTarget'
    });
    var preview = create('div',{
        id:'tt_preview'
    });
    var download = create('div',{
        id:'tt_download'
    });
    var close = create('div',{
        id:'tt_close'
    });
    //endregion

    //region targetDetail
    var targetDetail = create('div',{
        id:'tt_targetDetail'
    });
    var fieldset = create('fieldset',{
        id:'tt_fieldset'
    });
    var legend = create('legend',{
        id:'tt_legend',
    });
    var tag1 = create('div',{
        id:'tt_tag1',
        class:'tt_tag'
    });
    var tag2 = create('div',{
        id:'tt_tag2',
        class:'tt_tag'
    });
    var tag3 = create('div',{
        id:'tt_tag3',
        class:'tt_tag'
    });
    var customName = create('input',{
        id:'tt_customName',
        placeholder:'自定义名称'
    });
    var nameOK = create('div',{
        id:'tt_nameOK',
        class:'tt_tag'
    });
    var targetName = create('div',{
        id:'tt_targetName'
    });
    var timeList = create('div',{
        id:'tt_timeList'
    });
    var addBegin = create('div',{
        id:'tt_addBegin'
    });
    var addEnd = create('div',{
        id:'tt_addEnd'
    });
    var confirm = create('div',{
        id:'tt_confirm'
    });
    //endregion

    // region nodeDetail
    var nodeDetail = create('div',{
        id:'tt_nodeDetail'
    });
    var msg = create('div',{
        id:'tt_msg'
    });
    var drawElipse = create('div',{
        id:'tt_drawElipse'
    });
    var drawRect = create('div',{
        id:'tt_drawRect'
    });
    var nodeTime = create('div',{
        id:'tt_nodeTime'
    });
    var elWH = create('div',{
        id:'tt_elWH'
    });
    var elPos = create('div',{
        id:'tt_elPos'
    });
    var nodeConfirm = create('div',{
        id:'tt_nodeConfirm'
    });
    var nodeCancle = create('div',{
        id:'tt_nodeCancle'
    });
    //endregion

    var error = create('div',{
        id:'tt_error'
    });
    var errorMsg = create('div',{
        id:'tt_errorMsg'
    });
    var goBack = create('div',{
        id:'tt_goBack'
    });


    ////////////////////////////////////////////      插件变量
    var cfg = {
        right:10,
        top:10,
        el:null,
        player:null,
        downloadCallback:null
    };
    extend(cfg,_cfg);
    var startX,startY;
    var mouseX,mouseY;
    var posX,posY;
    var elW = cfg.el.clientWidth,
        elH = cfg.el.clientHeight;

    var targets = [];
    var tg,tgPos;
    var elDownX,elDownY;
    var tgElL,tgElT;
    var tgElW,tgElH;
    var tgElDownX,tgElDownY;
    var tgElMoveL,tgElMoveT;

    this.previewWaiting = false;
    var animationList = [];
    var minTime,maxTime,playTime;


    ////////////////////////////////////////////      插件函数
    function setStartXY(x,y) {
        startX = x;
        startY = y;
    }
    function setMouseXY(x,y) {
        mouseX = x;
        mouseY = y;
    }
    function view2view(m,n) {
        var a,b;
        if(m == 1 && n == 2){
            a = new LT(targetWrapper,[0,0],[-360,0],200);
            b = new LT(targetDetail,[360,0],[0,0],200);
        }
        else if(m == 2 && n == 1){
            a = new LT(targetWrapper,[-360,0],[0,0],200);
            b = new LT(targetDetail,[0,0],[360,0],200);
        }
        else if(m == 2 && n == 3){
            a = new LT(targetDetail,[0,0],[-360,0],200);
            b = new LT(nodeDetail,[360,0],[0,0],200);
        }
        else if(m == 3 && n == 2){
            a = new LT(targetDetail,[-360,0],[0,0],200);
            b = new LT(nodeDetail,[0,0],[360,0],200);
        }
        else if(m == 1 && n == 4){
            a = new LT(targetWrapper,[0,0],[-360,0],200);
            b = new LT(error,[360,0],[0,0],200);
        }
        else if(m == 4 && n == 1){
            a = new LT(targetWrapper,[-360,0],[0,0],200);
            b = new LT(error,[0,0],[360,0],200);
        }
        else if(m == 2 && n == 4){
            a = new LT(targetDetail,[0,0],[-360,0],200);
            b = new LT(error,[360,0],[0,0],200);
        }
        else if(m == 4 && n == 2){
            a = new LT(targetDetail,[-360,0],[0,0],200);
            b = new LT(error,[0,0],[360,0],200);
        }
        else if(m == 3 && n == 4){
            a = new LT(nodeDetail,[0,0],[-360,0],200);
            b = new LT(error,[360,0],[0,0],200);
        }
        else if(m == 4 && n == 3){
            a = new LT(nodeDetail,[-360,0],[0,0],200);
            b = new LT(error,[0,0],[360,0],200);
        }
        else{
            throw new ReferenceError('非法的参数');
        }
        a.run();
        b.run();
    }
    function target() {
        this.name = '默认名称';
        this.el = null;
        this.wh = [0,0];
        this.isEllipse = true;
        this.pos = [];
        this.isDel = false;
    }
    function targetPos(time,xy,type) {
        this.time = time;
        this.xy = xy;
        this.type = type;
    }
    function targetsLength() {
        var count = 0;
        each(targets,function (k,v) {
            if(!v.isDel){
                count++;
            }
        });
        return count;
    }
    function doError(text,a,b) {
        errorMsg.innerHTML = text;
        view2view(a,b);
        goBack.onclick = function () {
            view2view(b,a);
        };
        return;
    }
    function setElipse() {
        if(!tg.el){
            tg.isEllipse = true;
            drawElipse.style.borderColor = drawElipse.style.color = 'green';
            drawRect.style.borderColor = '#ccc';
            drawRect.style.color = 'black';
        }
    }
    function setRect() {
        if(!tg.el){
            tg.isEllipse = false;
            drawRect.style.borderColor = drawRect.style.color = 'green';
            drawElipse.style.borderColor = '#ccc';
            drawElipse.style.color = 'black';
        }
    }
    function getTargetMinTime() {
        minTime = 1008601;
        if(targetsLength()==0){
            return 0;
        }
        each(targets,function (k,v) {
            if(!v.isDel){
                each(v.pos,function (k2,v2) {
                    if(v2.time < minTime){
                        minTime = v2.time;
                    }
                });
            }
        });
    }
    function getTargetMaxTime() {
        maxTime = -1;
        if(targetsLength()==0){
            return 0;
        }
        each(targets,function (k,v) {
            if(!v.isDel){
                each(v.pos,function (k2,v2) {
                    if(v2.time > maxTime){
                        maxTime = v2.time;
                    }
                });
            }
        });
    }
    function Animation(el,pos1,pos2,totalTime,startTime) {
        this.el = el;
        this.lt = new LT(el,pos1,pos2,totalTime);
        this.startTime = startTime;
    }
    function getAnimationList() {
        animationList = [];
        each(targets,function (k,v) {
            if(!v.isDel){
                var el = v.el;
                var list = [];
                var tmp = false;
                each(v.pos,function (k2,v2) {
                    if(v2.type === '起'){
                        tmp && list.push(tmp);
                        tmp = [];
                    }
                    tmp.push({
                        time:v2.time,
                        xy:v2.xy
                    });
                });
                list.push(tmp);
                each(list,function (k3,v3) {
                    each(v3.length - 1,function (k4,v4) {
                        animationList.push(new Animation(el,v3[k4].xy,v3[k4 + 1].xy,v3[k4 + 1].time * 1000 - v3[k4].time * 1000,v3[k4].time));
                    });
                });
            }
        });
    }
    function updateAniData() {
        getAnimationList();
        getTargetMinTime();
        getTargetMaxTime();
        playTime = minTime - 5 <= 0 ? 0 : minTime - 5;
    }
    this.previewPause = function () {
        each(animationList,function (k,v) {
            v.lt.pause();
        });
    };
    this.previewRun = function () {
        each(animationList,function (k,v) {
            if(v.lt.state === 'pause'){
                v.lt.run();
            }
        });
    };
    //导出数据结构给后端，一个对象
    this.exportData = function () {
        var data = [];
        each(targets,function (k,v) {
            if(!v.isDel){
                var o = {};
                o.width = v.wh[0]/elW;
                o.height = v.wh[1]/elH;
                o.isEllipse = v.isEllipse;
                o.pos = [];
                each(v.pos,function (k2,v2) {
                    var o2 = {};
                    o2.time = v2.time;
                    o2.x = v2.xy[0]/elW;
                    o2.y = v2.xy[1]/elH;
                    o2.type = v2.type;
                    o.pos.push(o2);
                });
                data.push(o);
            }
        });
        return data;
    };
    ////////////////////////////////////////////      事件
    var _this = this;
    //窗口改变事件
    addEvent(window,'resize',function () {
        changeWH();
    });
    //移动非线性编辑小窗口
    var throttle = new Throttle(30,function (arg) {
        posX = startX + arg[0].clientX - mouseX;
        posY = startY + arg[0].clientY - mouseY;
        posX = posX<-300?-300:posX>W-60?W-60:posX;
        posY = posY<0?0:posY>H-60?H-60:posY;
        setLT(container,posX,posY);
    });
    addEvent(header,'mousedown',function (e) {
        setMouseXY(e.clientX,e.clientY);
        function move(e) {
            cannotSelect();
            throttle.filter(arguments);
        }
        function up() {
            delEvent(document,'mousemove',move);
            delEvent(document,'mouseup',up);
            setStartXY(posX,posY);
        }
        addEvent(document,'mousemove',move);
        addEvent(document,'mouseup',up);
    });
    //新增目标按钮点击
    addEvent(addTarget,'click',function () {
        view2view(1,2);
        tg = new target();
        targetName.innerHTML = '默认名称';
        timeList.innerHTML = 'Nothing!';
    });
    //预览按钮
    addEvent(preview,'click',function () {
        if(targetsLength() === 0){
            return doError('操作失败：目标列表为空，无法预览!',1,4);
        }
        else if(_this.previewWaiting){
            return doError('正在预览中!',1,4);
        }
        else{
            updateAniData();
            _this.previewWaiting = true;
            cfg.player.set(playTime);
            cfg.player.play();
            var i = setInterval(function () {
                if(cfg.player.currentTime > maxTime){
                    clearInterval(i);
                    _this.previewWaiting = false;
                    each(animationList,function (k,v) {
                        hide(v.el);
                        v.lt.reset();
                    });
                    return doError('预览结束!',1,4);
                }
                else{
                    each(animationList,function (k,v) {
                        if(v.lt.state == 'init' && v.startTime <= cfg.player.currentTime ){
                            show(v.el);
                            v.lt.run();
                        }
                    });
                }
            },50);
        }
    });
    //下载按钮
    addEvent(download,'click',function () {
        if(targetsLength() === 0){
            return doError('操作失败：目标列表为空，不能下载!',1,4);
        }
        else{
            cfg.downloadCallback && cfg.downloadCallback();
        }
    });
    //首页取消按钮
    addEvent(close,'click',function () {
        document.body.removeChild(container);
    });
    //名称设置点击候选标签
    each([tag1,tag2,tag3],function (k,v) {
        addEvent(v,'click',function () {
            tg.name = targetName.innerText = this.innerText;

        });
    });
    //自定义名称
    addEvent(nameOK,'click',function () {
        tg.name = targetName.innerText = customName.value?customName.value:'默认名称';
    });
    //鼠标移动事件节流
    var throttle2 = new Throttle(30,function (arg) {
        var x = arg[0].clientX - cfg.el.offsetLeft,
            y = arg[0].clientY - cfg.el.offsetTop;
        x = x>elDownX?x>=elW?elW-2:x:x<0?0:x;
        y = y>elDownY?y>=elH?elH-2:y:y<0?0:y;
        tgElL = x<elDownX?x:elDownX;
        tgElT = y<elDownY?y:elDownY;
        setLT(tg.el,tgElL,tgElT);
        elPos.innerText = '位置：' + tgElL + ',' + tgElT;
        tgElW = Math.abs(x - elDownX);
        tgElH = Math.abs(y - elDownY);
        setWH(tg.el,tgElW,tgElH);
        elWH.innerText = '宽高：' + tgElW + ',' + tgElH;
    });
    var throttle3 = new Throttle(30,function (arg) {
        var x = arg[0].clientX - tgElDownX,
            y = arg[0].clientY - tgElDownY;
        tgElMoveL = tgElL + x;
        tgElMoveT = tgElT + y;
        var maxL = elW - tgElW - 2,
            maxT = elH - tgElH - 2;
        tgElMoveL = tgElMoveL<0?0:tgElMoveL>maxL?maxL:tgElMoveL;
        tgElMoveT = tgElMoveT<0?0:tgElMoveT>maxT?maxT:tgElMoveT;
        elPos.innerText = '位置：' + tgElMoveL + ',' + tgElMoveT;
        setLT(tg.el,tgElMoveL,tgElMoveT);
    });
    //添加起点
    addEvent(addBegin,'click',function () {
        if(tg.pos.length > 0 && tg.pos[tg.pos.length - 1].type === '起'){
            return doError('操作失败：不能连续添加起点!',2,4);
        }
        else if(tg.pos.length > 0 && tg.pos[tg.pos.length - 1].type === '终'){
            view2view(2,3);
            cfg.player.pause();
            tgPos = new targetPos(cfg.player.currentTime,[],'起');
            nodeTime.innerText = '时间：' + new Number(tgPos.time).toFixed(3);
            msg.innerText = '提示：请在视频中拖动画框';
            show(tg.el);
        }
        else{
            tg.pos.length === 0 && setElipse();
            view2view(2,3);
            cfg.player.pause();
            tgPos = new targetPos(cfg.player.currentTime,[],'起');
            nodeTime.innerText = '时间：' + new Number(tgPos.time).toFixed(3);
            msg.innerText = '提示：请在视频中选取目标';
            cfg.el.style.cursor = 'crosshair';
            addEvent(cfg.el,'mousedown',function (e) {
                if(!tg.el){
                    tg.el = create('div',{class:'posAbsolute'});
                    if(tg.isEllipse){
                        tg.el.style.borderRadius = '50%';
                    }
                    cfg.el.appendChild(tg.el);
                    elDownX = e.clientX - cfg.el.offsetLeft;
                    elDownY = e.clientY - cfg.el.offsetTop;
                    setLT(tg.el,elDownX,elDownY);
                    function move(e) {
                        cannotSelect();
                        throttle2.filter(arguments);
                    }
                    function up() {
                        delEvent(document,'mousemove',move);
                        delEvent(document,'mouseup',up);
                        cfg.el.style.cursor = 'default';
                        tg.el.style.cursor = 'move';
                        addEvent(tg.el,'mousedown',function (e) {
                            tgElDownX = e.clientX;
                            tgElDownY = e.clientY;
                            function move2(e) {
                                cannotSelect();
                                throttle3.filter(arguments);
                            }
                            function up2() {
                                delEvent(document,'mousemove',move2);
                                delEvent(document,'mouseup',up2);
                                tgElL = tgElMoveL;
                                tgElT = tgElMoveT;
                            }
                            addEvent(document,'mousemove',move2);
                            addEvent(document,'mouseup',up2);
                        });
                    }
                    addEvent(document,'mousemove',move);
                    addEvent(document,'mouseup',up);
                }
            });
        }
    });
    //添加终点
    addEvent(addEnd,'click',function () {
        if(tg.pos.length === 0){
            return doError('操作失败：没有起点，不能添加终点!',2,4);
        }
        else{
            view2view(2,3);
            cfg.player.pause();
            tgPos = new targetPos(cfg.player.currentTime,[],'终');
            nodeTime.innerText = '时间：' + new Number(tgPos.time).toFixed(3);
            msg.innerText = '提示：请在视频中拖动画框';
            show(tg.el);
        }
    });
    //新增目标提交
    addEvent(confirm,'click',function () {
        if(tg.pos.length === 0){
            view2view(2,1);
        }
        else if(tg.pos[tg.pos.length - 1].type === '起'){
            return doError('操作失败：起点之后必须有终点!',2,4);
        }
        else{
            targets.push(tg);

            var tgNode = create('div',{
                class:'tt_tgNode'
            });
            var name = create('span');
            name.innerText = tg.name;
            var del = create('span');
            del.innerText = '删除';
            if(targetsLength() === 1){
                targetList.innerText = '';
            }
            insert(targetList,insert(tgNode,[name,del]));
            del.tgIndex = targets.length - 1;
            del.onclick = function () {
                targets[this.tgIndex].isDel = true;
                targetList.removeChild(this.parentNode);
                if(targetList.innerHTML ===''){
                    targetList.innerHTML = 'No Target!'
                }
            };
            view2view(2,1);
        }
    });


    //新增节点提交
    addEvent(nodeConfirm,'click',function () {
        if(!tg.el){
            return doError('操作失败：未选取目标!',3,4);
        }
        view2view(3,2);
        tg.wh = [tgElW,tgElH];
        tgPos.xy = [tgElL,tgElT];
        tg.pos.push(tgPos);
        var node = create('div',{
            class:'tt_node'
        });
        var type = create('span');
        type.style.color = tgPos.type == '终'?'red':'green';
        type.innerText = tgPos.type;
        var pos = create('span');
        pos.innerText = '(' + tgPos.xy[0] + ',' + tgPos.xy[1] + ')';
        var time = create('span');
        time.innerText = new Number(tgPos.time).toFixed(3);
        if(tg.pos.length === 1){
            timeList.innerText = '';
        }
        insert(timeList,insert(node,[type,pos,time]));
        hide(tg.el);
        cfg.player.play();
    });
    //取消新增节点
    addEvent(nodeCancle,'click',function () {
        if(tg.pos.length === 0 && tg.el){
            cfg.el.removeChild(tg.el);
            tg.el = null;
        }
        else if(tg.el){
            hide(tg.el);
        }
        view2view(3,2);
    });
    //画椭圆按钮
    addEvent(drawElipse,'click',setElipse);
    //画矩形按钮
    addEvent(drawRect,'click',setRect);
    ////////////////////////////////////////////      其他操作

    //region 设置text
    setText([
        title,
        targetList,
        addTarget,
        preview,
        download,
        close,
        legend,
        tag1,
        tag2,
        tag3,
        nameOK,
        targetName,
        timeList,
        addBegin,
        addEnd,
        confirm,
        msg,
        drawElipse,
        drawRect,
        nodeTime,
        elWH,
        elPos,
        nodeConfirm,
        nodeCancle,
        goBack
    ],[
        '非 线 性 编 辑',
        'No Target!',
        '新增目标',
        '预览',
        '下载',
        '取消',
        '名称设置',
        '嫌疑人',
        '被害人',
        '嫌疑车辆',
        'OK',
        '默认名称',
        'Nothing!',
        '添加起点',
        '添加终点',
        '确定',
        '提示：请在视频中选取目标',
        '画椭圆',
        '画矩形',
        '时间：暂无',
        '宽高：暂无',
        '位置：暂无',
        '确定',
        '取消',
        '返回'
    ]);

    changeWH();
    setRT(container,cfg.right,cfg.top);
    setStartXY(W - 360 - cfg.right,cfg.top);
    createTree({
        el:container,
        childs:[
            {
                el:header,
                childs:[
                    {
                        el:title
                    }
                ]
            },
            {
                el:main,
                childs:[
                    {
                        el:targetWrapper,
                        childs:[
                            {
                                el:targetList
                            },
                            {
                                el:addTarget,
                            },
                            {
                                el:preview,
                            },
                            {
                                el:download
                            },
                            {
                                el:close
                            }
                        ]
                    },
                    {
                        el:targetDetail,
                        childs:[
                            {
                                el:fieldset,
                                childs:[
                                    {
                                        el:legend
                                    },
                                    {
                                        el:tag1
                                    },
                                    {
                                        el:tag2
                                    },
                                    {
                                        el:tag3
                                    },
                                    {
                                        el:customName
                                    },
                                    {
                                        el:nameOK
                                    }
                                ]
                            },
                            {
                                el:targetName
                            },
                            {
                                el:timeList
                            },
                            {
                                el:addBegin
                            },
                            {
                                el:addEnd
                            },
                            {
                                el:confirm
                            }
                        ]
                    },
                    {
                        el:nodeDetail,
                        childs:[
                            {
                                el:msg
                            },
                            {
                                el:drawElipse
                            },
                            {
                                el:drawRect
                            },
                            {
                                el:nodeTime
                            },
                            {
                                el:elWH
                            },
                            {
                                el:elPos
                            },
                            {
                                el:nodeConfirm
                            },
                            {
                                el:nodeCancle
                            }
                        ]
                    },
                    {
                        el:error,
                        childs:[
                            {
                                el:errorMsg
                            },
                            {
                                el:goBack
                            }
                        ]
                    }
                ]
            }
        ]
    });
    document.body.appendChild(container);
};
