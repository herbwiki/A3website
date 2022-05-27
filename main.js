// openlayers interacts with openstreetmaps which has a CCbySA-2 license,
// free to do whatever we want but it need's to be attributed and shared under the same license

// dont u dare question my imports
import 'ol/ol.css';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Feature from 'ol/Feature';
import Icon from 'ol/style/Icon';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {transform} from 'ol/proj';
import {toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';

// get html elements for rendering
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');
const inputclose = document.getElementById('input-closer');

// render popup to popup container
const overlay = new Overlay({
  element: container,
  // if overlays render outside of frame, pan map to fit content
  autoPan: true,
    animation: {
      duration: 250,
    },
  },
);

// click handler to close popup
// return false to not follow href
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

// click handler to close popup
// return false to not follow href
inputclose.onclick = function () {
  input_open(false);
  inputclose.blur();
  return false;
};

// map api key
const key = 'pSnGHAXcdDRHCvITz03E';
// info button bottom right
const attributions = '<a target="_blank">maptiler using openstreetmap</a>'
  // someone check if this seems like fine attribution
  // '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  // '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

// create map
const map = new Map({
  layers: [
    // create background map, and fill attributions list
    new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url: 'https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key=' + key,
        tileSize: 512,
      }),
    }),
  ],
  // init popup
  overlays: [overlay],
  // div id to render to
  target: 'map',
  // map view settings
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

// click handler
map.on('singleclick', function (evt) {
  // grab raw coordinate
  const coordinate = evt.coordinate;
  // format to hemisphere, degrees, minutes, and seconds
  const hdms = toStringHDMS(toLonLat(coordinate));

  // if there's a 'feature' (marker) on pixel, return it
  var ifmark = map.forEachFeatureAtPixel(
    evt.pixel,
    function(ft){return ft;});

  // double check it's a marker
  if (ifmark && ifmark.get('type') == 'marker') { 
    // change popup to show associated description of marker
    content.innerHTML = '<p>'+ifmark.get('desc')+'<p>';
    // show popup at coord
    overlay.setPosition(coordinate);
  } else {   
    // print coords otherwise
    content.innerHTML = '<p>co-ords:</p><br>'
    + '<a class="text-green-500" onclick="input_open(true)"id="inputlink">click here to add a herb</a><br>'
    + hdms;
    overlay.setPosition(coordinate); }
});

// array of array, each subarray contain's longitude and lattitude
const markerpos = [
      [16.3725, 48.208889, 'vienna'],
      [30.1514, 20.10054, 'test coord']
    ];

    function create_marker(tuple) {
      // split subarray
      var lng = tuple[0]
      var lat = tuple[1]
      var desc = tuple[2]

      // the cool kids apparently do everything with vector layers, not marker layers
      var vectorLayer = new VectorLayer({
        source: new VectorSource({
          // features are THE new markers nowadays (these are the invisible markers)
          features: [new Feature({
            type: 'marker',
            desc: desc,
            geometry: new Point(transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
          })]
        }),
        // this makes it not invisible
        style: new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            anchorXUnits: "fraction",
            anchorYUnits: "fraction",
            // should change this at some point, wikimedia is cc but still
            src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
          })
        })
      });
      map.addLayer(vectorLayer);
      // debug if parse or not
      console.log(tuple)
    }
  
    // for each item in markerpos array, execute function
    markerpos.forEach(create_marker)



  