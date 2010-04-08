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
		'zoom'		=> 11
	);
$tw[] = array(
		'latitude'	=> 25.049622,
		'longitude'	=> 121.551104,
		'name'		=> '經通國際專利商標事務所',
		'address'	=> '台北市八德路三段20號5樓之3',
		'phone'		=> '886-2-2570-1010',
		'email'		=> 'finetpat@ms26.hinet.net',
		'url'		=> 'http://www.finetpat.com.tw/'
	);
$tw[] = array(
		'latitude'	=> 25.041713,
		'longitude'	=> 121.550906,
		'name'		=> 'Henry電腦工作室',
		'address'	=> '台北市大安區忠孝東路四段 183號',
		'phone'		=> '886-2-8771-5352',
		'email'		=> 'henryruan@gmail.com',
		'url'		=> 'http://henryjuan.com/'
	);
$tw[] = array(
		'latitude'	=> 25.045278,
		'longitude'	=> 121.577778,
		'name'		=> '經通資訊',
		'address'	=> '台北市信義區松山路204巷6號3樓',
		'phone'		=> '886-2-8787-4001',
		'email'		=> 'service@finenet.com.tw',
		'url'		=> 'http://finenet.com.tw/'
	);
$tw[] = array(
		'latitude'	=> 25.110471,
		'longitude'	=> 121.684570,
		'name'		=> '經通國際專利商標事務所-1',
		'address'	=> '台北市八德路三段20號5樓之3',
		'phone'		=> '886-2-2570-1010',
		'email'		=> 'finetpat@ms26.hinet.net',
		'url'		=> 'http://www.finetpat.com.tw/'
	);
$tw[] = array(
		'latitude'	=> 24.983568,
		'longitude'	=> 121.360473,
		'name'		=> 'Henry電腦工作室-1',
		'address'	=> '台北市大安區忠孝東路四段 183號',
		'phone'		=> '886-2-8771-5352',
		'email'		=> 'henryruan@gmail.com',
		'url'		=> 'http://henryjuan.com/'
	);
$tw[] = array(
		'latitude'	=> 24.871486,
		'longitude'	=> 121.223144,
		'name'		=> '經通資訊-1',
		'address'	=> '台北市信義區松山路204巷6號3樓',
		'phone'		=> '886-2-8787-4001',
		'email'		=> 'service@finenet.com.tw',
		'url'		=> 'http://finenet.com.tw/'
	);
$tw[] = array(
		'latitude'	=> 24.694438,
		'longitude'	=> 121.269836,
		'name'		=> '經通國際專利商標事務所-2',
		'address'	=> '台北市八德路三段20號5樓之3',
		'phone'		=> '886-2-2570-1010',
		'email'		=> 'finetpat@ms26.hinet.net',
		'url'		=> 'http://www.finetpat.com.tw/'
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
	global $twC, $tw, $cnC, $cn, $hkC, $hk;
	$rs = array();
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
