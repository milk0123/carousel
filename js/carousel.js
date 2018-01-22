/**
 *  carousel 轮播图对象
 */

 var carousel = {
  // 公共属性
  carouselItem: null,       // 轮播的每个元素
  leftBtn: null,            // 左按钮
  rightBtn: null,           // 右按钮
  carouselMark: null,       // 蒙版
  markImg: null,            // 蒙版图片
  opacities: null,          // 轮播元素的透明度
  zIndex: null,             // 每个元素的z-index
  difX: 100,                // 每个元素的translateX 的差值
  difZ: 40,                 // 每个元素的translateZ 的差值
  canNextAni: true,         // 下一次动画是否允许执行
  nextAniTime: 200,         // 前后动画的间隔时间
  isAutoPlay: true,         // 是否自动播放(默认自动播放)
  autoPlayTime: 2000,       // 自动轮播的间隔时间
  animationId: null,        // 自动轮播的动画 id,
  isMarkShow: false,        // 蒙版是否显示(默认没显示)

  // 方法
  init: function(itemClassName, leftClassName, rightClassName, markClassName, markImgClassName) {
    /**
     *  初始化公共属性，轮播图 和 绑定元素事件
     *  @param {String} itemClassName    - 轮播图元素的类名
     *  @param {String} leftClassName    - 左按钮元素的类名
     *  @param {String} rightClassName   - 右按钮元素的类名
     *  @param {String} markClassName    - 蒙版元素的类名
     *  @param {String} markImgClassName - 蒙版图片的类名
     */

    // 检测类名是否传入
    var itemClassName = itemClassName || '';
    var leftClassName = leftClassName || '';
    var rightClassName = rightClassName || '';
    var markClassName = markClassName || '';
    var markImgClassName = markImgClassName || '';
    if (!itemClassName && 
        !leftClassName && 
        !rightClassName && 
        !markClassName && 
        !markImgClassName) {
      return '初始化失败,请传入参数';
    }

    // 初始化公共属性
    this.carouselItem = this.getCarouselItem(itemClassName);
    this.leftBtn = this.getElement(leftClassName);
    this.rightBtn = this.getElement(rightClassName);
    this.carouselMark = this.getElement(markClassName);
    this.markImg = this.getElement(markImgClassName);
    this.opacities = [0.1,0.4, 0.8, 1, 0.8, 0.4, 0.2];
    this.zIndex = [-3,-2,-1,1,-1,-2,-3];

    // 初始化轮播图
    this.initCarousel();
    
    // 是否自动播放轮播图
    if (this.isAutoPlay) {
      this.autoPlay();
    }

    // 绑定元素事件
    this.bindEvent();

  },
  initCarousel: function() {
    /**
     *  初始化轮播图
     */
    var items = this.carouselItem;                    // 轮播图的元素对象
    var middle = Math.floor(items.length / 2);        // 轮播元素的中间元素
    var opacities = this.opacities;                   // 轮播元素的透明度
    var zIndex = this.zIndex;                         // 设定每个元素的z-index
    var difX = this.difX;                             // 每个元素的 x 的差值
    var difZ = this.difZ;                             // 每个元素的 z 的差值
    var middleX = 0;                                  // 元素相差的dif 个数
    // 中间元素初始化
    items[middle].style['z-index'] = zIndex[middle];
    items[middle].style['opacity'] = opacities[middle];
    items[middle].style.transform = 'translateX('+ difX * middleX +'px) translateZ(-'+ difZ * middleX +'px)';
    // 左边
    for (var i = middle-1; i >= 0; i--) {
      --middleX;
      items[i].style['z-index'] = zIndex[i]
      items[i].style['opacity'] = opacities[i];
      items[i].style.transform = 'translateX('+ difX * middleX +'px) translateZ(-'+ difZ * Math.abs(middleX) +'px)';
    }
    middleX = 0;
    // 右边
    for (var i = middle+1; i < items.length; i++) {
      --middleX;
      items[i].style['z-index'] = zIndex[i]
      items[i].style['opacity'] = opacities[i];
      items[i].style.transform = 'translateX('+ difX * Math.abs(middleX) +'px) translateZ(-'+ difZ * Math.abs(middleX) +'px)';
    }

  },
  bindEvent: function() {
    /**
     *  绑定元素的事件，集中绑定
     */
    var _this = this;                                       // 绑定 this

    this.leftBtn.addEventListener('click', function() {     // 绑定左按钮点击事件
      _this.toMove('left');
    }, false);

    this.leftBtn.addEventListener('mouseover', function() { // 绑定左按钮滑入事件
      clearInterval(_this.animationId);                     // 取消自动播放
    }, false);

    this.leftBtn.addEventListener('mouseout', function() { // 绑定左按钮滑出事件
      _this.autoPlay()                                     // 取消自动播放
    }, false);

    this.rightBtn.addEventListener('mouseover', function() {// 绑定右按钮滑入事件
      clearInterval(_this.animationId);                     // 取消自动播放
    }, false);

    this.rightBtn.addEventListener('mouseout', function() {// 绑定右按钮滑出事件
      _this.autoPlay()                                     // 取消自动播放
    }, false);

    this.rightBtn.addEventListener('click', function() {    // 绑定右按钮点击事件
      _this.toMove('right');
    }, false);

    for (var i = 0, items = this.carouselItem; i < items.length; i++) {
      items[i].addEventListener('click', function() {       // 绑定元素点击事件
        _this.clickSwitch(this);
      }, false);             
    }
    
    for (var i = 0, items = this.carouselItem; i < items.length; i++) {
      items[i].addEventListener('mouseover', function() {   // 绑定元素滑入事件事件
        clearInterval(_this.animationId);                   // 取消自动播放
      }, false);             
    }

    for (var i = 0, items = this.carouselItem; i < items.length; i++) {
      items[i].addEventListener('mouseout', function() {    // 绑定元素滑出事件
        if (!_this.isMarkShow) {                            // 蒙版未显示时移出自动播放
          _this.autoPlay()                                  // 自动播放
        }
      }, false);             
    }

    this.carouselMark.addEventListener('click', function() {// 蒙版的点击事件
      _this.isMarkShow = false;                             // 清除元素滑出事件的限制
      _this.autoPlay();                                     // 自动轮播
      this.style.display = 'none';                          // 隐藏蒙版
    }, false);

    this.markImg.addEventListener('click', function(e){     // 蒙版图片的点击事件
      e.stopPropagation();                                  // 阻止事件冒泡
    }, false);
  },
  clickSwitch: function(_this) {
    /**
     *  元素点击切换轮播图或放大当前项
     *  @param {Object} _this - 当前点击项的this
     */
    var items = this.carouselItem;                          // 轮播图总元素
    var active = Math.floor(items.length / 2);              // 当前的活动项
    var current = _this.getAttribute('data-index');         // 当前项的下标
    var moveD = (active - current) < 0 ? 'right' : 'left';  // 移动的方向
    var moveT = Math.abs(active - current);                 // 轮播的次数
    if (current != active) {                                // 点击项不是活动项时移动
      for(var i = 0; i < moveT; i++) {
        this.toMove(moveD, moveT);
      }
    }
    else {                                                  // 点击项时活动项时图片放大
      this.isMarkShow = true;                               // 限制元素的 mouseout 事件的触发
      clearInterval(this.animationId);                      // 取消自动播放
      var url = _this.getAttribute('src');                  // 获取图片地址
      this.markImg.setAttribute('src', url);                // 设置蒙版图片地址为当前图片地址
      this.carouselMark.style.display = 'flex';             // 显示蒙版
    }
  },
  autoPlay: function() {
    /**
     *  自动播放轮播图
     */
    var moveD = 'right';                                    // 默认方向是向右
    var moveT = 1;                                          // 轮播次数一次
    this.animationId = setInterval(() => {                  // 自动轮播
      this.toMove(moveD, moveT);
    }, this.autoPlayTime)
  },
  toMove:function(dir, totle) {
    /**
     *  轮播图滚动的方法，每次轮播图轮播一次
     *  @param {String} dir - 轮播的方向 left / right
     *  @param {Number} totle - 轮播的总次数, 默认一次
     */
    var _this = this;                                 // 保存轮播对象的 this
    if (!this.canNextAni) {                           // 在规定时间内不可以执行下一次动画
      return;
    }
    this.canNextAni = false;                          // 限制下一次动画的执行
    var totle = totle || 1;                           // 默认轮播一次啊
    var items = this.carouselItem;                    // 轮播图的元素对象
    var opacities = this.opacities;                   // 轮播元素的透明度
    var zIndex = this.zIndex;                         // 设定每个元素的z-index
    var difX = this.difX;                                   // 每个元素的 x 的差值
    var difZ = this.difZ;                                    // 每个元素的 z 的差值
    var reg = /-?\d+/g;                               // 正则匹配
    var messageArr = null;                            // 元素的 style 信息
    var formatNum = {                                 // 根据方向格式化数值
      right: function(val) {
        return -val;
      },
      left: function(val) {
        return val;
      }
    };
    var element, x, z, zIndex, index;                 // 临时变量 element: 存放每个元素的 style 信息，x：translateX的值， z：transLateZ 的值，zIndex： z-index的值， index： 自定义下标data-index 的值
    
    for(var j = 0; j < totle; j++) {                  // 轮播的总次数
      messageArr = this.getItemMessage(items);        // 每次都获取元素的 style 信息
      
      for (var i = 0; i < items.length; i++) {        // 进行轮播
        element = messageArr[i];                      
        x = element[0] + formatNum[dir](difX);  // 根据方向算出 transLateX 的 x 值
        z = element[1] + difZ;                        // transLateZ 的 z 值
        index = parseInt(element[2]) + formatNum[dir](1); // 计算出data-index 的值
        
        if(dir === 'right') {                   // right 的边界判断
          if ( index >= 0 && index < 3) { 
            z = element[1] - difZ;
          }
          else if ( index < 0) { 
            x = 300; 
            z = -120;
            index = element[2] = 6;
          }
        }
        else {                                        // left 的边界判断
          if ( index > 3 && index < 7) {
            z = element[1] - difZ;
          }
          else if ( index == 7) {
            x = -300; 
            z = -120;
            index = 0;
          }
        }
        // 设置
        items[i].style['z-index'] = zIndex[index]
        items[i].style['opacity'] = opacities[index];
        items[i].setAttribute('data-index', index);
        items[i].style.transform = 'translateX('+ x  +'px) translateZ('+ z +'px)';
      }
      // 两个动画的间隔时间
      setTimeout(function() {
        _this.canNextAni = true;
      }, _this.nextAniTime);
    }
  },
  getItemMessage: function(items) {
    /**
     *  获取每个轮播元素的 style 信息
     *  @param {Array} items - 轮播元素的数组
     *  @return {Array} - 返回每个元素的 style 信息
     */
    var reg = /-?\d+/g;         // 通过正则获取数字
    var messageArr = [];        // 返回一个对象数组
    var obj = {};               // 对象临时变量，进行存储元素信息
    var arr = [];               // 保存元素信息，字符串分割后的信息     
    // 获取每个元素的 style 信息
    for(var i = 0; i < items.length; i++) {
      // 将元素的 transfrom 信息进行分割
      arr = items[i].style.transform.split(' ');
      // 初始化空对象
      obj = Object.assign({})
      // 通过正则匹配元素的 transform 属性的数值，并导入到 obj 对象中
      for(var j = 0; j < arr.length; j++) {
        // obj 对象属性 0 存放的是 transLateX 的数值，属性 1 存放的是 transLateZ 的数值
        obj[j] = parseInt(arr[j].match(reg)[0]);
      }
      // 属性 2 存放的是 z-index 自定义属性的值
      obj[j] = items[i].getAttribute('data-index');
      // 将元素信息添加到数组中
      messageArr.push(obj)
    }

    return messageArr;
  },
  getCarouselItem: function(className) {
    /**
     *  通过类名获取轮播的元素
     *  @param {String} className - 类名
     *  @return {Array} - 元素类数组
     */
    var className = className || '';
    if (!className) {
      return null;
    }
    var items = document.getElementsByClassName(className);

    return items;
  },
  getElement: function(className) {
    /**
     *  获取元素
     *  @param {String} className - 元素类名
     *  @return {Object} - 包含元素的对象
     */
    var className = className || '';
    if (!className) {
      return null;
    }
    var element = document.getElementsByClassName(className)[0];
    
    return element;
  }
 }

 export default carousel