import React from 'react';
import PropTypes from 'prop-types';
import RX from 'reactxp';
import * as cst from '../constants';

const styles = {
  row: RX.Styles.createViewStyle({
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    height: cst.TIME_ROW_HEIGHT
  }),
  title: RX.Styles.createViewStyle({
    color: cst.TIME_ROW_TITLE_COLOR
  })
};

const getHours = (begin, ending) => {
  const hours = [];

  for (let h = parseInt(begin); h < parseInt(ending); h++) {
    hours.push(h.toString());
  }

  return hours;
}

const TimeRow = props => {
  return (
    <RX.View style={[ styles.row ]}>
      {
        getHours(props.begin, props.ending).map((t, i) =>
          <RX.View
            key={t}
            style={{
              width: cst.HOUR_WIDTH,
              paddingLeft: cst.ROOM_COL_WIDTH + props.minutesPadding - t.length * 3
            }}
          >
            <RX.Text style={[ styles.title ]}>
              {`${t}`}
            </RX.Text>
          </RX.View>
        )
      }
    </RX.View>
  );
}

TimeRow.propTypes = {
  begin: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  ending: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  minutesPadding: PropTypes.number
}

export default TimeRow;
