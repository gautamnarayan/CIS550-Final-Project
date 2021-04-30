import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

export default class Map extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
        };
    };

    componentDidMount() {
        this.setState({
            markers: []
        });
    }

    render() {
      return (
        <ComposableMap projection="geoAlbers">
          <Geographies geography={"https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"}>
            {({ geographies }) => (
              <>
                {geographies.map(geo => (
                  <Geography
                    key={geo.rsmKey}
                    stroke="#FFF"
                    geography={geo}
                    fill="#DDD"
                  />
                ))}
              </>
            )}
          </Geographies>
          <Marker coordinates={[-74.006, 40.7128]}>
            <circle r={8} fill="#F53" />
          </Marker>
        </ComposableMap>
      );
    };
}