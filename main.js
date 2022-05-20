// openlayers interacts with openstreetmaps which has a CCbySA-2 license,
// free to do whatever we want but it need's to be attributed and shared under the same license

// dont u dare question my imports
import 'ol/ol.css';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {fromLonLat, toLonLat} from 'ol/proj';
import {toStringHDMS} from 'ol/coordinate';

// get html elements for rendering
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

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

  content.innerHTML = '<p>co-ords:</p>' + hdms;
  overlay.setPosition(coordinate);
});

// static coords to define marker, could be key value array for database hooking, taken from docs
const viennapos = fromLonLat([16.3725, 48.208889]);

// test marker, taken from docs
const marker = new Overlay({
  position: viennapos,
  positioning: 'center-center',
  element: document.getElementById('marker'),
  stopEvent: false,
});
map.addOverlay(marker);
