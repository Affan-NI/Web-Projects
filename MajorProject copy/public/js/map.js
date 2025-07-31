const map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${mapApi}`,
      center: listing.geometry.coordinates, // Delhi
      zoom: 9
});

map.addControl(new maplibregl.NavigationControl());

// console.log(coordinates);

const marker=new maplibregl.Marker({color: "red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new maplibregl.Popup({offset:25}).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location provided after booking</P>`))
    .addTo(map);

