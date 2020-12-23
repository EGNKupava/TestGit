import React from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  LayersControl,
  GeoJSON,
  useMapEvents,
} from "react-leaflet";

import "./map-component.css";
import "leaflet/dist/leaflet.css";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

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

const DrawPanel = () => {
  const map = useMapEvents({
    "pm:create": (e) => {
      console.log(e);
      const mskCords = e.layer._latlngs[0].map(({ lat, lng }) => {
        return convertCoordWgsMsk([lng, lat]);
      });
      console.log(mskCords);
    },
    "pm:drawstart": (e) => {
      console.log(e);
    },
    "pm:edit": (e) => {
      console.log(e);
    },
  });
  map.pm.addControls({
    position: "topleft",
    drawCircle: false,
    drawRectangle: false,
    drawMarker: false,
    drawCircleMarker: false,
  });

  map.pm.enableDraw("Polygon", {
    snappable: true,
    snapDistance: 10,
  });

  map.pm.setLang("ru");

  return null;
};

export const MapComponent = () => {
  return (
    <MapContainer center={center} zoom={15} className="map">
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
      <DrawPanel />
    </MapContainer>
  );
};
