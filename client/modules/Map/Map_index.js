import React from 'react';
// const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
import ReactMapboxGl, { Marker, Cluster, ZoomControl } from '../../../myNpmModules/react-mapbox-gl';
import MapFilter from './Map_Filter';
import MapItemSelector from './Map_Item_Selector_Container';
import CircleIcon from 'react-icons/lib/fa/circle';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import getAllUsersMapThunk from '../../thunks/map_thunks/getAllUsersMapThunk';
import './Map.css';
import {Icon, Popup, Image} from 'semantic-ui-react';
const styles = {
  mapContainer: {
    height: '100%'
  },
  map: {
    height: '92vh',
    width: '80vw'
  },
  outer: {
    display: 'flex',
    flexDirection: 'row'
  },
  inner: {
    display: 'flex',
    flexDirection: 'column'
  },
  marker: {
    color: '#37d67a',
    fontSize: '40px'
  },
  cluster: {
    color: '#ff6f00'
  },
  zoom: {
    marginTop: '5%',
    marginRight: '1%'
  }
};
const Map = ReactMapboxGl({
  accessToken: 'pk.eyJ1Ijoib21lc2hvbWVzIiwiYSI6ImNqNTh2cXoxZjAxa2QzM3FxaWgxaDEzbzcifQ.rBTIS3ct7ZxUTR1HGW-cXg',
  attributionControl: false,
  logoPosition: 'bottom-right'
});

const mapList = [
  'mapbox://styles/mapbox/streets-v10',
  'mapbox://styles/mapbox/satellite-v9',
  'mapbox://styles/mapbox/dark-v9'
];
class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: true,
      mapInd: 0
    };
  }

  componentDidMount() {
    this.props.getAllUsers();
    const urls = this.props.location.pathname;
    sessionStorage.setItem('url', urls);
  }

  handleClick(id) {
    const index = this.props.users.findIndex((person) => {return person.id === id;});
    this.props.updateCenter(this.props.users[index].location[this.props.selected]);
    // WEIRD: this line was causing an error for some reason: (figured it out now)
    // this.props.updateZoom(10);
    this.props.updateClicked(id);
  }

  handleClusterClick() {
  }

  clusterMarker(coordinates, count, data) {
    return (
      <Marker coordinates={coordinates} className="marker">
          <div>
            <Popup
              trigger={<CircleIcon />}
              hoverable
              basic={false}
            >
              <Popup.Content>
                <div className="popup" >
                  {data.map((d, i) => (<img key={d.id} src={d.pictureURL} className="deckAvatar" />))}
                </div>
              </Popup.Content>
            </Popup>
          </div>
      </Marker>
    );
  }
  render() {
    const users = this.props.users.filter((user) => {
      return user.location[this.props.selected].length > 0;
    });
    return (
      <div id="outer" >
        <div id="inner" >
          <MapItemSelector />
          <MapFilter users={this.props.users}
          changeCenter={(coordinates) => {this.props.updateCenter(coordinates);}}
          changeZoom={(num) => {this.props.updateZoom(num);}} />
        </div>
        <div className="mapDiv">
          <Map
            style={mapList[this.state.mapInd]}
            center={this.props.center}
            zoom={this.props.zoom}
            attributionControl={false}
            id="realmap"
            containerStyle={{
              height: '92vh',
              width: '73vw',
              marginTop: '5px',
              textAlign: 'left',
              marginRight: '1vh',
              border: '#5bc0e3',
              borderStyle: 'solid',
              borderRadius: '4px'
            }}>
              <ZoomControl style={styles.zoom} className="zoomControl"/>
              <div className="mapWrapper" onClick={() => {this.setState({mapInd: (this.state.mapInd + 1) % 3});}}>
                <Icon name="map outline" className="mapIcon" />
              </div>
              <Cluster ClusterMarkerFactory={this.clusterMarker.bind(this)} maxZoom={12}>
                {
                    users.map((feature) => {
                      return (
                        <Marker
                          key={feature.id}
                          data={feature}
                          coordinates={feature.location[this.props.selected]}
                          className="cluster"
                          onClick={this.handleClick.bind(this, feature.id)}
                          >
                          <Popup
                            trigger={<CircleIcon />}
                            hoverable
                          >
                            <Popup.Content>
                              <div className="headerOuter" >
                                <img src={feature.pictureURL} className="deckAvatar" />
                              </div>
                            </Popup.Content>
                          </Popup>
                        </Marker>
                      );
                    }
                  )
                }
              </Cluster>
          </Map>
        </div>
      </div>
    );
  }
}

MapContainer.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.array,
  updateCenter: PropTypes.func,
  updateZoom: PropTypes.func,
  updateClicked: PropTypes.func,
  getAllUsers: PropTypes.func,
  users: PropTypes.array,
  selected: PropTypes.string,
  location: PropTypes.object
};

const mapStateToProps = (state) => ({
  users: state.mapReducer.users,
  center: state.mapReducer.center,
  zoom: state.mapReducer.zoom,
  selected: state.mapReducer.selected
});

const mapDispatchToProps = (dispatch) => ({
  updateCenter: (newCenter) => dispatch({
    type: 'NEW_CENTER',
    center: newCenter,
  }),
  updateZoom: (newZoom) => dispatch({
    type: 'UPDATE_ZOOM',
    num: newZoom
  }),
  updateClicked: (id) => dispatch({
    type: 'UPDATE_CLICKED',
    clicked: id
  }),
  getAllUsers: () => getAllUsersMapThunk(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
