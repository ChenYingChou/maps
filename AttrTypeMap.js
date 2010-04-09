function AttrTypeMapFunc(elem) {
	var	$self = $(elem),
		$input = $self.prev('input'),
		$block = $self.next('div');

	if ($input.length === 0) {
		alert('Invalid AttrTypeMap layout.');
		return false;
	}
	if ($block.length === 0) {
		$block = $('<div/>').insertAfter($self);
	}

	var	gMap, gMarker, $map, $search,
		a = $input.val().split(','),
		Lat = parseFloat(a[0]),	// Lat: Latitude
		Lng = parseFloat(a[1]);	// Lng: Longitude

	function LatLng(latitude, longitude) {
		return new GLatLng(latitude,longitude);
	}

	function setLatLng(latlng) {
		if (latlng) {
			Lat = latlng.lat().toFixed(6);
			Lng = latlng.lng().toFixed(6);
			$input.val(Lat.toString()+','+Lng.toString());
		}
	}

	if (isNaN(Lat) || isNaN(Lng)) {
		// geocode = '中國上海'
		setLatLng(LatLng(31.230708,121.472916));
	}

	a = $self.data('GMAP');
	if ($.isArray(a)) {
		if (!$block.is(':hidden')) {
			$block.slideUp();
			return false;
		}
		gMap = a[0];
		gMarker = a[1];
		gMap.setCenter(LatLng(Lat,Lng));
	} else {
		$search = $('<div><button>Geocode</button>&nbsp;<input text="text" style="width:60%;"/></div>').appendTo($block);
		$map = $('<div style="margin-top:2px; width:100%"/>').appendTo($block);
		a = $block.height();
		if (a < 100) {
			$map.height(350);
		} else {
			$map.height(a-$search.outerHeight()-4);
		}

		gMap = new GMap2($map[0]),
		gMarker = new GMarker(LatLng(Lat,Lng),{draggable:true});
		$self.data('GMAP',[gMap,gMarker]);

		gMap.setCenter(LatLng(Lat,Lng),10);
		gMap.setUIToDefault();
		gMap.addOverlay(gMarker);
		GEvent.addListener(gMarker,'dragend',function(latlng) {
			setLatLng(latlng);
			$search.find('input').val('');
		});

		$block.hide();
		$search.find('button').click(function() {
			var	$address = $search.find('input'),
				address = $address.val(),
				geocoder = new GClientGeocoder();
			if (address) {	// address -> LatLng
				geocoder.getLatLng(address,function(latlng) {
					if (!latlng) {
						alert('"'+address+'" not found');
					} else {
						setLatLng(latlng);
						gMarker.setLatLng(latlng);
						gMap.setCenter(latlng);
					}
				});
			} else {		// LatLng -> address
				geocoder.getLocations(LatLng(Lat,Lng),function(response){
					if (!response || response.Status.code != 200) {
						$address.val("getLocations fail, status code is "+response.Status.code);
					} else {
						var place = response.Placemark[0],
							point = place.Point,
							latlng = LatLng(point.coordinates[1],point.coordinates[0]);
						$address.val(place.address);
						setLatLng(latlng);
						gMarker.setLatLng(latlng);
						gMap.setCenter(latlng);
					}
				});
			}

		});
	}

	$block.slideDown();	//show();
	return false;		// Prevent default action
}
