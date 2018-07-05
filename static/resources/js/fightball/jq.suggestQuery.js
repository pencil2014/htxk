
/**
 * Created by dell on 2017/3/24.
 */
/**
 * param:
 *  url json 数据post url
 *
 *
 * 城市模糊匹配jq 插件 suggestQuery
 *依赖jquery 1.11.3
 *
 * tip:js调用时用id选择器
 *
 *用法实例
 *
 <div class="search-query-box " id="aa">
 <input type="text" class="search-query city-key" >
 </div>



 css
 .search-query-box {
      position: relative;
      display: inline-block;
    }

 .search-query-box ul {
      position: absolute;
      width: 100%;
      top: 30px;
      left: 0px;
      border: 1px solid #03A87C;
      padding: 12px 0;
      border-radius: 0 0 5px 5px;
      display: none;
    }

 .search-query-box ul li {
      height: 36px;
      line-height: 36px;
      padding-left: 24px;
      cursor: pointer;
    }

 .search-query-box ul li .add-color {
      color: #03A87C;
    }

 .search-query-box ul li:hover {
      background-color: #F9F9F9;
      color: #03A87C;
    }

 js
 $('#aa').suggestQuery('./city.json');
 *
 *
 * */
(function(){

  $.fn.suggestQuery=function(url,callBack){
    var objBox=$(this);
    var objKey=objBox.find('.city-key');
    objBox.append('<ul class="city-list"></ul>');
    var newCity = [];
    var _index=-1;
    $.get(url, {}, function(data) {//获取json 数据
      objKey.keyup(function(e) {//监听事件
        newCity = [];
        var _data = data;
        var _val = $(this).val().toLowerCase().replace(/(^\s*|\s*$)/g, '');//输入值
        for (var i = 0; i < _data.length; i++) {
          var item = _data[i];
          var tags = item.tags;
          var _name = item.name;
          var reg = new RegExp('^' + _val + '.*');
          if ((reg.test(tags) || reg.test(_name)) && _val !='') {//拼音与汉字匹配遍历
            newCity.push(item)
          }
        }
        //节点追加
        var citylist = '';
        var reg2 = new RegExp(/\w+/);
        for (var k = 0; k < newCity.length; k++) {
          var item = newCity[k];
          var _len = _val.length;
          if (reg2.test(_val)) {//判断是汉字 如果是汉字则改变字体颜色
            citylist += "<li city-id='"+item.cityid+"'>" + item.name + "</li>";
          } else {
            citylist += "<li city-id='"+item.cityid+"'><span class='add-color'>" + _val + "</span>" + item.name.substr(_len) + "</li>"
          }
          if (k == 4) {//显示五条查询记录
            break;
          }
        }
        if (citylist == '') {
          citylist = "<li>抱歉，未找到相关地点，请修改后重试</li>";
        }
        objBox.find('.city-list').html(citylist).show();

        var domLis=$('.city-list').find('li');
        domLis.mouseenter(function(){
          $(this).addClass('active').siblings().removeClass('active');
        })

        if(e.which==40){
          _index++;
          if(_index>=domLis.length){
            _index=0;
          }
          console.log(_index)
          domLis.eq(_index).addClass('active').siblings().removeClass('active');
        }
        // 如果按下了向上方向键
        if(e.which==38){
          if(_index<=0){
            _index=domLis.length;
          }
          _index--;
          domLis.eq(_index).addClass('active').siblings().removeClass('active');
        }
        // 如果按下了回车键
        if(e.which==13 && _index!=-1){
          if(domLis.eq(_index).attr('city-id')){
            objKey.val(domLis.eq(_index).text()).attr("city-id",domLis.eq(_index).attr('city-id'));
            console.log(domLis.eq(_index).attr('city-id'),22222)
            callBack();
          }else{
            objKey.val('')
          }
          $('.city-list').hide();
        }

      })
      objBox.delegate('li', 'mousedown', function(e) {//选择城市
        if($(this).attr('city-id')){
          objKey.val($(this).text()).attr("city-id",$(this).attr('city-id'));
        }else{
          objKey.val('')
        }
        $(this).parents('.city-list').hide();
      })
      //失去焦点
      objKey.blur(function() {
        $('.city-list').hide();
      })
    })



  }
})($)
