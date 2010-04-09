<?php

$key = "map1";
$a = array('name'=>'map1', 'id'=>'map1', 'value'=>'25.04154,121.54375');
$oAttribute = (object)$a;

$formHTML = <<<_TEXT_
<input type="text" class="text medium" name="content[attributes][data][$key]" id="frmFieldName_{$oAttribute->name}" value="{$oAttribute->value}" />
<button onclick="return AttrTypeMapFunc(this)">Map</button>
<input type="hidden" name="content[attributes][attr_id][$key]" value="{$oAttribute->id}" />
_TEXT_;

/*
<input type="text" class="text medium" name="content[attributes][data][$key]" id="frmFieldName_{$oAttribute->name}" value="{$oAttribute->value}" />
<button id="mapTrigger_{$oAttribute->name}">Map</button><div></div>
<input type="hidden" name="content[attributes][attr_id][$key]" value="{$oAttribute->id}" />
<script type="text/javascript">
$('#mapTrigger_{$oAttribute->name}').click(function(){return AttrTypeMapFunc(this)});
</script>
 */
?>
<!doctype html>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<title>地圖插件展示</title>
<link rel="stylesheet" type="text/css" href="main.css" media="all">
<!-- http://finenet.com.tw/ -->
<script type="text/javascript" src="http://maps.google.com/maps?file=api&v=2&sensor=false&key=ABQIAAAAwMvYCcAIeDYyDNXLwfVGdBTQxhV7Fc59ICl5wfKO7RkxCpQ7cxQXQOsAdlXC06THRKC7u5I8twA4PQ"></script>
<!-- -->
<!-- http://localhost/
<script type="text/javascript" src="http://maps.google.com/maps?file=api&v=2&sensor=false&key=ABQIAAAAwMvYCcAIeDYyDNXLwfVGdBT2yXp_ZAY8_ufC3CFXhHIE1NvwkxS2lhkAviF3A1pIIeu9VuGfolCnhA"></script>
-->
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
<script type="text/javascript" src="AttrTypeMap.js"></script>
</head>
<body>
	<div class="header">
		<div style="font-size:2em">地圖插件展示</div>
	</div>
	<div class="content">
		<div class="left">
			<div class="bar"></div>
		</div>
		<div class="middle">
			<div class="bar" style="background-color:gray"></div>
			<div><?php echo $formHTML; ?></div>
			<div class="bar" style="background-color:blue"></div>
		</div>
		<div class="right">
			<div class="bar"></div>
			<div id="msgLog" style="height:400px;overflow-y:auto;font-size:80%"></div>
		</div>
	</div>
	<div class="footer"></div>
</body>
</html>
