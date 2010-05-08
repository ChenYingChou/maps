/*
 * 使用 CSS Selector 指定 HTML DOM:
 *	#gmaps		: 網頁中地圖所在位置, 請指定其區塊大小(寬高)
 *	#itemList	: 網頁中項目清單所在位置, 其內容會被模版(#tmplList)取代
 *	#tmplList	: 項目清單單一內容的模版, 建議採用 <script type="text/html">
 *	#tmplInfo	: 圖標展開視窗(InfoWindow)的內容模版
 *	.toMarker	: 項目清單中的標題所在(於#tmplList中指定), 以便點擊時展開圖標
 *	.selMarker	: 選取某一圖標時, 項目清單標題(.toMarker)會加上這個類別, 以突顯表示之
 *
 * 註:
 *	1.模版使用說明請見 http://wiki.github.com/nje/jquery/jquery-templates-proposal
 *	2.以下所謂 "DocumentReady 事件之前", 簡單的說就是將要做的動作放在網頁中的 <javascript> 標籤內,
 *	  即始是將之放在網頁最後, 或是放在本檔案引入的前後皆可。
 *
 * var MapOptions = {	// 地圖及清單預設選項, 可在網頁中以 JavaScript 改變 (DocumentReady 事件之前)
 *		latitude	: 25.04154,
 *		longitude	: 121.54375,
 *		//geocode	: '台北市捷運忠孝復興站',
 *		zoom		: 12,
 *		span		: 120,				//*每次點選 itemList 保留的上下距離
 *		easing		: 'swing',			//*移動所選 itemList 的特效演算法: linear 或使用 easing.js
 *		duration	: 600,				//*移動所選 itemList 的特效時間(ms)
 *		draggable	: false,			//*圖標是否可移動
 *		gmaps		: '#gmaps',			// CSS Selector
 *		itemList	: '#itemList',		// CSS Selector 或模版字串(含<tag>)
 *		tmplList	: '#tmplList',		// CSS Selector 或模版字串(含<tag>)
 *		tmplInfo	: '#tmplInfo',		// CSS Selector
 *		itemHeader	: '.toMarker',		// CSS Selector
 *		selectClass	: 'selMarker',		// Class Name, 注意: 這不是 CSS Selector
 *		onOpenMarker: null				// 當開啟 InfoWindow 時觸發回呼函式(pointer,marker), this=GMarker
 *	};
 *
 * 若要在網頁開始時就載入圖標及顯示清單, 那麼請在 DocumentReady 事件前設定下面變數:
 * var myMarkers = [
 *		{	latitude: 24.983568,
 *			longitude: 121.360473,
 *			//geocode: '查詢地址',		// 若有 geocode 則取代經緯度座標
 *			//icon: {...},				// GMap 圖標的 Icon 屬性
 *		//---- 以上4個屬性供 GMarker 使用, 以下則為配合模版使用
 *			name: 'Henry電腦工作室',
 *			address: '台北市大安區忠孝東路四段 183號',
 *			phone: '886-2-8771-5352',
 *			email: 'henryruan@gmail.com',
 *			url: 'http://henryjuan.com/'
 *		}, {第2個圖標}, {第3個圖標}, ...];
 *
 * 開始執行後依 MapOptions 及 myMarkers 的內容建立地圖及圖標清單,
 * var myMap = 圖資操作物件, 其操作方法如下:
 *	setCenter(opts)
 *		將地圖移到中心點
 *		opts 為物件同 MapOptions 前4項(latitude,longitude,geocode,zoom)
 *		若有 geocode 優先採用之, 否則使用經緯度座標, 若未指定 zoom 維持現有縮放等級
 *	setListTemplate(selector)
 *		設定清單模版
 *		selector 為 CSS Selector 或模版字串(含<tag>)
 *	setInfoTemplate(selector)
 *		設定圖標展開視窗(InfoWindow)模版
 *		selector 為 CSS Selector 或模版字串(含<tag>)
 *	options(newSetting)
 *		設定新的選項
 *		newSetting 同 MapOptions, 但僅 (span,easing,duration,draggable) 有效
 *	clearMarkers()
 *		清除地圖上的圖標及清單
 *	addMarkers(newMarkers)
 *		加入新的圖標及清單
 *	newMarkers(newMarkers)
 *		載入全新的圖標及清單
 *		其實就是執行: clearMarkers() 及 addMarkers(newMarkers)
 *	load(url, data, callback)
 *		以 AJAX 取得伺服器端的 JSON 物件
 *		data 可省略, 為 query 字串(已自行編碼者, 如: "key1=value1&key2=value2")
 *			或 物件 {key1:value1, key2:value2, ...}
 *		callback 為回呼函式, 可省略。在做下列處理前會先回呼, 將取得物件當成參數帶入,
 *			回呼函式可改變此物件內容(如下所述), 若返回 false 則不再往下處理。
 *		AJAX 返回物件處理如下{key:value, ...}:
 *			tmplList: selector, 參見 setListTemplate(selector)
 *			tmplInfo: selector, 參見 setInfoTemplate(selector)
 *			Center: opts, 參見 setCenter(opts)
 *			Clear: ignore, 參見 clearMarkers()
 *			Markers: array(Marker1,Marker2,...), 參見 newMarkers(newMarkers)
 *			AddMarkers: array(Marker1,Marker2,...), 參見 addMarkers(newMarkers)
 *			Message: message, 執行 alert(message)
 */

// 全域變數
var	MapOptions, myMap, myMarkers;

/*
 * 本程式採用 Google AJAX API 命名空間規則, 參考下列網頁說明:
 *	http://code.google.com/intl/zh-TW/apis/maps/documentation/reference.html
 * 原有「Google 地圖 API」中使用的所有類別、方法以及 Property 使用的 google.maps.*
 * 命名空間，以此命名空間取代一般的 G 首碼。
 *
 * 程式中帶入參數如下:
 *  G = google
 * GM = google.maps
 *
 * 因此改變下列寫法:
 *	GMap2	-> google.maps.Map2		-> GM.Map2
 *	GUnload	->	...					-> GM.Unload
 *	GEvent	->	...					-> GM.Event
 *	GLatLng	->	...					-> GM.LatLng
 *	GIcon	->	...					-> GM.Icon
 *	GMarker	->	...					-> GM.Marker
 *	GClientGeocoder	-> ...			-> GM.ClientGeocoder
 */
(function(G) {
//==============================================================================
var uuid = 0;

function initialize(GM, $, opts) {	// GM=google.maps, $=jQuery
	opts = $.extend({},MapOptions,opts);
	if (!GBrowserIsCompatible()) {
		$(opts.gmaps).html('Your browser is incompatible with Google-Maps.');
		return null;
	}

	var	$itemList = $(opts.itemList),
		$view = $itemList.parent(),		// itemList 的可視範圍
		viewTop = $view.offset().top,	//	視窗頂點位移及高度
		viewHeight = $view.height()-opts.span,
		gMap = new GM.Map2($(opts.gmaps)[0]),
		geocoder,						// GClientGeocoder
		markers = [],					// Array of Javascript's Object
		$markers,						// Array of jQuery(DOM), $(DOM).data('GMarker') == GMarker
		nSelMarker,						// 目前是選取那一圖標(OpenInfoWindow)
		tmplList, tmplInfo;				// 事先編譯好的模版名稱

	$(window).bind('unload',function() {
		// 清除物件...
		$itemList.die();				// remove all live events for $itemList
		gMap.clearOverlays();
		$itemList = $view = gMap = geocoder = markers = $markers = null;
		delete $.templates[tmplList];
		delete $.templates[tmplInfo];
		GM.Unload();
	});

	uuid++;
	// 事先編譯模版
	tmplList = 'List'+uuid;
	tmplInfo = 'Info'+uuid;
	setTemplate(tmplList,opts.tmplList);
	setTemplate(tmplInfo,opts.tmplInfo);

	$itemList.delegate(opts.itemHeader,'click',function() {
		// 點擊清單項目: 開啟對應 GMarker 的 InfoWindow
		var xMarker = $(this).data('GMarker');
		if (xMarker) GM.Event.trigger(xMarker,'click');
	});

	setCenter(opts);
	gMap.setUIToDefault();

//--------------------------------------------------------------------------
	/**
	 * 事先編譯模版, 說明參見網址:
	 * http://wiki.github.com/nje/jquery/jquery-templates-proposal#templates
	 * @param tmplName		內部定義的模版名稱, 為 tmplList 或 tmplInfo 之一
	 * @param selector		為 CSS Selector 或模版字串(內含有<tag>)
	 */
	function setTemplate(tmplName, selector) {
		if (selector.indexOf('<') < 0) selector = $(selector).html();
		$.templates[tmplName] = $.tmpl(selector);
	}

	function LatLng(latitude, longitude) {
		return new GM.LatLng(latitude, longitude);
	}

	function LocateGeocode(geocode, callback) {
		if (!geocoder) geocoder = new GM.ClientGeocoder();
		geocoder.getLatLng(geocode,function(center) {
			if (!center)
				alert(geocode+" not found");
			else
				callback.apply(geocoder,[center,geocode]);
		});
	}

	function NewMarker(center, icon, mOpts) {
		var xIcon = new GM.Icon(G_DEFAULT_ICON);
		if (icon) $.extend(true,xIcon,icon);
		return new GM.Marker(center,$.extend({},mOpts,{icon:xIcon}));
	}

	/**
	 * 產生GMarker圖標, 設定點擊事件, 並連繫到對應DOM($markers[nth])的資料區
	 * @param nth		指到 DOM -- $markers[nth]
	 * @param marker	產生GMarker所需的物件, 用到屬性: latitude,longitude,geocode,icon
	 * @param mOpts		GMarkerOptions, 可省略
	 * @param onClick	當點擊圖標時要呼叫的函式, 參數會帶(marker,GMarker的座標點)
	 */
	function ActiveMarker(nth, marker, mOpts, onClick) {
		function AddMarker(center) {
			var xMarker = NewMarker(center,marker.icon,mOpts);
			gMap.addOverlay(xMarker);
			if ($.isFunction(onClick)) {
				GM.Event.addListener(xMarker,'click',onClick);
			}
			GM.Event.addListener(xMarker,'infowindowclose',function() {
				 $($markers[nth]).removeClass(opts.selectClass);
				if (nSelMarker === nth) nSelMarker = null;
			});
			// 將此圖標(xMarker)連繫到清單標題DOM($marker[nth])的資料區
			// 以便點擊清單標題時可以操作這個圖標
			$.data($markers[nth],'GMarker',xMarker);
		}

		// 檢查是否省略opts 或者是對調最後兩個參數
		if ($.isFunction(mOpts)) {
			var t = mOpts;
			mOpts = onClick;
			onClick = t;
		}

		// 若有 geocode 則優先用之, 否則使用經緯度座標
		if (marker.geocode) {
			LocateGeocode(marker.geocode,function(center) {
				AddMarker(center);
			});
		} else if (marker.latitude && marker.longitude) {
			AddMarker(LatLng(marker.latitude,marker.longitude));
		}
	}

	function setCenter(_opts) {
		var geocode = _opts.geocode,
			zoom = _opts.zoom;
		if (zoom == null) zoom = gMap.getZoom();
		if (geocode) {
			opts.geocode = geocode;
			LocateGeocode(geocode,function(center, geocode) {
				gMap.setCenter(center,zoom);
				opts.latitude = center.lat();
				opts.longitude = center.lng();
	  		});
		} else {
			var lat = _opts.latitude,
				lng = _opts.longitude;
			gMap.setCenter(LatLng(lat,lng),zoom);
			delete opts.geocode;
			opts.latitude = lat;
			opts.longitude = lng;
		}
		opts.zoom = zoom;
	}
//--------------------------------------------------------------------------

	return {
		map: function() {
			return gMap;
		},
		setCenter: function(opts) {
			setCenter(opts);
		},
		setListTemplate: function(selector) {
			setTemplate(tmplList,selector);
		},
		setInfoTemplate: function(selector) {
			setTemplate(tmplInfo,selector);
		},
		options: function(newSetting) {
			// newSetting 僅 (span,easing,duration,draggable) 有效
			if ($.isPlainObject(newSetting)) $.extend(opts,newSetting);
			return opts;
		},
		clearMarkers: function() {
			markers = [];					// Javascript Objects
			$itemList.empty();				// 清空頁面上項目清單
			$markers = $();					// 清空項目清單標題(jQuery(DOM))
			gMap.clearOverlays();			// 清除地圖上所有的 overlays
			nSelMarker = null;
		},
		newMarkers: function(newMarkers) {
			this.clearMarkers();
			this.addMarkers(newMarkers);
		},
		addMarkers: function(newMarkers) {
			var num = markers.length;
			markers = markers.concat(newMarkers);
			$itemList.append(tmplList,newMarkers);			// 由模版產生項目清單加入頁面
			$markers = $itemList.find(opts.itemHeader);		// 找出所有項目清單標題(點擊時顯示地圖資訊)
			$.each(markers,function(i, marker) {			// 逐一新增地圖的圖標
				if (i < num) return;
				// 將圖標加到地圖上, 並設定 Click 事件要執行的動作
				ActiveMarker(i,marker,{draggable:opts.draggable},function(point) {
					// this = GMarker
					var s;
					if (opts.onOpenMarker) {
						s = opts.onOpenMarker.apply(this,[point,marker]);
						if (s === false) return false;
					}

					if (typeof s !== 'string') {
						if (opts.draggable && point == null) point = this.getLatLng();
						s = (opts.draggable ? '<b>Lat='+point.y+', Long='+point.x+'</b><br/>' : '') +
							$('<div/>').append(tmplInfo,marker).html();
					}
					this.openInfoWindowHtml(s);

					// 移除前次的清單標題選取類別
					if (nSelMarker != null) $($markers[nSelMarker]).removeClass(opts.selectClass);

					// 新增目前的清單標題選取類別, 並計算位移執行移動特效
					var $m = $($markers[nSelMarker=i]),
						offset = $m.offset().top - viewTop;
					$m.addClass(opts.selectClass);
					if (offset < opts.span) {
						offset -= opts.span;
					} else if (offset > viewHeight) {
						offset -= viewHeight;
					} else {
						return;
					}
					offset += $view.scrollTop();
					if (offset < 0) offset = 0;
					$view.animate({scrollTop:offset},opts.duration,opts.easing);
				});
			});
		},
		load: function(url, data, callback) {
			var self = this;
			if ($.isFunction(data)) {
				callback = data;
				data = null;
			}
			$.getJSON(url,data,function(data) {
				if ($.isFunction(callback)) {
					if (callback(data) === false) return;
				}
				$.each(data,function(name, value) {
					switch (name.toLowerCase()) {
						case 'tmpllist':
							setTemplate(tmplList,value);
							break;
						case 'tmplinfo':
							setTemplate(tmplInfo,value);
							break;
						case 'center':
							setCenter(value);
							break;
						case 'clear':
							self.clearMarkers();
							break;
						case 'markers':
							self.newMarkers(value);
							break;
						case 'addmarkers':
							self.addMarkers(value);
							break;
						case 'message':
							alert(value);
							break;
						default:
							if (window.JSON && window.JSON.stringify) {
								value = window.JSON.stringify(value);
							}
							alert('Load> Unknow data:\nname='+name+'\nvalue='+value);
							break;
					}
				});
			});
		}
	};
}
// end of initialize()

G.load('maps','2.x',{'other_params':'sensor=false'});
if (!window.jQuery) G.load('jquery','1');

G.setOnLoadCallback(function() {
	// 新版模版規則: http://forum.jquery.com/topic/templating-syntax
	// 模版源碼 2010/05/01 http://github.com/nje/jquery-tmpl, 以 google-compiler 編譯如下:( 1773 bytes)
	(function(b){var j=b.fn.domManip,k=/^[^<]*(<[\w\W]+>)[^>]*$/;b.fn.extend({render:function(a,d){return this.map(function(h,e){return b.render(e,a,d)})},domManip:function(a){if(a.length>1&&a[0].nodeType)arguments[0]=[b.makeArray(a)];if(a.length>=2&&typeof a[0]==="string"&&typeof a[1]!=="string")arguments[0]=[b.render(a[0],a[1],a[2])];return j.apply(this,arguments)}});b.extend({render:function(a,d,h){var e,c;if(typeof a==="string"){e=b.templates[a];if(!e&&!k.test(a))c=b(a).get(0)}else if(a instanceof
		b)c=a.get(0);else if(a.nodeType)c=a;if(!e&&c){a=b.data(c);e=a.tmpl||(a.tmpl=b.tmpl(c.innerHTML))}var g={data:d,index:0,dataItem:d,options:h||{}};return b.isArray(d)?b.map(d,function(f,i){g.index=i;g.dataItem=f;return e.call(f,b,g)}):e.call(d,b,g)},templates:{},tmplcmd:{each:{_default:[null,"$i"],prefix:"jQuery.each($1,function($2){with(this){",suffix:"}});"},"if":{prefix:"if($1){",suffix:"}"},"else":{prefix:"}else{"},html:{prefix:"_.push(typeof ($1)==='function'?($1).call(this):$1);"},"=":{_default:["this"],
		prefix:"_.push($.encode(typeof ($1)==='function'?($1).call(this):$1));"}},encode:function(a){return a!=null?document.createTextNode(a.toString()).nodeValue:""},tmpl:function(a,d,h,e){a=new Function("jQuery","$context","var $=jQuery,$data=$context.dataItem,$i=$context.index,_=[];_.data=$data;_.index=$i;with($data){_.push('"+a.replace(/[\r\t\n]/g," ").replace(/\${([^}]*)}/g,"{{= $1}}").replace(/{{(\/?)(\w+|.)(?:\((.*?)\))?(?: (.*?))?}}/g,function(c,g,f,i,l){c=b.tmplcmd[f];if(!c)throw"Template not found: "+
		f;f=c._default;return"');"+c[g?"suffix":"prefix"].split("$1").join(l||(f?f[0]:"")).split("$2").join(i||(f?f[1]:""))+"_.push('"})+"');};return $(_.join('')).get();");return d?a.call(this,b,{data:null,dataItem:d,index:h,options:e}):a}})})(jQuery);

	jQuery(function($) {
		MapOptions = $.extend({
				latitude	: 25.04154,
				longitude	: 121.54375,
				zoom		: 12,
				span		: 120,			//*每次移動 itemList 保留上下距離
				easing		: 'swing',		//*移動所選 itemList 的特效演算法
				duration	: 600,			//*移動所選 itemList 的特效時間(ms)
				draggable	: false,		//*圖標是否可移動
			//	onOpenMarker: null,			// 展開圖標視窗前的回呼函式
				gmaps		: '#gmaps',		// CSS Selector
				itemList	: '#itemList',	// CSS Selector
				tmplList	: '#tmplList',	// CSS Selector 或模版字串(含<tag>)
				tmplInfo	: '#tmplInfo',	// CSS Selector 或模版字串(含<tag>)
				itemHeader	: '.toMarker',	// CSS Selector
				selectClass	: 'selMarker'	// Class Name
			},MapOptions);
		myMap = initialize(G.maps,$);
		if (myMarkers) myMap.newMarkers(myMarkers);
	});
});
//==============================================================================
})(google);

