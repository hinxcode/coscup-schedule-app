import React from 'react';
import PropTypes from 'prop-types';
import RX from 'reactxp';
import * as cst from '../constants';
import iconScheduleTime from '../img/schedule_time.png';
import iconSchedule from '../img/schedule.png';
import iconMenu from '../img/menu.png';

const styles = {
  bar: RX.Styles.createViewStyle({
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: '#fff'
  }),
  button: RX.Styles.createViewStyle({
    alignItems: 'center',
    width: 100,
  }),
  iconSchedule: RX.Styles.createImageStyle({
    height: 30,
    width: 30
  }),
  iconScheduleTime: RX.Styles.createImageStyle({
    height: 24,
    width: 24,
    marginBottom: 3
  }),
  iconMenu: RX.Styles.createImageStyle({
    height: 28,
    width: 28
  }),
  buttonText: RX.Styles.createTextStyle({
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
        onPress={ () => props.filterFunc('subject') }
      >
        <RX.Image
          style={ styles.iconSchedule }
          source={ iconSchedule }
          resizeMode={ 'cover' }
        />
        <RX.Text style={ styles.buttonText }>主題</RX.Text>
      </RX.Button>
      <RX.Button
        style={[ styles.button ]}
        onPress={ () => props.modalFunc(cst.MODAL_DATE_PICKER) }
      >
        <RX.Image
          style={ styles.iconMenu }
          source={ iconMenu }
          resizeMode={ 'cover' }
        />
      </RX.Button>
      <RX.Button
        style={[ styles.button, props.filterName === 'time' ? {} : styles.isInactive ]}
        onPress={ () => props.filterFunc('time') }
      >
        <RX.Image
          style={ styles.iconScheduleTime }
          source={ iconScheduleTime }
          resizeMode={ 'cover' }
        />
        <RX.Text style={ styles.buttonText }>時間</RX.Text>
      </RX.Button>
    </RX.View>
  );
}

NavBar.propTypes = {
  filterName: PropTypes.string,
  filterFunc: PropTypes.func,
  modalFunc: PropTypes.func
}

export default NavBar;
