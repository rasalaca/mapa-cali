const map = L.map("map").setView([3.4516, -76.5320], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

function obtenerNombreBarrio(feature) {
  return feature.properties.barrio ||
         feature.properties.BARRIO ||
         feature.properties.nombre ||
         feature.properties.NOMBRE ||
         feature.properties.id_barrio ||
         feature.properties.ID_BARRIO ||
         "Sin nombre";
}

function obtenerComuna(feature) {
  return feature.properties.comuna ||
         feature.properties.COMUNA ||
         feature.properties.cod_comuna ||
         feature.properties.COD_COMUNA ||
         feature.properties.id_comuna ||
         feature.properties.ID_COMUNA ||
         "Sin dato";
}

let capaBarrios;

fetch("BarriosCali_2.geojson")
  .then(response => response.json())
  .then(barrios => {
    capaBarrios = L.geoJSON(barrios, {
      style: {
        color: "#555555",
        weight: 0.6,
        fillColor: "#f97316",
        fillOpacity: 0.35
      },
      onEachFeature: function(feature, layer) {
        const barrio = obtenerNombreBarrio(feature);
        const comuna = obtenerComuna(feature);

        layer.on("click", function() {
          document.getElementById("panel").innerHTML = `
            <h2>${barrio}</h2>
            <p>Comuna: ${comuna}</p>
          `;
        });

        layer.on("mouseover", function() {
          layer.setStyle({
            weight: 2,
            color: "#111111"
          });
        });

        layer.on("mouseout", function() {
          capaBarrios.resetStyle(layer);
        });
      }
    }).addTo(map);

    map.fitBounds(capaBarrios.getBounds());
  });

fetch("ComunasCali_2_2.geojson")
  .then(response => response.json())
  .then(comunas => {
    L.geoJSON(comunas, {
      style: {
        color: "#000000",
        weight: 2.5,
        fillOpacity: 0
      }
    }).addTo(map);
  });
