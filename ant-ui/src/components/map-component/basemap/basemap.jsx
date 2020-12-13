import React from "react";

export const Basemap = ({ basemap, setMyMap }) => {
  const onChange = (e) => {
    setMyMap(e.currentTarget.value);
  };

  return (
    <div className="basemaps-container">
      <select value={basemap} onChange={onChange}>
        <option value="osm">OSM</option>
        <option value="hot">OSM HOT</option>
        <option value="dark">DARK</option>
        <option value="cycle">CYCLE MAP</option>
      </select>
    </div>
  );
};
