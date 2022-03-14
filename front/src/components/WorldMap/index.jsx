import * as React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Line,
} from 'react-simple-maps';

import world110m from './assets/world110m.json';

// Props
// markers
// lines
// circleMarker 
const WorldMap = (props) => {
  const [zoom, setZoom] = React.useState(1);
  return (
    <div>
      <ComposableMap
        projection="geoMercator"
      >
        <ZoomableGroup
          center={[10, 10]}
          zoom={zoom}>
          <Geographies geography={world110m}>
            {({ geographies }) =>
              geographies.map(
                (geography, i) =>
                  geography.id !== "ATA" && (
                    <Geography
                      key={i}
                      geography={geography}
                      projection={geographies.projection}
                      style={{
                        default: {
                          fill: "#DCDFE1",
                          outline: "none"
                        },
                        hover: {
                          fill: "#607D8B",
                          outline: "none"
                        },
                        pressed: {
                          fill: "#FF5722",
                          outline: "none"
                        }
                      }}
                    />
                  )
              )
            }
          </Geographies>
          {props.markers && props.markers.map((elt, index) => (
            <Marker key={index} coordinates={elt.coordinates}>
              {!props.circleMarker && <g
                fill="none"
                stroke="#FF5533"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
              </g>}
              {props.circleMarker &&
                <circle r={3} fill="#F00" stroke="#FF5533" strokeWidth={0} />
              }
              {/*<text
                textAnchor="middle"
                y={elt.markerOffset}
                style={{ fontSize: '10px', fontFamily: "system-ui", fill: "#5D5A6D" }}
              >
                {elt.name}
              </text>*/}
            </Marker>
          ))}
          {props.lines && props.lines.map((l, index) => <Line
            key={index}
            from={l.start}
            to={l.end}
            stroke="#FF5533"
            strokeWidth={1}
            strokeLinecap="round"
          />)}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default WorldMap;