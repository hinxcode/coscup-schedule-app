import React from 'react';
import PropTypes from 'prop-types';
import RX from 'reactxp';
import * as cst from '../constants';

const styles = {
  sessionBlock: RX.Styles.createViewStyle({
    height: cst.SESSION_HEIGHT,
    justifyContent: 'flex-end',
    overflow: 'visible',
    zIndex: 2
  }),
  sessionTime: RX.Styles.createTextStyle({
    color: '#ddd',
    textAlign: 'center'
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
    color: '#fff',
    paddingLeft: 3,
    paddingRight: 3
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
    overflow: 'visible',
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

const Block = props => {
  return (
    <RX.View
      style={[
        props.isEmpty ? styles.emptyBlock : styles.sessionBlock,
        props.isEmptyButHasTimeLine ? styles.noLeftBorder : {},
        props.hasNoRightBound ? styles.noRightBorder : {},
        props.isOClock ? styles.verticalTimeLine : {},
        { width: props.width }
      ]}
    >
      <RX.Button
        style={[ styles.button ]}
        onPress={ props.onSessionClick ? props.onSessionClick : () => {} }
      >
        {
          props.isEmpty || props.isEmptyButHasTimeLine
          ? null
          : <RX.Text style={[
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
        {
          props.isEmpty || props.isEmptyButHasTimeLine
          ? null
          : <RX.View style={[ styles.timeLine, { width: props.textWidth || props.width } ]} />
        }
      </RX.Button>
    </RX.View>
  );
}

Block.propTypes = {
  width: PropTypes.number,
  textWidth: PropTypes.number,
  detail: PropTypes.object,
  filter: PropTypes.object,
  isEmpty: PropTypes.bool,
  isEmptyButHasTimeLine: PropTypes.bool,
  isOClock: PropTypes.bool,
  onSessionClick: PropTypes.func
}

export default Block;
