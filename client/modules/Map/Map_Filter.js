import React from 'react';
import PropTypes from 'prop-types';
import LocationSearch from './Map_Location_Search_Container';
import NameSearch from './Map_NameSearch';
import MapCard from './Map_Card';
import uuidv4 from 'uuid/v4';
import { Menu, Message, Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux';


const styles = {
  outer: {
    width: '20vw',
    display: 'flex',
    flexDirection: 'column'
  },
  filter: {
    borderWidth: 1,
    height: '15vh'
  },
  filterOuter: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10%'
  },
  image: {
    width: '15%',
    height: '15%'
  },
  listOuter: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: '1px',
    marginBottom: '10px'
  },
  disc: {
    display: 'flex',
    flexDirection: 'column'
  }
};

class MapFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  // handleClick(index) {
  //   // TODO highlight the user's tab and center the map on their location
  //   // change the people on the list based on nearby location
  //   this.props.changeCenter(user.location);
  //   this.props.changeZoom(10);
  //   console.log('clicked');
  // }

  render() {
    return (
      <div style={styles.outer}>
        <div style={styles.filter}>
        <LocationSearch />
        </div>
        <div style={styles.filter}>
        <NameSearch />
        </div>
        <div style={styles.filterOuter}>
          {this.props.users.map((user, index) => (
            <MapCard
              index={index}
              key={uuidv4()}
              profileURL={user.profileURL}
              name={user.name}
              year={user.year}
              career={user.career}
              location={user.location}
            />
          ))}
        </div>
      </div>
    );
  }
}

MapFilter.propTypes = {
  changeCenter: PropTypes.func,
  changeZoom: PropTypes.func,
  users: PropTypes.array
};

const mapStateToProps = (state) => ({
  clicked: state.mapReducer.clicked,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(MapFilter);