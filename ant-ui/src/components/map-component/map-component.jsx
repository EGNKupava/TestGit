import React from "react";
import {
  Map,
  GeoJSON,
  Popup,
  LayersControl,
  TileLayer,
  FeatureGroup,
} from "react-leaflet";

import { EditControl } from "react-leaflet-draw";

import "./map-component.css";
import "../../../node_modules/leaflet-draw/dist/leaflet.draw.css";

import L from "leaflet";

import { kpt } from "../constatnts/kpt";
import proj4 from "proj4";

const center = [55.920420841522, 39.16531353929];

const corr = {
  x: -120,
  y: +12,
};

const convertCoord = (coord) =>
  proj4(
    `+proj=tmerc +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +lon_0=39 +lat_0=0 +k_0=1 +x_0=${
      134156.988 + corr.x
    } +y_0=${-6032524.376 + corr.y}`,
    "WGS84",
    coord
  );

const convertCoordWgsMsk = (coord) =>
  proj4(
    "WGS84",
    `+proj=tmerc +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +lon_0=39 +lat_0=0 +k_0=1 +x_0=${
      134156.988 + corr.x
    } +y_0=${-6032524.376 + corr.y}`,
    coord
  );

/* function polygonArea(Xs, Ys, numPoints) { //вычесление площади полигона
  var area = 0;
  var j = numPoints - 1;
  for (var i = 0; i < numPoints; i++) {
    area = area + (Xs[j] + Xs[i]) * (Ys[j] - Ys[i]);
    j = i; //j is previous vertex to i
  }
  return Math.abs(area / 2);
} */

const convertFeatureCords = (featureObj) => {
  const FetureContour = featureObj.geometry.coordinates.map((feature) => {
    return feature.map((pointCord) => {
      if (isFinite(pointCord[0]) && isFinite(pointCord[0])) {
        return convertCoord(pointCord);
      }
      return [];
    });
  });
  return {
    ...featureObj,
    geometry: {
      ...featureObj.geometry,
      coordinates: FetureContour,
    },
  };
};

const newKPT = kpt.map((item) =>
  item.features.map((feature) => convertFeatureCords(feature))
);

const onFeature = (feature, layer) => {
  const popupText =
    feature.properties && feature.properties["Кадастровый номер"]
      ? feature.properties["Кадастровый номер"]
      : "Не известно";

  layer.bindPopup(popupText);
  layer.on({
    click: (event) => {
      console.log(event);
      console.log(feature);
    },
    mouseover: (event) => {
      event.target.setStyle({
        color: "orange",
        fillColor: "yellow",
        fillOpacity: "0.5",
      });
    },
    mouseout: (event) => {
      event.target.setStyle({
        color: "red",
        fillColor: "none",
        fillOpacity: "0.5",
      });
    },
  });
};

const onPolygonCreaterd = (e) => {
  console.log(e.layerType);
  const mskCords = e.layer._latlngs[0].map(({ lat, lng }) => {
    console.log([lat, lng]);
    return convertCoordWgsMsk([lng, lat]);
  });
  console.log("mskCords: ", mskCords);
};

var MyCustomMarker = L.Icon.extend({
  options: {
    shadowUrl: null,
    iconAnchor: new L.Point(12, 12),
    iconSize: new L.Point(24, 24),
    iconUrl: "link/to/image.png",
  },
});

const DRAW_OPTIONS = {
  rectangle: false,
  marker: false,
  circle: false,
  polyline: false,
  circlemarker: false,
  polygon: {
    icon: new L.DivIcon({
      iconSize: new L.Point(10, 10),
      className: "leaflet-div-icon leaflet-editing-icon my-own-icon",
    }),
    showLength: true,
    shapeOptions: {
      color: "#0000FF",
      weight: 2,
    },
    allowIntersection: false,
    drawError: {
      color: "orange",
      timeout: 1000,
    },
  },
};

export const MapComponent = () => (
  <Map center={center} zoom={14}>
    <LayersControl position="topright">
      <LayersControl.BaseLayer checked name="Ортофотоплан">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      </LayersControl.BaseLayer>
      <LayersControl.BaseLayer name="OpenStreetMap">
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </LayersControl.BaseLayer>
      {newKPT.map((item, index) => (
        <LayersControl.Overlay
          checked={index === 0 ? true : false}
          name={`Район ${index + 1}`}
        >
          <GeoJSON
            data={item}
            style={{
              fillColor: "none",
              color: `rgb(${255 - index * 5},0,0`,
              weight: 1,
            }}
            onEachFeature={onFeature}
          />
        </LayersControl.Overlay>
      ))}
      <LayersControl.Overlay checked name={`MAP MAP`}></LayersControl.Overlay>
    </LayersControl>
    <FeatureGroup>
      <EditControl
        position="bottomright"
        onCreated={onPolygonCreaterd}
        draw={DRAW_OPTIONS}
      />
    </FeatureGroup>
  </Map>
);
