
var	myMap,							// gmap.js 載入後設定
 	MapOptions = {
 		//easing: 'easeOutBounce',	// 使用 easing.js 特效
 		//duration: 1200,			// 設定特效時間
 		//draggable: true,
 		icon: {
 			image: 'music-live.png',
 			iconSize: {width:32, height:37},
 			iconAnchor: {x:15, y:35},
 			infoWindowAnchor: {x:15, y:4},
 			imageMap: [3,3, 3,28, 9,28, 15,35, 16,35, 22,28, 28,28, 28,3]
 		}
 	};

google.setOnLoadCallback(function() {
// 因為 jQuery 可能由 Google-AJAX API 載入(見 gmaps.js 最後面的程式碼)
// 故要在 google.setOnLoadCallback() 中才可安全使用 jQuery

  //將下行註解去掉可使用特效(路徑請自改), 見 http://gsgd.co.uk/sandbox/jquery/easing/
  //jQuery.getScript('/js/jq/easing.js');

  jQuery(function($) {
	function startup() {
		if (myMap === undefined) {	// 避免 IE 不依 setOnLoadCallback 設定順序執行
			setTimeout(startup,100);
			return;
		}

		var $gmap = $('#gmaps'),
			$msgLog = $('#msgLog'),
			$slidebox = $('#slidebox');

		/* array(activity), activity =
			{	datetime: 'yyyy-mm-dd hh:mm',	// 時間
				venue: '台北中山堂',				// 場所, 對應到  marker.name
				group: '雙下巴',					// 表演團體
				// 以下欄位可省略, image 於 slidebox 用
				image: 'http://...',			// 相片連結
				url: 'http://...',				// 連結網址
				synopsis: '...'					// 簡介
			}
		*/
		var activities = [];

		// 事先編譯 slidebox 模版
		$.templates['slidebox'] = $.tmpl($('#tmplSlide').html());

		/**
		 *  套用 slidebox 模版
		 *  找出 activities[][key] === value 者, 代入模版 #tmpSlide 存入 #slidebox
		 */
		function showSlidebox(key, value) {
			var i, a,
				n = activities.length,
				aData = [];
			for (i = 0; i < n; i++) {
				a = activities[i];
				if (a[key] === value) {
					if (!a.synopsis) a.synopsis = a.datetime + ' - ' + a.group;
					aData.push(a);
				}
			}
			if (aData.length) {
				$slidebox.empty().append('slidebox',aData).featureCarousel({
					counterStyle: 0,
					topPadding: 5,
					largeFeatureWidth: 300,
					largeFeatureHeight: 180,
					smallFeatureWidth: 150,
					smallFeatureHeight: 90,
					autoPlay: 10000,
					startingFeature: Math.floor(aData.length/2)
				}).slideDown();

				$('<span class="close">').text('X').click(function() {
					$slidebox.slideUp().empty();
				}).prependTo($slidebox);
			} else {
				$slidebox.slideUp().empty();
			}
		}

		/**
		 * 顯示活動事件清單: dd - dt(datetime) ... dd(venue/group) ...
		 */
		function showActivities() {
			var	i, a, s, sdate, lastDate,
				n = activities.length;
			lastDate = '';
			s = '';
			for (i = 0; i < n; i++) {
				a = activities[i];
				sdate = a.datetime.substr(0,10);
				if (lastDate != sdate) {
					lastDate = sdate;
					s += '<dt>&nbsp;' + lastDate + '</dt>';
				}
				s += '<dd>' + a.datetime.substr(11,5) + ' ' + a.venue +
					 ' - ' + a.group + '</dd>';
			}
			$('#activityList').html(s);
		}

		/**
		 * 選取地區: 讀取伺服器端的資料
		 */
		$('#selCountry').change(function() {
			var cid = $(this).val();	// value of option: cn,hk,tw,jp,...
			if (cid) {
				myMap.load('ajaxLoad.php',{
					'Action': 'Country',
					'Country': cid
				}, function(data) {
					activities = [];
					if (data.Attachment) {
						activities = data.Attachment.Activities;
						if ($.isArray(activities)) {
							activities.sort(function(a, b) {
								if (a.datetime < b.datetime) return -1;
								if (a.datetime > b.datetime) return 1;
								if (a.venue < b.venue) return -1;
								if (a.venue > b.venue) return 1;
								return 0;
							});
						} else {
							activities = [];
						}
					}
					showActivities();

					if ($msgLog) {
						var s = 'ajaxLoad> Country='+cid+'<br/>\n',
							value;
						for (var name in data) {
							s += '\t'+name+': ';
							value = data[name];
							if ($.isArray(value))
								s += 'Array['+value.length+']';
							else if ($.isPlainObject(value))
								s += 'Object';
							else if (typeof value === 'string')
								s += value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
							else
								s += value;
							s += '<br/>\n';
						}
						s += '----------<br/>\n';
						$('#msgLog').prepend(s);
					}
				});
			}
		}).val('tw').change();

		var AllMapHeight = $gmap.height() + 350;
		if (AllMapHeight < 700) {
			$('#gmaps_bar').click(function() {
				$gmap.animate({
					height: AllMapHeight - $gmap.height()
				}, function() {
					myMap.map().checkResize();
				});
			});
		}

		myMap.options().onOpenMarker = function(point, marker) {
			// this = GMarker
			showSlidebox('venue',marker.name);

			if ($msgLog) {
				var s = 'onOpenMarker&gt;<br/>'+marker.name+
						'<br/>----------<br/>';
				$('#msgLog').prepend(s);
			}
			//return false;			// 若返回 false 將會禁止執行開啟 InfoWindow
			//return s;				// 若返回字串, 將取代模版的執行結果
		};
	}
	startup();

  });	// jQuery(window).ready()
});		// google.setOnLoadCallback()
