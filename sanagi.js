/**
 * Created by Sanagi on 2017/11/1.
 */
(function(){
    //dom 动画
    var sanagi = {};
    window.sanagi = sanagi ;
    sanagi.addAnimate = function(){
        HTMLElement.prototype.timer=null;
        // 与jq 的 animate 类似
        HTMLElement.prototype.animate = function(attrObj,speed,fn) {
         var curValue;      //当前某属性的值
         var _this = this;
         var stepObj = {};      //用来记录每个属性应改变的大小、为0时说明属性已达到目标大小
         if(speed > 1) speed = 1;
         clearInterval(_this.timer);
         function getStyle(attr) {
             if (getComputedStyle) {
                 return getComputedStyle(_this, false)[attr]
             } else {
                 return this.currentStyle[attr];
             }
         }
         function checkEnd(){        //检测是否所有属性都修改完
             for(var o in stepObj){
                 if(stepObj[o] != 0)
                    return false;
             }
             return true;
         }

         _this.timer = setInterval(function () {
             for (var attr in attrObj)
             {
                 if (attr == 'opacity') {
                     curValue = Math.round(getStyle(attr) * 100)
                 } else {
                     curValue = parseInt(getStyle(attr));
                 }

                 var des = parseInt(attrObj[attr])      // 目的属性值
                 var step = (parseInt(attrObj[attr]) - curValue) * speed;      //将当前所需要修改的值存入obj中
                 step = step > 0 ? Math.ceil(step) : Math.floor(step);
                 stepObj[attr] = step;

                 if (attr == 'opacity') {
                     _this.style[attr] = (curValue + step) / 100
                     if (step == 0) {
                         _this.style[attr] = des / 100;
                     }
                 } else {
                     _this.style[attr] = curValue + step + 'px';
                     if (step == 0) {
                         _this.style[attr] = des + 'px';
                     }
                 }
             }
             if(checkEnd()){
                 clearInterval(_this.timer);
                 if (fn){
                     fn();
                 }
             }
         },30)
     }
    }

    sanagi.addMove = function(){
        var mouseX,mouseY
        var boxX,boxY;
        var _this;
        var box;

        function getMoveParent(d){
            while(d.tagName != 'BODY'){
                var cls = d.getAttribute('class');
                if(cls.indexOf('can-move')>=0){
                    return d;
                }
                d = d.parentNode;
            }
        }
        function boxMove(e) {
            if (_this && _this._moving) {
                var curX, curY;
                e = e || window.event;
                curX = e.pageX;
                curY = e.pageY;

                box.style.left = curX - mouseX + boxX + 'px';
                box.style.top = curY - mouseY + boxY + 'px';
            }
        }
        var dom = document.querySelectorAll('.can-move')
        document.onmousemove = boxMove;
        console.log(dom[0].querySelectorAll('.can-drag')[0])
        for(var j=0;j<dom.length;j++) {
            var controllors = dom[j].querySelectorAll('.can-drag')  //获取每一个 can-move-box 的容器下的.can-drag
            if (!dom || !controllors) return
            for (var i=0;i<controllors.length;i++) {
                controllors[i].onmousedown = function (e) {
                    _this = this;
                    _this._moving = true
                    box = getMoveParent(_this)

                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    mouseX = parseInt(e.pageX);
                    mouseY = parseInt(e.pageY);
                    boxX = parseInt(box.offsetLeft)
                    boxY = parseInt(box.offsetTop);
                }

                controllors[i].onmouseup = function (e) {
                    _this._moving = false;
                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                }
            }
        }

    }

    //常用功能
    sanagi.addUsual = function(){
        //用文本创建HTML dom元素
        document.createHtmlNode = function(htmlstr){ //使用text创建dom
            var div = document.createElement('div');
            div.innerHTML = htmlstr;
            return div.childNodes;
        }
        //字符format 方法
        String.prototype.format = function(args){
        var result = this;
        if(arguments.length > 0){
            if(arguments.length == 1 && typeof (args) == 'object'){
                for(var key in args){
                    if(args[key] !=undefined){
                        var reg = new RegExp("\\{" + key +"\\}");
                        result = result.replace(reg,args[key])
                    }
                }
            }else{
                for(var i=0;i<arguments.length;i++){
                    if(arguments[i] != undefined){
                        var reg = new RegExp("\\{" + i + "\\}");
                        result = result.replace(reg,arguments[i]);
                    }
                }
            }
        }
        return result;
    }
    }

     //添加自动启动功能
    sanagi.addFunc = function() {
        var old;
        for(var i in arguments) {
            var args = arguments
            if (typeof(window.onload) != 'function') {
                window.onload = arguments[i];
            } else {
                old = window.onload;
                window.onload = function () {
                    old();
                    args[i]();
                }
            }
        }
    }

    // 需要添加的功能

    sanagi.addUsual();
    sanagi.addAnimate();
    sanagi.addFunc(sanagi.addMove);
})()
