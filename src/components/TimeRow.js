import React, { PropTypes } from 'react';
import RX from 'reactxp';
import * as cst from '../constants';

const styles = {
  row: RX.Styles.createViewStyle({
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    height: cst.TIME_ROW_HEIGHT,
    paddingLeft: cst.ROOM_COL_WIDTH
  }),
  title: RX.Styles.createViewStyle({
    color: cst.TIME_ROW_TITLE_COLOR
  })
};

const TimeRow = props => {
  return (
    <RX.View style={[ styles.row ]}>
      {
        props.hours.map((t, i) =>
          <RX.View
            key={t}
            style={{ width: i === props.hours.length - 1 ? cst.HOUR_WIDTH / 2 : cst.HOUR_WIDTH }}
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
  hours: PropTypes.array
}

export default TimeRow;
