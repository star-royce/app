layui.define(function (exports) {
    const message = {
        background: '', // 背景颜色
        color:'',//字体颜色
        outside: '', // 外框元素
        inside: '', // 信息显示元素
        describe:'',//具体描述显示元素
        insideSetTime: '', // 信息移除setTime
        body: '', // body元素
        time: 0, // 显示时间
        run(msg = "success", describe="", type = 'success', time = 2000) {
            // 显示时间
            this.time = time;

            // 背景色
            this.background = this.backgroundCheck(type)
            this.color = this.colorCheck(type)
            console.log("背景色：" + this.background);
            console.log("字体颜色：" + this.color);
            //提示图片
            let picture = this.pictureCheck(type)
            console.log("picture：" + this.picture);
            // body
            this.body = document.body;

            // 时间戳id
            let id = 'inside_box' + Date.now();

            // 检查是否存在外框
            let outsideShow = document.getElementById('message_box_show');
            if (outsideShow != null) {
                // 文字显示区域
                this.inside = document.createElement('div');
                this.inside.setAttribute('class', 'message_box_inside cc-display')
                this.inside.setAttribute('id', id)
                this.inside.style.backgroundColor = this.background;
                this.inside.style.color = this.color;
                if (describe != '') {
                    this.inside.innerHTML = `<div class="message_box_message"><span>${picture}${msg}</span></div><div class="message_box_describe cc-display"><span>${describe}</span></div>`
                }
                else {
                    this.inside.innerHTML = `<div class="message_box_message"><span>${picture}${msg}</span></div>`
                }
           
                outsideShow.appendChild(this.inside);

                //if (describe != '') {
                //    this.describe = document.createElement('div');
                //    this.describe.setAttribute('class', 'message_box_describe cc-display')
                //    this.describe.innerHTML = `<span>${describe}</span>`
                //    this.inside.appendChild(this.describe);
                //}
      

            } else {
                // 最外框
                this.outside = document.createElement('div');
                this.outside.setAttribute('id', 'message_box_outside')
                this.outside.setAttribute('class', 'cc-display')

                // 中间区域
                outsideShow = document.createElement('div');
                outsideShow.setAttribute('id', 'message_box_show');

                // 文字显示区域
                this.inside = document.createElement('div');
                this.inside.setAttribute('class', 'message_box_inside cc-display')
                this.inside.setAttribute('id', id)
                this.inside.style.backgroundColor = this.background;
                this.inside.style.color = this.color;
                if (describe != '') {
                    this.inside.innerHTML = `<div class="message_box_message"><span>${picture}${msg}</span></div><div class="message_box_describe cc-display"><span>${describe}</span></div>`
                }
                else {
                    this.inside.innerHTML = `<div class="message_box_message"><span>${picture}${msg}</span></div>`
                }
      

                // 显示
                outsideShow.appendChild(this.inside);
                this.outside.appendChild(outsideShow);
                this.body.appendChild(this.outside);

                //if (describe != '') {
                //    this.describe = document.createElement('div');
                //    this.describe.setAttribute('class', 'message_box_describe cc-display')
                //    this.describe.innerHTML = `<span>${describe}</span>`
                //    this.inside.appendChild(this.describe);
                //}
            }

            // 添加监听
            this[id] = this.insideTime(this.inside, outsideShow);
            this.boxShowTime(this.inside, id, outsideShow);
        },

        // 信息显示区域展示
        boxShowTime(inside, insideSetTime, outsideShow) {
            inside.addEventListener('mouseleave', () => {
                // 离开后设置隐藏时间
                this[insideSetTime] = this.insideTime(inside, outsideShow);
            })
            inside.addEventListener('mouseenter', () => {
                // 清除隐藏设置
                clearTimeout(this[insideSetTime]);
            })
        },

        // 信息区显示
        insideTime(inside, outsideShow) {
            let insideSetTime = setTimeout(() => {
                outsideShow.removeChild(inside);
            }, this.time);
            return insideSetTime;
        },

        // 判定显示颜色
        backgroundCheck(type) {
            if (type === 'success') return '#FFFFFF';
            if (type === 'error') return '#FFFFFF';
            if (type === 'warning') return '#FFFFFF';
            // if (type === 'info') return '#909399';
            return '#FFFFFF'; // 默认级别
        },
        // 判定字体颜色
       colorCheck(type) {
           if (type === 'success') return '#07C160';
           if (type === 'error') return ' #FF5555';
           if (type === 'warning') return ' #FF5555';
            // if (type === 'info') return '#909399';
           return '#07C160'; // 默认级别
        },

        pictureCheck(type) {
            if (type === 'success') return '<img class="picture" src="/images/hint/success.png"/>';
            if (type === 'error') return '<img class="picture" src="/images/hint/warn.png"/>';
            if (type === 'warning') return '<img class="picture" src="/images/hint/warn.png"/>';
    
            return '<img class="picture" src="/images/hint/success.png"/>'; // 默认级别
        }
    }
    exports("message", message);
})