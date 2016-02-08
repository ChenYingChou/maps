<?php

/* 有關網頁緩存的文章請參考: Let's make the web faster -- HTTP caching
 *		http://code.google.com/intl/en/speed/articles/caching.html
 * 註:(Expires, Cache-Control: max-age)兩者選其一即可, 同時存在時以 max-age 優先
 */

// 設定允許取得此 JSON 結果的 cache 秒數, 假設認定5分鐘之內不會改變資料內容
$CacheAge = 5*60;
//--> Expires: Mon, 29 Mar 2010 19:25:43 GMT
//--> Cache-Control: max-age=300
//header('Expires: '.gmdate("D, d M Y H:i:s",time()+$CacheAge)." GMT");
header("Cache-Control: max-age={$CacheAge}");
ob_start();

/*
 * Query: 'Action'
 * -----------------------------------------------------------------------------
 * Country: 取得 country 所在的圖資
 * 返回 JSON 物件如下: (屬性可複選)
 * {
 * 	Center: {					// 移動地圖中心點位置
 *		latitude: 緯度,
 *		longitude: 經度,
 *		geocode: '地址',			// 若有 geocode 則取代經緯度座標
 *		zoom: 0~19				// 縮放等級, 省略表示使用現有縮放等級
 *	},
 *	Markers: [
 *		{ // 圖標1
 *			latitude: 25.049622,
 *			longitude: 121.551104,
 *		  //geocode: '地理編碼',	// 若有 geocode 則取代經緯度座標
 *		  //icon: {...},			// GMap 圖標的 Icon 屬性
 *	//---- 以上4個屬性供 GMarker 使用, 以下則為配合模版使用
 *			name: '經通國際專利商標事務所',
 *			address: '台北市八德路三段20號5樓之3',
 *			phone: '886-2-2570-1010',
 *			email: 'finetpat@ms26.hinet.net',
 *			url: 'http://www.finetpat.com.tw/'
 *		},
 *		//{圖標2},{圖標3},...	// Markers 相當於 Clear + AddMarkers
 *	],
 *	AddMarkers: [...]			// 同 Markers, 但保留已有圖標
 *	tmplList: 'selector',		// 設定清單模版, CSS Selector 或模版字串(含<tag>)
 *	tmplInfo: 'selector',		// 設定圖標展開視窗(InfoWindow)模版, selector 意思同上
 *	Clear: 1,					// 清除圖標資訊
 *	Message: '訊息'				// alert('訊息')
 * }
 * -----------------------------------------------------------------------------
 */

//--------------------------------------------------------
$twC = array(
		'latitude'	=> 25.04154,
		'longitude'	=> 121.54375,
		//'geocode'	=> '台北市捷運忠孝復興站',
		'zoom'		=> 13
	);
$tw[] = array(
		'latitude'	=> 25.044176,
		'longitude'	=> 121.545333,
		'name'		=> 'AHouse',
		'address'	=> '台北市復興南路一段107巷5弄18號1樓',
		'phone'		=> '',
		'email'		=> '',
		'url'		=> 'http://ahouse.vocalasia.com',
		'rss'		=> 'http://picasaweb.google.com.tw/data/feed/base/user/Chen.YingChou/albumid/5103036971715540641?alt=rss&kind=photo&authkey=Gv1sRgCN6Z1ZK104KW6QE&hl=zh_TW'
	);
$tw[] = array(
		'latitude'	=> 25.036754,
		'longitude'	=> 121.547634,
		'name'		=> 'akuma caca',
		'address'	=> '台北市大安區四維路14巷6號B1',
		'phone'		=> '',
		'email'		=> '',
		'url'		=> 'http://akumacaca.pixnet.net/blog',
		'rss'		=> 'http://api.flickr.com/services/feeds/photoset.gne?set=72157623601084457&nsid=27624965@N08&lang=zh-hk'
	);
$tw[] = array(
		'latitude'	=> 25.043204,
		'longitude'	=> 121.510036,
		'name'		=> '台北市中山堂',
		'address'	=> '台北市延平南路98號',
		'phone'		=> '',
		'email'		=> '',
		'url'		=> 'http://w2.csh.taipei.gov.tw/',
		'rss'		=> 'http://picasaweb.google.com.tw/data/feed/base/user/Chen.YingChou/albumid/5471950480549692545?alt=rss&kind=photo&hl=zh_TW'
	);
$tw[] = array(
		'latitude'	=> 25.036731,
		'longitude'	=> 121.519033,
		'name'		=> '國家音樂廳',
		'address'	=> '台北市中正區中山南路21-1號',
		'phone'		=> '',
		'email'		=> '',
		'url'		=> 'http://www.ntch.edu.tw/'
	);
$tw[] = array(
		'latitude'	=> 25.048336,
		'longitude'	=> 121.551900,
		'name'		=> '台北市社教館',
		'address'	=> '台北市松山區八德路3段25號',
		'phone'		=> '',
		'email'		=> '',
		'url'		=> 'http://www.tmseh.gov.tw'
	);

$twA[] = array(
		'datetime'	=> '2010/06/01 20:00',			// 時間
		'venue'		=> 'AHouse',					// 場所
		'group'		=> 'Stouxingers',				// 表演團體
		'image'		=> '//lh3.ggpht.com/_Uhh0svybYgM/S_ZoNw2RnAI/AAAAAAAAADs/s9_jP4GYaH4/tbn_stoux.jpg',
		'url'		=> 								// 連結網址
			'http://ahouse.vocalasia.com/index.php/2010/05/21/stouxingers/',
//		'synopsis'	=>								// 簡介
//			'對於 Stouxingers 來說, 人聲重唱不僅僅是用他們自己的聲音, 創造出合諧的旋律'
	);
$twA[] = array(
		'datetime'	=> '2010/06/03 20:00',			// 時間
		'venue'		=> 'AHouse',					// 場所
		'group'		=> 'Blis-sing',					// 表演團體
		'image'		=> '//lh5.ggpht.com/_Uhh0svybYgM/S_ugnFB5yLI/AAAAAAAAAE4/R5953U9umyA/blissing.jpg',
		'url'		=> 								// 連結網址
			'http://ahouse.vocalasia.com/index.php/2010/05/25/blissing/',
//		'synopsis'	=>								// 簡介
//			'不理性, 是我們對音樂的熱情, 也是團員們所共同擁有的神奇特質...'
	);
$twA[] = array(
		'datetime'	=> '2010/06/04 20:00',			// 時間
		'venue'		=> 'AHouse',					// 場所
		'group'		=> 'Oops',						// 表演團體
		'image'		=> '//lh6.ggpht.com/_Uhh0svybYgM/S_unZa6lKBI/AAAAAAAAAFE/VlAqENAwX6w/oops.jpg',
		'url'		=> 								// 連結網址
			'http://ahouse.vocalasia.com/index.php/2010/05/25/oops/',
//		'synopsis'	=>								// 簡介
//			'由前任團長張騏嬿及副團長兼音樂總監陳薇如號召了國立台南藝術大學應用音樂學系志同道合的...'
	);
$twA[] = array(
		'datetime'	=> '2010/06/05 20:00',			// 時間
		'venue'		=> 'AHouse',					// 場所
		'group'		=> '公共澡堂',					// 表演團體
		'image'		=> '//lh5.ggpht.com/_Uhh0svybYgM/S_og2PEutKI/AAAAAAAAAEQ/FmsaCK4pdwE/%E5%85%AC%E5%85%B1%E6%BE%A1%E5%A0%82.jpg',
		'url'		=> 								// 連結網址
			'http://ahouse.vocalasia.com/index.php/2010/05/24/thepublicbathhouse/',
//		'synopsis'	=>								// 簡介
//			'緣起於創團團長蔡子雍高中時期首次接觸阿卡貝拉, 驚豔於阿卡貝拉音樂散發的魅力...'
	);
$twA[] = array(
		'datetime'	=> '2010/06/19 20:00',			// 時間
		'venue'		=> 'AHouse',					// 場所
		'group'		=> '神秘失控',					// 表演團體
		'image'		=> '//lh5.ggpht.com/_Uhh0svybYgM/S_pHF-FfbrI/AAAAAAAAAEg/bfAPlL5j4H4/semi.jpg',
		'url'		=> 								// 連結網址
			'http://ahouse.vocalasia.com/index.php/2010/05/24/semiscon/',
//		'synopsis'	=>								// 簡介
//			'神秘失控人聲樂團 成立於2002年，是台灣第一個以純人聲形式演出的專業樂團'
	);
$twA[] = array(
		'datetime'	=> '2010/06/26 20:00',			// 時間
		'venue'		=> 'AHouse',					// 場所
		'group'		=> '雙下巴',						// 表演團體
		'image'		=> '//lh3.ggpht.com/_Uhh0svybYgM/S_uTDTBaTNI/AAAAAAAAAEw/eLOVowbAd28/%E6%9C%AA%E5%91%BD%E5%90%8D%20-1.jpg',
		'url'		=> 								// 連結網址
			'http://ahouse.vocalasia.com/index.php/2010/05/25/doublechinsingers/',
//		'synopsis'	=>								// 簡介
//			'國內首支由合唱藝術界跨入流行音樂領域的純男聲重唱團體-「雙下巴重唱團」'
	);
$twA[] = array(
		'datetime'	=> '2010/06/07 20:00',			// 時間
		'venue'		=> 'AHouse',					// 場所
		'group'		=> '七巧板',						// 表演團體
		'image'		=> '//avatars.plurk.com/6285182-medium6.gif',
		'url'		=> 								// 連結網址
			'http://ahouse.vocalasia.com/',
//		'synopsis'	=>								// 簡介
//			'七巧板人聲樂團'
	);
$twA[] = array(
		'datetime'	=> '2010/06/27 20:00',			// 時間
		'venue'		=> 'AHouse',					// 場所
		'group'		=> '海鷗K',						// 表演團體
		'image'		=> '//avatars.plurk.com/6285182-medium6.gif',
		'url'		=> 								// 連結網址
			'http://ahouse.vocalasia.com/',
//		'synopsis'	=>								// 簡介
//			'海鷗K人聲樂團'
	);
$twA[] = array(
		'datetime'	=> '2010/06/05 19:00',			// 時間
		'venue'		=> '台北市中山堂',				// 場所
		'group'		=> '有趣的照片',					// 表演團體
		'image'		=> '//lh3.ggpht.com/_BgB_Kqy9z9M/S_BF-IzSeEI/AAAAAAAAE1w/-jcUu03fYco/s288/4b9db3b4354ae.jpg',
		'url'		=> 								// 連結網址
			'http://picasaweb.google.com/Chen.YingChou/GvnWUH',
		'synopsis'	=>								// 簡介
			'悠閒的午後, 輕柔樂聲飄來, 眼神不禁迷惘, 漸漸的神遊太虛...'
	);
$twA[] = array(
		'datetime'	=> '2010/06/12 19:00',			// 時間
		'venue'		=> '台北市中山堂',				// 場所
		'group'		=> '有趣的照片',					// 表演團體
		'image'		=> '//lh5.ggpht.com/_BgB_Kqy9z9M/S_BF-DzUxyI/AAAAAAAAE1w/W980MEjtuNY/s288/4b9db29ab5fc3.jpg',
		'url'		=> 								// 連結網址
			'http://picasaweb.google.com/Chen.YingChou/GvnWUH',
		'synopsis'	=>								// 簡介
			'1-2-3-4, 2-2-3-4, 跟著動, 別摸魚! 否則以後大腹便便, 別怪老爸沒警告過你!'
	);
$twA[] = array(
		'datetime'	=> '2010/06/19 19:00',			// 時間
		'venue'		=> '台北市中山堂',				// 場所
		'group'		=> '有趣的照片',					// 表演團體
		'image'		=> '//lh4.ggpht.com/_BgB_Kqy9z9M/S_BF-GJP5OI/AAAAAAAAE1w/pMT2pLMeUh8/s288/4bd197a360d38.jpg',
		'url'		=> 								// 連結網址
			'http://picasaweb.google.com/Chen.YingChou/GvnWUH',
		'synopsis'	=>								// 簡介
			'看我的本領, 漫妙的舞姿和技巧, 遠勝那大漠的射鵰英雄!'
	);
$twA[] = array(
		'datetime'	=> '2010/06/26 19:00',			// 時間
		'venue'		=> '台北市中山堂',				// 場所
		'group'		=> '有趣的照片',					// 表演團體
		'image'		=> '//lh3.ggpht.com/_BgB_Kqy9z9M/S_BF-PjilZI/AAAAAAAAE1w/61KQjZSRuBA/s288/4b98452ad0dd2.jpg',
		'url'		=> 								// 連結網址
			'http://picasaweb.google.com/Chen.YingChou/GvnWUH',
		'synopsis'	=>								// 簡介
			'看! 誰說媽咪不會罰我們尿床, 這會兒連大伙都一塊洗, 晾在這!'
	);
//--------------------------------------------------------
$cnC = array(
		'latitude'	=> 28.709860,
		'longitude'	=> 116.323242,
		//'geocode'	=> '中國湖南省南昌市',
		'zoom'		=> 5
	);
$cn[] = array(
		'latitude'	=> 31.259769,
		'longitude'	=> 121.157226,
		'name'		=> '經通國際專利商標事務所',
		'address'	=> '上海市八德路三段20號5樓之3',
		'phone'		=> '886-2-2570-1010',
		'email'		=> 'finetpat@ms26.hinet.net',
		'url'		=> 'http://www.finetpat.com.tw/'
	);
$cn[] = array(
		'latitude'	=> 25.440794,
		'longitude'	=> 119.004592,
		'name'		=> 'Henry電腦工作室',
		'address'	=> '福建省莆田市忠孝東路四段 183號',
		'phone'		=> '886-2-8771-5352',
		'email'		=> 'henryruan@gmail.com',
		'url'		=> 'http://henryjuan.com/'
	);
$cn[] = array(
		'latitude'	=> 23.271627,
		'longitude'	=> 113.291015,
		'name'		=> '經通資訊',
		'address'	=> '福建省廣州市松山路204巷6號3樓',
		'phone'		=> '886-2-8787-4001',
		'email'		=> 'service@finenet.com.tw',
		'url'		=> 'http://finenet.com.tw/'
	);
//--------------------------------------------------------
$hkC = array(
		'latitude'	=> 22.309425,
		'longitude'	=> 114.171295,
		//'geocode'	=> '香港九龍',
		'zoom'		=> 11
	);
//--------------------------------------------------------

function ProcCountry($country) {
	global $twC, $tw, $twA, $cnC, $cn, $hkC, $hk;
	$rs = array();
	$rs['Attachment'] = array();		// 使用者自訂附加資料
	switch ($country) {
		case 'cn':
			$rs['Center'] = $cnC;
			$rs['Markers'] = $cn;
			break;
		case 'hk':
			$rs['Center'] = $hkC;
			$rs['Clear'] = 1;
			break;
		case 'tw':
			$rs['Center'] = $twC;
			$rs['Markers'] = $tw;
			$rs['Attachment']['Activities'] = $twA;
			break;
		case 'jp':
			$rs['Message'] = '... 資料蒐集中  ...';
			break;
		default:
			$rs['Message'] = "Can't found country for '$country'";
			return $rs;
	}
	return $rs;
}

$action = $_REQUEST['Action'];
switch (strtolower($action)) {
	case 'country':
		$result = ProcCountry($_REQUEST['Country']);
		break;
	default:
		$result = array('Message' => 'Invalid query: '.$_SERVER['QUERY_STRING']);
		break;
}

if (isset($_REQUEST['callback'])) {
	header('Content-Type: application/x-javascript');
	//header('Content-Type: text/javascript');
	echo $_REQUEST['callback'].'('.json_encode($result).')';
} else {
	header('Content-Type: application/json');
	//header('Content-Type: text/json');
	echo json_encode($result);
}
ob_end_flush();
?>
