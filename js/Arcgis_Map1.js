// ---------------------------------------------------------------------------------------------------------------------------------------
var Earthquakes_onclick;
var WorldCities_onclick;
var Chinaprovince_onclick;
var FeatureLayerurl_onchange;
var _text;
var str;

require([
		"esri/config",
		"esri/Map",
		"esri/views/MapView",
		"esri/layers/FeatureLayer"
	],
	function(esriconfig, Map, MapView, Feature_Layer) {
		esriconfig.apiKey =
			"AAPK56e3ac027f044c4089d8ceec232fc05dYaOuzVRzm8tMRqvzOvDvIEevbqJ85yppn9PacU6cy4duurJrVK9wo_8BcWO8i8bi";
		var basemap_layer = new Map({
			basemap: "arcgis-topographic"
		});

		const layer = new Feature_Layer({
			portalItem: {
				id: "f326039f1a194f07b66ef632bcc38d36"
			},
		});
		basemap_layer.add(layer);


		document.getElementById("arcgis-topographic").addEventListener("click", function() {
			basemap_layer.basemap = "arcgis-topographic";
		});
		document.getElementById("streets").addEventListener("click", function() {
			basemap_layer.basemap = "streets-vector";
		});
		document.getElementById("gray").addEventListener("click", function() {
			basemap_layer.basemap = "gray-vector";
		});
		document.getElementById("hybrid").addEventListener("click", function() {
			basemap_layer.basemap = "arcgis-imagery-standard";
		});
		var view = new MapView({
			map: basemap_layer,
			center: [116.5, 39],
			zoom: 7,
			container: "viewDiv"
		});

		Earthquakes_url =
			"https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/FeatureServer";
		WorldCities_url =
			"https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/World_Cities/FeatureServer";
		Chinaprovince_url =
			"https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/CHN_Boundaries_2020/FeatureServer/1";

		Earthquakes_onclick = function(checkbox) {
			if (checkbox.checked == true) {
				Ear_Layer = new Feature_Layer({
					url: Earthquakes_url
				});
				basemap_layer.add(Ear_Layer);
			} else {
				view.map.remove(Ear_Layer);
			}
		}

		WorldCities_onclick = function(checkbox) {
			if (checkbox.checked == true) {
				City_Layer = new Feature_Layer({
					url: WorldCities_url
				});
				basemap_layer.add(City_Layer);
			} else {
				view.map.remove(City_Layer);
			}
		}
		prov_Layer = new Feature_Layer({
			url: Chinaprovince_url
		});
		Chinaprovince_onclick = function(checkbox) {
			if (checkbox.checked == true) {
				basemap_layer.add(prov_Layer);
			} else {
				view.map.remove(prov_Layer);
			}
		}
		var view2;
		var basemap_layer2 = new Map({
			basemap: "arcgis-imagery-standard"
		});
		view2 = new MapView({
			map: basemap_layer2,
			center: view.center,
			zoom: view.zoom,
			container: "viewDiv2"
		});

		function showCoordinates(pt) {
			var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
				" | Scale 1:" + Math.round(view.scale * 1) / 1 +
				" | Zoom " + parseInt(view.zoom);
			document.getElementById("coordinates").innerHTML = coords;
			view2.center = view.center;
			view2.zoom = view.zoom;
		}

		view.watch(["stationary"], function() {
			showCoordinates(view.center);
		});

		view.on(["pointer-down", "pointer-move"], function(evt) {
			showCoordinates(view.toMap({
				x: evt.x,
				y: evt.y
			}));
		});
		// ------------------------------------------------------------------------
		var layer_array = new Array();

		layer_function = function(checkbox, value) {
			if (checkbox.checked == true) {
				basemap_layer.add(layer_array[value]);
			} else {
				view.map.remove(layer_array[value]);
			}
		}
		var value = 0;
		FeatureLayerurl_onchange = function() {
			_text = document.getElementById("_url").value;
			str = _text.split("/")
			str.reverse();
			if (str[0] == "MapServer" || str[0] == "FeatureServer") {
				_name = new Feature_Layer({
					url: _text
				});
				layer_array.push(_name);
				var muiDiv = document.getElementById('LayerList_Div');
				createInput(str[1], value, muiDiv);
				value = value + 1;
			} else if (str[1] == "MapServer" || str[1] == "FeatureServer") {
				_name = new Feature_Layer({
					url: _text
				});
				layer_array.push(_name);
				var muiDiv = document.getElementById('LayerList_Div');
				createInput(str[2], value, muiDiv);
				value = value + 1;
			}

		}
	});

function createInput(inputName, inputValue, aDiv) {
	aDiv.appendChild(document.createTextNode(inputName));
	var input = document.createElement("input");
	input.type = "checkbox";
	input.setAttribute("name", inputName);
	input.checked = false;
	input.value = inputValue;
	input.onclick = function() {
		layer_function(this, this.value);
	};

	aDiv.appendChild(input);
}
