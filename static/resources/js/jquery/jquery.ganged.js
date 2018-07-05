;
(function($) {
	var opts = {},
		ids = [],
		optsArray = [],
		that, currentOpts = {};

	var pcData = {
			'provinces': []
		}, //省市数据
		caData = {
			'cities': []
		}; //市区数据
	var defaultStr = '<a href="javascript:void(0);" val="-1">请选择</a>',
		defaultId = -1,
		defaultName = '请选择';
	//处理取回的数据
	function handleData(data) {
		var tempArr = [];
		var tempProvinces = [];
		var tempCities = [];
		var tempAreas = [];
		var reProvince = /^[0-9]{2}0{4}$/; //省的格式:前2位为'01~99'，后4位为'0000'  例：010000
		var reCity = /^[0-9]{4}0{2}$/; //城市的格式:前2位为'01~99',中间2位'01~99',后2位为'00' 例:010100
		var reArea = /^[0-9]{6}$/; //区的格式:前2位为'01~99',中间2位'01~99',后2位为'01~99' 例:010101
		var tempArea = data.area;
		var tempCity = data.city;
		var tempProvince = data.province;
		for(var i=0;i<tempProvince.length;i++){
			tempProvinces.push({
				'id': tempProvince[i].areaId,
				'parentId': tempProvince[i].parentId,
				'title': tempProvince[i].title,
				'cities': []
			});
		}
		for(var j in tempCity){
			cityObj=tempCity[j];
			for(var k=0;k<cityObj.length;k++){
				tempCities.push({
					'id':cityObj[k].areaId,
					'parentId': cityObj[k].parentId,
					'title': cityObj[k].title,
					'areas': []

				});
			}
		}
		for(var m in tempArea){
			areaObj=tempArea[m];
			for(var n=0;n<areaObj.length;n++){
				tempAreas.push({
					'id':areaObj[n].areaId,
					'parentId': areaObj[n].parentId,
					'title': areaObj[n].title,
					'towns': []

				});
			}
		}
		for (var i = 0; i < tempProvinces.length; i++) {
			var pId = tempProvinces[i].id;
			for (var j = 0; j < tempCities.length; j++) {
				if (tempCities[j].parentId == pId) {
					tempProvinces[i].cities.push(tempCities[j]);
				}
			}
		}
		//将区信息添加到对应城市中去
		for (var i = 0; i < tempCities.length; i++) {
			var cId = tempCities[i].id;
			for (var j = 0; j < tempAreas.length; j++) {
				if (tempAreas[j].parentId == cId) {
					tempCities[i].areas.push(tempAreas[j]);
				}
			}
		}
		pcData.provinces = tempProvinces;
		caData.cities = tempCities;
		
	}

	function showProvince(obj, selectPId) {
		var tempStr = defaultStr;
		var tempId = defaultId;
		var tempName = defaultName;
		var _provinces = pcData.provinces;
		var _cities = [];
		if (_provinces.length > 0) {
			for (var i = 0; i < _provinces.length; i++) {
				if (selectPId && selectPId == _provinces[i].id) {
					tempStr += '<a href="javascript:void(0);" val="' + _provinces[i].id + '" class="selected">' + _provinces[i].title + '</a>';
					tempId = _provinces[i].id;
					tempName = _provinces[i].title;
					_cities = _provinces[i].cities;
				} else {
					tempStr += '<a href="javascript:void(0);" val="' + _provinces[i].id + '">' + _provinces[i].title + '</a>';
				}
			}
		}

		$(obj).find('div[name="province"]').html('<div class="opts">' + tempStr + '</div');
		$.hhly.inputbox({
			'wrap':$(obj).find('div[name="province"]'),
			'width': currentOpts.width,
			'height': currentOpts.height
		})
		return _cities;
	};

	function showCity(obj, cities, selectCId) {
		var tempStr = defaultStr;
		var tempId = defaultId;
		var tempName = defaultName;
		var _cities = cities ? cities : [];
		var _areas = [];

		if (_cities.length > 0) {
			$(obj).children('div').eq(1).removeClass('hidden');
			for (var i = 0; i < _cities.length; i++) {
				if (selectCId && selectCId == _cities[i].id) {
					tempStr += '<a href="javascript:void(0);" val="' + _cities[i].id + '" class="selected">' + _cities[i].title + '</a>';
					tempId = _cities[i].id;
					tempName = _cities[i].title;
					_areas = _cities[i].areas;
				} else {
					tempStr += '<a href="javascript:void(0);" val="' + _cities[i].id + '">' + _cities[i].title + '</a>';
				}
			}
		}else{
			$(obj).children('div').eq(1).addClass('hidden');
			$(obj).children('div').eq(2).addClass('hidden');
		}

		$(obj).find('div[name="city"]').html('<div class="opts">' + tempStr + '</div');
		/*$(obj).find('div[name="city"]').inputbox({
			'width': currentOpts.width,
			'height': currentOpts.height
		});*/
		$.hhly.inputbox({
			'wrap':$(obj).find('div[name="city"]'),
			'width': currentOpts.width,
			'height': currentOpts.height
		})

		return _areas;
	};

	function showArea(obj, areas, selectAId) {
		var tempStr = defaultStr;
		var tempId = defaultId;
		var tempName = defaultName
		var _areas = areas ? areas : [];
		var _towns = [];

		if (_areas.length > 0) {
			$(obj).children('div').eq(2).removeClass('hidden');
			for (var i = 0; i < _areas.length; i++) {
				if (selectAId && selectAId == _areas[i].id) {
					tempStr += '<a href="javascript:void(0);" val="' + _areas[i].id + '" class="selected">' + _areas[i].title + '</a>';
					tempId = _areas[i].id;
					tempName = _areas[i].title;
					_towns = _areas[i].towns;
				} else {
					tempStr += '<a href="javascript:void(0);" val="' + _areas[i].id + '">' + _areas[i].title + '</a>';
				}
			}
		}else{
			$(obj).children('div').eq(2).addClass('hidden');
		}

		$(obj).find('div[name="area"]').html('<div class="opts">' + tempStr + '</div');
	/*	$(obj).find('div[name="area"]').inputbox({
			'width': currentOpts.width,
			'height': currentOpts.height
		});*/
		$.hhly.inputbox({
			'wrap':$(obj).find('div[name="area"]'),
			'width': currentOpts.width,
			'height': currentOpts.height
		})

		return _towns;
	};

	function createInterval(a) {
		 var spid = $(that).find('input[name="province"]').val();
		 var scid = $(that).find('input[name="city"]').val();
		 var said = $(that).find('input[name="area"]').val();
		var _that = that;
			var _spid = $(_that).find('input[name="province"]').val(),
				_scid = $(_that).find('input[name="city"]').val(),
				_said = $(_that).find('input[name="area"]').val();
	
			if (optsArray.length > 0) {
				for (var i = 0; i < optsArray.length; i++) {
					if (_that == optsArray[i].obj) {
						currentOpts = optsArray[i].opts;

						//监听省份变化，改变城市的值
						if (optsArray[i].ids.spid != _spid) {
							optsArray[i].ids.spid = _spid;
							if (_spid == -1) {
								showCity(_that);
							}
							for (var j = 0; j < pcData.provinces.length; j++) {
								if (_spid == pcData.provinces[j].id) {
									showCity(_that, pcData.provinces[j].cities);
									break;
								}
							}
							$(_that).find('input[name="area"]').val(-1);
						}
						//监听城市变化，改变区的值
						if (optsArray[i].ids.scid != _scid) {
							optsArray[i].ids.scid = _scid;
							if (_scid == -1) {
								showArea(_that);
							}
							for (var j = 0; j < caData.cities.length; j++) {
								if (_scid == caData.cities[j].id) {
									showArea(_that, caData.cities[j].areas);
									break;
								}
							}
						}

						break;
					}
				}
			}
		//}, 100);
	};
	function init(data) {
		handleData(opts.data);
		currentOpts = opts;
		var spid = $(that).find('.province').val();
		var scid = $(that).find('.city').val();
		var said = $(that).find('.area').val();

		var ps = showProvince(that, spid);
		var cs = showCity(that, ps, scid);
		var as = showArea(that, cs, said);

		optsArray.push({
			obj: that,
			opts: opts,
			ids: {
				spid: spid,
				scid: scid,
				said: said
			}
		});
		createInterval();
		$('div[type="selectbox"]').on("click",".opts a",function(e){
		 	var k=1;
			var relesh=setInterval(function(){
				if(k<3){
					createInterval();
					k++;
				}else{
					clearInterval(relesh);
				}
			})
		 });
	};
	$.fn.ganged = function(options) {
		opts = $.extend({}, $.fn.ganged.defaults, options);
		return this.each(function() {
			that = this;
			init();
		});
	};
	$.fn.ganged.defaults = {
		data: [],
		width: 'auto',
		height: 24
	};
})(jQuery);