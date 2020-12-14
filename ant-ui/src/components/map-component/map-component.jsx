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
  GeoJSON,
} from "react-leaflet";

import { oksCollection, zuCollection } from "../constatnts/geoJsonObjects";
import "./map-component.css";

export const MapComponent = () => {
  const basemapsDict = {
    osm: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    bw: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
  };

  const [cords, setCords] = useState({
    lat: 52.4279,
    lng: 31.01492,
    zoom: 15,
  });

  const center = [cords.lat, cords.lng];

  const oksStyle = (feature) => ({
    color: "#555555",
    weight: 2,
    opacity: 0.8,
    fillColor: "#932a2a",
  });

  const zuStyle = (feature) => ({
    color: "#d31717",
    weight: 2,
    opacity: 0.5,
    fillColor: "#4f7d50",
  });

  return (
    <MapContainer
      zoom={cords.zoom}
      center={center}
      scrollWheelZoom={false}
      className="map-container"
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Ортофотоплан">
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
        <LayersControl.BaseLayer name="MyObjects"></LayersControl.BaseLayer>
        <LayersControl.Overlay name="Marker with popup">
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Layer group with circles">
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
        <LayersControl.Overlay checked name="Земельные участки">
          <FeatureGroup>
            {zuCollection.map((f) => (
              <GeoJSON key={f.properties.id} data={f} style={zuStyle}>
                <Popup>{f.properties.name}</Popup>
              </GeoJSON>
            ))}
          </FeatureGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="ОКС">
          <FeatureGroup>
            {oksCollection.map((f) => (
              <GeoJSON key={f.properties.id} data={f} style={oksStyle}>
                <Popup>{f.properties.name}</Popup>
              </GeoJSON>
            ))}
          </FeatureGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
};
