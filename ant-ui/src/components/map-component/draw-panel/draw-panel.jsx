import React, { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

import proj4 from "proj4";

export const DrawPanel = ({ corr }) => {
  const convertCoordWgsMsk = (coord) => {
    const cordsMsk = proj4(
      "WGS84",
      `+proj=tmerc +ellps=krass +towgs84=24,-123,-94,0.02,-0.25,-0.13,1.1 +units=m +lon_0=39 +lat_0=0 +k_0=1 +x_0=${
        134156.988 + corr.x
      } +y_0=${-6032524.376 + corr.y}`,
      coord
    );
    return [
      Math.floor(cordsMsk[0] * 1000) / 1000,
      Math.floor(cordsMsk[1] * 1000) / 1000,
    ];
  };

  const map = useMapEvents({
    "pm:create": (e) => {
      const mskCords = e.layer._latlngs[0].map(({ lat, lng }) => {
        return convertCoordWgsMsk([lng, lat]);
      });
      e.layer.on("pm:edit", (e) => {
        const mskCords = e.layer._latlngs[0].map(({ lat, lng }) => {
          return convertCoordWgsMsk([lng, lat]);
        });
        console.log(mskCords);
      });
      console.log(mskCords);
    },
    "pm:drawstart": (e) => {
      console.log("Painting Start");
    },
  });

  useEffect(() => {
    return () => {
      map.pm.removeControls();
    };
  });

  map.pm.addControls({
    position: "topleft",
    drawCircle: false,
    drawRectangle: false,
    drawMarker: false,
    drawCircleMarker: false,
    drawPolyline: false,
    cutPolygon: false,
  });

  map.pm.setLang("ru");

  map.pm.setGlobalOptions({
    snapDistance: 10,
  });

  return null;
};
