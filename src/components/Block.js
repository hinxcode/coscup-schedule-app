import React from 'react';
import PropTypes from 'prop-types';
import RX from 'reactxp';
import * as cst from '../constants';

const styles = {
  sessionBlock: RX.Styles.createViewStyle({
    height: cst.SESSION_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'visible'
  }),
  timeLine: RX.Styles.createViewStyle({
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderLeftColor: cst.BACKGROUND_COLOR,
    borderRightWidth: 4,
    borderRightColor: cst.BACKGROUND_COLOR,
    borderBottomWidth: 3,
    borderBottomColor: 'rgb(210, 100, 117)'
  }),
  sessionTitle: RX.Styles.createTextStyle({
    maxHeight: cst.SESSION_HEIGHT,
    overflow: 'hidden',
    color: '#eee',
    paddingLeft: 3,
    paddingRight: 3,
    fontSize: 14,
    zIndex: 2
  }),
  emptyBlock: RX.Styles.createViewStyle({
    height: cst.SESSION_HEIGHT
  }),
  verticalTimeLine: RX.Styles.createViewStyle({
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(93, 93, 93, 0.8)',
    zIndex: 1
  }),
  noLeftBorder: RX.Styles.createViewStyle({
    borderLeftWidth: 0
  }),
  noRightBorder: RX.Styles.createViewStyle({
    borderRightWidth: 0
  }),
  button: RX.Styles.createButtonStyle({
    overflow: 'visible'
  })
};

const getSubString = (subject, maxWidth) => {
  if (maxWidth < 30) {
    return subject.substring(0, 5) +
           (subject.length > 5 ? '..' : '');
  } else if (maxWidth < 50) {
    return subject.substring(0, 10) +
           (subject.length > 10 ? '..' : '');
  } else if (maxWidth < 100) {
    return subject.substring(0, 20) +
           (subject.length > 20 ? '..' : '');
  } else if (maxWidth < 150) {
    return subject.substring(0, 30) +
           (subject.length > 30 ? '..' : '');
  } else {
    return subject;
  }
}

export const EmptyBlock = props => {
  return (
    <RX.View style={[
      styles.emptyBlock,
      props.isOClock ? styles.verticalTimeLine : {},
      { width: props.width }
    ]} />
  )
}

export const Block = props => {
  return (
    <RX.Button
      style={[ styles.button ]}
      onPress={ props.onSessionClick }
    >
      <RX.View
        style={[
          styles.sessionBlock,
          props.isOClock ? styles.verticalTimeLine : {},
          { width: props.width }
        ]}
      >
          {
            <RX.Text style={[
              styles.sessionTitle,
              { width: props.textWidth || props.width }
            ]}>
              {
                props.detail && props.filter && props.detail[props.filter.display]
                ? getSubString(props.detail[props.filter.display], props.textWidth || props.width)
                : null
              }
            </RX.Text>
          }
          <RX.View style={[
            styles.timeLine,
            props.hasNoLeftBound ? styles.noLeftBorder : {},
            props.hasNoRightBound ? styles.noRightBorder : {},
            { width: props.textWidth || props.width }
          ]} />
      </RX.View>
    </RX.Button>
  );
}

EmptyBlock.propTypes = {
  width: PropTypes.number,
  textWidth: PropTypes.number,
  isOClock: PropTypes.bool
}

Block.propTypes = {
  width: PropTypes.number,
  textWidth: PropTypes.number,
  hasNoLeftBound: PropTypes.bool,
  hasNoRightBound: PropTypes.bool,
  detail: PropTypes.object,
  filter: PropTypes.object,
  isOClock: PropTypes.bool,
  onSessionClick: PropTypes.func
}
