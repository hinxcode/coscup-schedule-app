import React from 'react';
import PropTypes from 'prop-types';
import RX from 'reactxp';
import * as cst from '../constants';
import iconScheduleTime from '../img/schedule_time.png';
import iconSchedule from '../img/schedule.png';

const styles = {
  bar: RX.Styles.createViewStyle({
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff'
  }),
  button: RX.Styles.createViewStyle({
    alignItems: 'center',
    width: 100,
  }),
  icon: RX.Styles.createImageStyle({
    height: 25,
    width: 25
  }),
  buttonText: RX.Styles.createTextStyle({
    paddingTop: 3,
    fontSize: 12
  }),
  isInactive: RX.Styles.createViewStyle({
    opacity: 0.5
  })
};

const NavBar = props => {
  return (
    <RX.View style={ styles.bar }>
      <RX.Button
        style={[ styles.button, props.filterName === 'subject' ? {} : styles.isInactive ]}
        onPress={() => props.onClick('subject')}
      >
        <RX.Image
          style={ styles.icon }
          source={ iconSchedule }
          resizeMode={ 'cover' }
        />
        <RX.Text style={ styles.buttonText }>
           主題
        </RX.Text>
      </RX.Button>
      <RX.Button
        style={[ styles.button, props.filterName === 'time' ? {} : styles.isInactive ]}
        onPress={() => props.onClick('time')}
      >
        <RX.Image
          style={ styles.icon }
          source={ iconScheduleTime }
          resizeMode={ 'cover' }
        />
        <RX.Text style={ styles.buttonText }>
           時間
        </RX.Text>
      </RX.Button>
    </RX.View>
  );
}

NavBar.propTypes = {
  onClick: PropTypes.func,
  filterName: PropTypes.string
}

export default NavBar;
