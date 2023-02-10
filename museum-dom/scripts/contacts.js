mapboxgl.accessToken = 'pk.eyJ1IjoiYWxlc2hraW5wYXVsIiwiYSI6ImNrdWp0MW10aDBuMm0ycHA2d2xsMXR2c20ifQ.Hkaedpr5A1dHDZTVnvzBKQ';

const map = new mapboxgl.Map({
  container: 'section-contacts-map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [2.336311397876579, 48.86095167284976],
  zoom: 15.75
});

map.addControl(new mapboxgl.NavigationControl());

const marker1 = new mapboxgl.Marker({ color: 'black', scale: 0.95 })
  .setLngLat([2.3364, 48.86091])
  .addTo(map);

const marker2 = new mapboxgl.Marker({ color: 'grey', scale: 0.95 })
  .setLngLat([2.3333, 48.8602])
  .addTo(map);

const marker3 = new mapboxgl.Marker({ color: 'grey', scale: 0.95 })
  .setLngLat([2.3397, 48.8607])
  .addTo(map);

const marker4 = new mapboxgl.Marker({ color: 'grey', scale: 0.95 })
  .setLngLat([2.3330, 48.8619])
  .addTo(map);

const marker5 = new mapboxgl.Marker({ color: 'grey', scale: 0.95 })
  .setLngLat([2.3365, 48.8625])
  .addTo(map);

window.addEventListener('resize', () => {
  if (window.innerWidth <= 768) map.style.z = 20;
});