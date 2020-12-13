import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  Circle,
  FeatureGroup,
  Rectangle,
} from "react-leaflet";

import "./map-component.css";

export const MapComponent = () => {
  const basemapsDict = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    hot: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
    cycle: "https://dev.{s}.tile.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    bw: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
  };

  const [cords, setCords] = useState({
    lat: 54.510741,
    lng: 30.429586,
    zoom: 10,
  });

  const center = [cords.lat, cords.lng];

  const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
  ];

  return (
    <MapContainer
      zoom={cords.zoom}
      center={center}
      scrollWheelZoom={false}
      className="map-container"
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={basemapsDict.osm}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url={basemapsDict.bw}
          />
        </LayersControl.BaseLayer>
        <LayersControl.Overlay name="Marker with popup">
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Layer group with circles">
          <LayerGroup>
            <Circle
              center={center}
              pathOptions={{ fillColor: "blue" }}
              radius={200}
            />
            <Circle
              center={center}
              pathOptions={{ fillColor: "red" }}
              radius={100}
              stroke={false}
            />
            <LayerGroup>
              <Circle
                center={center}
                pathOptions={{ color: "green", fillColor: "green" }}
                radius={100}
              />
            </LayerGroup>
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Feature group">
          <FeatureGroup pathOptions={{ color: "purple" }}>
            <Popup>Popup in FeatureGroup</Popup>
            <Circle center={[51.51, -0.06]} radius={200} />
            <Rectangle bounds={rectangle} />
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};
