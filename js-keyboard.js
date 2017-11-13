;(function (exports) {

    function getProp(el, prop) {
        return window.getComputedStyle(el, null).getPropertyValue(prop);
    }
    var KeyBoard = function (input) {
        var self = input;
        var body = document.getElementsByTagName('body')[0];
        var cursurStartPosition = getTxt1CursorPosition("start");
        var mar_l_Len = parseFloat(getProp(input, 'margin-left'));
        var pad_l_len = parseFloat(getProp(input, 'padding-left'));
        var parent_mar_l_len=parseFloat(getProp(input.parentNode, 'margin-left'));
        var parent_pad_l_len=parseFloat(getProp(input.parentNode, 'padding-left'));
        // var $rootScope= $(document).scope();

        var DIV_ID = '_k_e_y_b_o_a_r_d_divid';
        var cursor_id = "c_u_r_s_o_r_div";
        var count = 0,
            countZero = 0,
            countDot = 0,
            clearTime,
            letterSpace,
            dotSpace;
        letterSpace = getTextWidth(input);
        dotSpace = letterSpace / 2;

        var TABLE_ID = 'table_0909099';
        var mobile = typeof orientation !== 'undefined';

        init();

        function init() {
            document.activeElement.blur();
            if (document.getElementById(DIV_ID)) {
                body.removeChild(document.getElementById(DIV_ID));
            }
            self.el = document.createElement('div');
            self.el.id = DIV_ID;
            //如果光标不存在，创建光标
            if (!document.getElementById(cursor_id)) {
	            self.cur = document.createElement('div');
	            self.cur.id = cursor_id;
	            self.cur.style.position = 'absolute';
	            self.cur.style.left = self.offsetLeft + 'px';
	            self.cur.style.top = self.offsetTop + 'px';
	            self.cur.style.width = '1px';
	            self.cur.style.height = self.offsetHeight + 'px';
	            self.cur.style.zIndex = '20';
	            self.cur.style.border = '1px solid rgb(58, 122, 182)';
	            //在创建光标时递归调用闪烁函数，否则setTimeout会叠加
	            clearTime && clearInterval(clearTime);
	            clearTime = setInterval(function flicker() {
	                if (self.cur) {
	                    if (self.cur.style.border == "1px solid rgb(58, 122, 182)") {
	                        self.cur.style.border = "";
	                    } else {
	                        self.cur.style.border = "1px solid rgb(58, 122, 182)";
	                    }
	                }
	            }, 1200);
            }
            //arrow
            var btnStr = '<div class="arrow-keyboard">';
            btnStr += '<i class="bottom-arrow1"></i>';
            btnStr += '<i class="bottom-arrow2"></i></div>';
            //table
            var tableStr = '<table id="' + TABLE_ID + '" >';
            tableStr += '<tr><td>1</td><td>2</td><td>3</td></tr>';
            tableStr += '<tr><td>4</td><td>5</td><td>6</td></tr>';
            tableStr += '<tr><td>7</td><td>8</td><td>9</td></tr>';
            tableStr += '<tr><td class="special">.</td><td>0</td>';
            tableStr += '<td class="special">删除</td></tr>';
            tableStr += '</table>';
            self.el.innerHTML = btnStr + tableStr;
            body.appendChild(self.cur);
            body.appendChild(self.el);
            self.destory = false;
            if(self.value){
                setCurPos(cursurStartPosition);
            }
            bindEvent();
        }

        function getTextWidth(el,str) {
            var size = getProp(el, 'font-size');
            var fontSize = parseFloat(size);
            var span = document.getElementById("__getwidth");
            if (span == null) {
                span = document.createElement("span");
                span.id = "__getwidth";
                el.parentNode.appendChild(span);
                span.style.position = "absolute";
                span.style.visibility = "hidden";
                span.style.whiteSpace = "nowrap";
            }
            span.innerText = str;
            span.style.fontSize = fontSize + "px";
            return span.offsetWidth;
        }

        function resetPos() {
            cursurStartPosition = getTxt1CursorPosition('start');
            var cur = document.getElementById(cursor_id);
            cur.style.left = self.offsetLeft + 'px';
            cur.style.top = self.offsetTop + 'px';
            cur.style.height = $(self).height() + 'px';

            mar_l_Len = parseFloat(getProp(input, 'margin-left'));
            pad_l_len = parseFloat(getProp(input, 'padding-left'));
            parent_mar_l_len=parseFloat(getProp(input.parentNode, 'margin-left'));
            parent_pad_l_len=parseFloat(getProp(input.parentNode, 'padding-left'));
            setCurPos(cursurStartPosition);
        }

        //获得光标位置
        function getTxt1CursorPosition(locale) {
            var oTxt1 = self;
            var cursurPosition = 0;
            if (oTxt1.selectionStart || oTxt1.selectionEnd) {
                if (locale.toLowerCase() == "start") {
                    cursurPosition = oTxt1.selectionStart;
                } else if (locale.toLowerCase() == "end") {
                    cursurPosition = oTxt1.selectionEnd;
                }
            }
            return cursurPosition;
        }

        function setCurPos(currorPos) {
            var offset = 0, viewValue = self.value,leftString;
            if (currorPos == 0) {
                offset = self.offsetLeft;
                self.cur.style.left=offset+ 'px';
            } else {
                leftString = viewValue.slice(0, currorPos);
                offset = getTextWidth(self, leftString);
                self.cur.style.left = (parent_mar_l_len+parent_pad_l_len+mar_l_Len + pad_l_len + offset) + 'px';
            }
            console.log('setCurPos:offset' + offset + ', margin-left:' + mar_l_Len + ', padding-left:' + pad_l_len);
            
        }

        function addEvent(e) {
            cursurStartPosition = getTxt1CursorPosition('start');
            var ev = e || window.event;
            var clickEl = ev.element || ev.target;
            var value = clickEl.textContent || clickEl.innerText;
            var num = self.value;
            var newNum = 0;
            if (clickEl.tagName.toLocaleLowerCase() === 'td' && value !== "删除") {
                if (self && self.value.length < 12) {
                    newNum = num.substr(0, cursurStartPosition) + value + num.substr(cursurStartPosition, num.length);
                    //第一个数为0，第二个数只能是.，给0计数
                    if (countZero == 0 && newNum[0] == '0') {
                        countZero++;
                    } else if (count == 0 && newNum[1] == '.') {//如果第二个数是"."，则计数
                        count++;
                    } else if (countZero == 1 && count != 1) {//第一个数是0，而第二个数不是"."，则退出
                        return;
                    } else if (count > 0 && newNum[0] == '.') {//如果第一个数是"."，且后面再有"."则退出
                        return;
                    }
                    //小数点后只有两位，不是两位就return，后面语句不执行，否则给文本框赋值
                    if (/^([1-9]\d*|\d*)(\.?\d{0,2})?$/.test(newNum) == false) {
                        //alert("请输入两位小数");
                        return;
                    } else {
                        self.value = newNum;
                        cursurStartPosition++;//光标后移
                        //设置光标位置，输入的是"."还是"0-9"
                        if (value == '.' || countDot > 0) {
                            countDot++;
                        }
                        self.setSelectionRange(cursurStartPosition, cursurStartPosition);
                        setCurPos(cursurStartPosition);
                    }
                } else {
                    return;
                }
            } else if (clickEl.tagName.toLocaleLowerCase() === 'div' || clickEl.tagName.toLocaleLowerCase() === 'i') {
                //没输入值且关闭键盘
                if (self.value != "") {
                    //只有一个"."
                    if (/^\.$/.test(self.value) == true) {
                        self.value = "0" + self.value + "00";
                    } else if (/^\.\d{0,2}$/.test(self.value) == true) {//".1"或".11"
                        if (self.value.length < 3) {
                            self.value = "0" + self.value + "0";
                        } else {
                            self.value = "0" + self.value;
                        }
                    } else if (/^\d+\.$/.test(self.value) == true) {//
                        self.value = self.value + "00";
                    } else if (/^([1-9]\d+|\d)(\.?\d{0,2})?$/.test(self.value) == true) {
                        if (self.value.charAt(self.value.length - 2) == '.') {
                            self.value = self.value + "0";
                        } else {
                            self.value = self.value;
                        }
                    } else {
                        alert("请输入正确金额");
                    }
                }
                _clear();

            } else if (clickEl.tagName.toLocaleLowerCase() === 'td' && value === "删除") {
                if (cursurStartPosition < 1) {
                    return
                } else {
                    if (num) {
                        newNum = num.substr(0, cursurStartPosition - 1) + num.substr(cursurStartPosition, num.length);
                        var deleteNum = num[cursurStartPosition - 1];
                        self.value = newNum;
                        cursurStartPosition--;
                        self.setSelectionRange(cursurStartPosition, cursurStartPosition);
                        setCurPos(cursurStartPosition);//通过光标编号设置模拟光标位置
                    }
                }
                //保证输入的值只能有一个"."
                if (deleteNum == ".") {
                    count = 0;
                    countDot = 0;
                }
                //第一位数是0，第二位只能是"."，控制多个0的无效输入
                if (deleteNum == "0") {
                    countZero = 0;
                }
            }
        }
        function _clear() {
            if(!self.destory){
                clearTimeout(clearTime);
                body.removeChild(self.cur);
                body.removeChild(self.el);
            }
            self.destory = true;
        }
        function bindEvent() {
            if (mobile) {
                self.el.addEventListener('touchstart', function (e) {
                    //全局变量的话，每次只能保持一个对象，导致同时按多个按键时
                    //touchend事件只执行一个，其他键不执行，因此在touchend里申请同样的局部变量。
                    //  ev = e || window.event;
                    // clickEl = ev.element || ev.target;
                    var ev = e || window.event;
                    var clickEl = ev.element || ev.target;
                    e.preventDefault();
                    if (clickEl.localName == 'div') {
                        clickEl.style.backgroundColor = "#8ca5bd";
                        clickEl.childNodes[1].style.borderTop = "10px #8ca5bd solid";
                    } else if (clickEl.localName == 'i') {
                        clickEl.parentNode.style.backgroundColor = "#8ca5bd";
                        clickEl.style.borderTop = "10px #8ca5bd solid";
                    } else {
                        clickEl.style.backgroundColor = "#8ca5bd";
                    }
                });
                self.el.addEventListener('touchmove', function (e) {
                    var ev = e || window.event;
                    event.preventDefault();
                    var clickEl = ev.element || ev.target;
                    clickEl.style.backgroundColor = "#8ca5bd";
                });
                self.el.addEventListener('touchend', function (e) {
                    var ev = e || window.event;
                    var clickEl = ev.element || ev.target;
                    addEvent(e);
                    if (clickEl.innerText == '删除' || clickEl.innerText == '.') {
                        clickEl.style.backgroundColor = "#D3D9DF";
                    } else {
                        clickEl.style.backgroundColor = "white";
                    }
                });
            } else {
                self.el.addEventListener('click', function (e) {
                    addEvent(e);
                });
            }
            // 监听 orientation changes
            var noChangeCountToEnd = 100,
                noEndTimeout = 1000;
            window.addEventListener("orientationchange", function (event) {
                var interval,
                    timeout,
                    end,
                    lastInnerWidth,
                    lastInnerHeight,
                    noChangeCount;
                end = function () {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    interval = null;
                    timeout = null;
                    resetPos();
                };
                interval = setInterval(function () {
                    if (window.innerWidth === lastInnerWidth && window.innerHeight === lastInnerHeight) {
                        noChangeCount++;
                        if (noChangeCount === noChangeCountToEnd) {
                            end();
                        }
                    } else {
                        lastInnerWidth = window.innerWidth;
                        lastInnerHeight = window.innerHeight;
                        noChangeCount = 0;
                    }
                });
                timeout = setTimeout(function () {
                    end();
                }, noEndTimeout);


            }, false);
            //当前 URL 的锚部分(以 '#' 号为开始) 发生改变时触发
            window.addEventListener('hashchange', function (event) {
                _clear();
            });
        }

    }
    exports.KeyBoard = KeyBoard;

})(window);
