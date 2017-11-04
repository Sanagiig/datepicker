/**
 * Created by Sanagi on 2017/10/30.
 */
function datepicker(){
    var _this = this;
    _this.dateDom = ''; // ui-datepicker-wraper  DOM
    _this.dateBox = ''; //  datepicker-card-box
    _this.cardWidth = '';
    _this._moving = '';
    _this.curYear = '';
    _this.curMonth = '';
    _this.curIndex = '';    // 当前的页数
    //生成日期数据
    function getMonthData(year,month){
        //需要注意 ，使用 Date 时 它接受的月份参数是 “真实月份-1”
        //Date(2017,10,0)   为上个月（10月）的最后一天
        year = year || _this.curYear;
        month = month || _this.curMonth;
        if(year < 1990 || month >12 || month <1){
            return false;
        }
        var prevYear,prevMonth,nextYear,nextMonth;  // 如果是1月和12月 ，需要用到上/下一年的年份做计算
        if(month == 1){
            prevYear = year - 1;
            prevMonth = 12;
        }else if(month == 12){
            nextYear = year +1;
            nextMonth = 1;
        }

        prevYear = prevYear || year;
        prevMonth = prevMonth || month -1;
        nextYear = nextYear || year;
        nextMonth = nextMonth || month +1;

        var firstWeek = new Date(year,month -1 ,1).getDay();
        if(firstWeek == 0) firstWeek = 7;
        var prevMonthLastDay = new Date(prevYear,prevMonth ,0).getDate() //上个月的最后一天是几号
        var prevMonthStart = prevMonthLastDay -  (firstWeek-1) + 1; //上个月的天数 - (本月的1号星期几 -1) + 1 = 本页日历显示的起始号码
        var curMonthDayCount = new Date(year,month ,0).getDate();
        var nextMonthDayCount = 42 - curMonthDayCount - (prevMonthLastDay - prevMonthStart +1)  //上个月结束号 - 上个月起始号 +  + 1 = 上个月在日历出现的天数
        var MonthData = [];
        var Data = function(){
            this.prototype = {
                year:'',
                month:'',
                date:'',
                week:'',
                status:'',
            };
        }
        //生成 上、本、下月的日历内容
        for(var i = prevMonthStart;i<=prevMonthLastDay;i++){
            var d = new Data();
            d.year = prevYear
            d.month = prevMonth;
            d.date = i;
            d.week = (MonthData.length +1) % 7
            if(d.week == 0) d.week = 7;
            d.status = 'prevMonth';
            MonthData.push(d);

        }

        for(var i = 1;i<=curMonthDayCount;i++){
            var d = new Data();
            var now = new Date();
            var thisDay = new Date(year,month,i);

            d.year = year
            d.month = month;
            d.date = i;
            d.week = (MonthData.length +1) % 7
            if(d.week == 0) d.week = 7;

            if(now.getFullYear() == year && now.getMonth() +1 == month && now.getDate() == thisDay.getDate()){
                d.status = 'today';
            }else{
                d.status = 'curMonth';
            }
            MonthData.push(d);
        }

        for(var i = 1;i<=nextMonthDayCount;i++){
            var d = new Data();
            d.year = nextYear;
            d.month = nextMonth;
            d.date = i;
            d.week = (MonthData.length +1) % 7
            if(d.week == 0) d.week = 7;
            d.status = 'nextMonth';
            MonthData.push(d);
        }
        return MonthData;
    }
    //创建一张日历卡片
    function createCard(year,month){
        //整体的日历卡片 以table 元素显示
        var html =
        '<div class="ui-detepicker-header can-drag">'+
            '<span class="ui-datepicker-curr-month">'+ year +'年 '+ month +'月</span>'+
        '</div>'+
        '<div class="ui-datepicker-body">'+
            '<table>'+
                '<thead>'+
                    '<th>一</th>'+
                    '<th>二</th>'+
                    '<th>三</th>'+
                    '<th>四</th>'+
                    '<th>五</th>'+
                    '<th>六</th>'+
                    '<th>日</th>'+
                '</thead>'+
                '<tbody>'+
                '</tbody>'+
            '</table>'+
        '</div>'

        var tBody ='';
        var riliDate = getMonthData(year,month)

        for(var i =0;i< riliDate.length;i++){       //添加日期的格子
            var temp='';
            if(i == 0){
                temp = '<tr><td class="{0}">'+ riliDate[i].date +'</td>'
            }else if(i == riliDate.length-1){
                temp ='<td class="{0}">'+ riliDate[i].date +'</td>'+'</tr>'
            }else if(i%7 == 6){
                temp = '<td class="{0}">'+ riliDate[i].date + '</td>' + '</tr><tr>'
            }else{
                temp = '<td class="{0}">'+ riliDate[i].date +'</td>'
            }

            if(riliDate[i].status == 'today'){
                temp =temp.format('today')
            }else if(riliDate[i].status == 'curMonth'){
                temp=temp.format('cur-month')
            }else{
                temp=temp.format('not-cur-month')
            }
            tBody += temp
        }
        var div = document.createElement('div')
        div.setAttribute('class','datepicker-card')
        div.innerHTML = html
        div.querySelector('tbody').innerHTML = tBody;
        return div
    }
    //创建日历卡片的容器
    function createBox(){
        _this.dateBox = document.createElement('div')
        _this.dateBox.setAttribute('class', 'ui-datepicker-box')      //box 为多个日历的容器
        return _this.dateBox
    }
    //构建整个datepicker
    function build(year){
        if(! _this.dateDom) return
        year = year || _this.curYear;
        _this.dateDom.innerHTML = '';
        //生成左右按钮
        var btnhtml = '<span class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</span>' +
                '<span  class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</span>'
        var btn = document.createHtmlNode(btnhtml);
        var prevY = year - 1
        var nextY = year + 1
        var box = createBox()
        box.append(createCard(prevY,12))
        for(var i =1 ;i<=12;i++)
            box.append(createCard(year,i));
        box.append(createCard(nextY,1))
        _this.dateDom.append(btn[0],btn[1]);  // 添加左右按钮到 datepicker元素中
        _this.dateDom.append(box);

        _this.dateDom.DOMsub

        //上一个月
        _this.dateDom.querySelector('.ui-datepicker-prev-btn').onclick = function (e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            _this.goPrevMonth();
        }
        //下一个月
        _this.dateDom.querySelector('.ui-datepicker-next-btn').onclick = function (e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();
            _this.goNextMonth();
        }

        //自定义年月的功能
        var title = _this.dateDom.querySelectorAll('.ui-datepicker-curr-month')
        for(var i=0;i<title.length;i++) {
            title[i].onclick = function(e) {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation();
                if (!confirm('是否手动输入年月 ？')) return
                var year = prompt('请输入年份')
                var month = prompt('请输入月份')
                if (month > 12 || month < 0 || year < 1900 || year > 3000) {
                    alert('输入的数字不合法（month>12 || month<0 || year < 1900 || year > 3000）')
                } else if(year == _this.curYear){
                    _this.curMonth = month;
                    goMonth(month)
                }else{
                    _this.curYear = year;
                    _this.curMonth = month;
                    _this.reload(month-1);
                    goMonth(month);
                }
            }
        }
    }
    //根据index 设置当前年月
    function setMonth(index){
        _this.curMonth = index + 1
        if(index == 0){
            _this.curYear -= 1;
            _this.curMonth = 12
        }else if(index == 13){
            _this.curYear += 1;
            _this.curMonth = 1;
        }
    }
    // 以动画形式切换日历页面
    function switchDateCard(index){
        if(index >13 || index <0) {
            alert('暂不支持火星日历。')
            return;
        }
        _this._moving = true
        setMonth(index);
        _this.dateBox.animate({'left':index * -_this.cardWidth},0.1,function(){_this._moving = false})
    }
    // 静态切换日历页面
    function showDateCard(index){
        datepicker._moving = true
        _this.dateBox.style.left = index * - _this.cardWidth + 'px';
    }
    //跳转到某月的日历页面，当index 为 -1 或者14（超过日历box的内容），则会自动生成上|下一年的日历，并且定位
    function goMonth(index){
        var curIndex = _this.curIndex = index;
        if(curIndex == -1){
            _this.curIndex  = 11
            _this.reload(12);
        }else if(curIndex == 14){
            _this.curIndex = 2;
            _this.reload(1);
        }
        switchDateCard(_this.curIndex);
    }
    this.goPrevMonth = function(){
        _this.curIndex --;
        goMonth(_this.curIndex);
    }
    this.goNextMonth = function(){
        _this.curIndex ++;
       goMonth(_this.curIndex);
    }
    this.goIndexMonth = function(index){
        switchDateCard(index)
    }
    this.init = function(dom){
        //因为有可能会重新加载，所以值会做‘空值’判断
        _this.cardWidth = 280;
        _this._moving = false;
        _this.curYear = _this.curYear || new Date().getFullYear();
        _this.curMonth =  _this.curMonth ||new Date().getMonth()+1;
        _this.curIndex = _this.curMonth;
        _this.dateDom = _this.dateDom || document.querySelector(dom) || document.querySelector('.ui-datepicker-wraper')
        build()
        goMonth(_this.curIndex)
    }
    //重新载入日历，并且能选择当前显示的月份
    this.reload = function(index){
        index = index || _this.curIndex
        build();
        showDateCard(index);
        sanagi.addMove();
    }
}