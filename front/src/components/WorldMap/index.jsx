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
// linesParents
// circleMarker 
// onZoomOrMove
// handleClick
// randomMarkerColor
const WorldMap = (props) => {
  const initCenter = props.initCenter ? props.initCenter : [10, 10];
  const initZoom = 1;
  const [zoomCurrent, setZoomCurrent] = React.useState(initZoom);
  const [center, setCenter] = React.useState(initCenter);
  const [centerApplied, setCenterApplied] = React.useState(initCenter);
  const [zoomApplied, setZoomApplied] = React.useState(initZoom);
  const [tooltip, setTooltip] = React.useState('');

  React.useEffect(() => {
    if (props.markers && props.markers.length === 1) {
      setCenterApplied(props.markers[0].coordinates);
      setZoomApplied(15);
      setZoomCurrent(15);
    }
  }, [props.markers]);

  return (
    <div style={{ position: 'relative' }}>
      <ComposableMap
        projection="geoMercator"
      >
        <ZoomableGroup
          zoom={zoomApplied}
          center={centerApplied}
          maxZoom={30}
          onMoveEnd={({ coordinates, zoom }) => {
            //console.log(coordinates, zoom);
            setCenter(coordinates);
            setZoomCurrent(zoom);
            if ((center && coordinates[0] != center[0] 
              || coordinates[1] != center[1])
              || (zoomCurrent != zoom)) {
              setCenter(coordinates);
              setZoomCurrent(zoom);
              if (props.onZoomOrMove)
                props.onZoomOrMove(coordinates, zoom);
            }
          }}
          >
          <Geographies geography={world110m}>
            {({ geographies }) =>
              geographies.map(
                (geography, i) =>
                  geography.id !== "ATA" && (
                    <Geography
                      key={i}
                      geography={geography}
                      projection={geographies.projection}
                      /*onMouseEnter={() => {
                        setTooltip(geography.id);
                      }}
                      onMouseLeave={() => {
                        setTooltip("");
                      }}*/
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
          {/*<Marker
            key={'0-center'}
            coordinates={center}
            onClick={() => console.log('center')}
            >
              <circle
                r={300 / (zoomCurrent)}
                fill="none"
                stroke="black"
                strokeWidth={3}
                style={{ cursor: 'pointer' }}
              />
          </Marker>*/}

          {props.markers && props.markers
            .map((elt, index) => (
              <Marker
                key={index}
                coordinates={elt.coordinates}
                onClick={() => props.handleClick ? props.handleClick(elt.name) : console.log(elt.name)}
                >
                {!props.circleMarker && <g
                  fill="none"
                  stroke="#FF5511"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  transform="translate(-12, -24)"
                >
                  <circle cx="12" cy="10" r="3" />
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
                </g>}
                {props.circleMarker &&
                  <circle
                    r={5 / zoomCurrent > 1 ? 5 / zoomCurrent : 1}// to do affinate
                    fill={"#F00"}
                    stroke="#FF5533"
                    strokeWidth={0}
                    style={{ cursor: 'pointer' }}
                  />
                }
                {/*<text
                  textAnchor="middle"
                  y={elt.markerOffset}
                  style={{ fontSize: '10px', background: '#333', color: 'white', fontFamily: "system-ui", fill: "#5D5A6D" }}
                >}
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
          {props.linesParents && props.linesParents.map((l, index) => <Line
            key={index}
            from={l.start}
            to={l.end}
            stroke="#4cfb3d"
            strokeWidth={1}
            strokeLinecap="round"
          />)}
          {props.linesParents && props.linesParents.map((l, index) => 
            <Marker
              key={"market_parents" + index}
              coordinates={l.start}
              >
              {!props.circleMarker && <g
                fill="none"
                stroke="#4cfb3d"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
              </g>}
              {props.circleMarker &&
                <circle
                  r={5 / zoomCurrent > 1 ? 5 / zoomCurrent : 1}// to do affinate
                  fill="#2fb923"
                  stroke="#4cfb3d"
                  strokeWidth={0}
                  style={{ cursor: 'pointer' }}
                />
              }
            </Marker>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
}

export default WorldMap;