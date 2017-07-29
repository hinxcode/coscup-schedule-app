import React, { PropTypes } from 'react';
import RX from 'reactxp';
import * as cst from '../constants';

const styles = {
  sessionBlock: RX.Styles.createViewStyle({
    height: cst.SESSION_HEIGHT,
    justifyContent: 'flex-end',
    borderBottomWidth: 3,
    borderBottomColor: 'rgb(210, 100, 117)',
    borderLeftWidth: 4,
    borderLeftColor: 'rgb(40, 44, 52)',
    borderRightWidth: 4,
    borderRightColor: 'rgb(40, 44, 52)',
    overflow: 'visible',
    zIndex: 2
  }),
  sessionTime: RX.Styles.createTextStyle({
    color: '#DDD',
    textAlign: 'center'
  }),
  sessionTitle: RX.Styles.createTextStyle({
    color: '#FFF',
    paddingRight: 5
  }),
  emptyBlock: RX.Styles.createViewStyle({
    height: cst.SESSION_HEIGHT
  }),
  verticalTimeLine: RX.Styles.createViewStyle({
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(93, 93, 93, 0.8)',
    zIndex: 1
  }),
  noLeftBorder: RX.Styles.createViewStyle({
    borderLeftWidth: 0
  }),
  noRightBorder: RX.Styles.createViewStyle({
    borderRightWidth: 0
  })
};

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
      {
        // props.isEmpty || props.isEmptyButHasTimeLine
        // ? null
        // : <RX.Text style={ [styles.sessionTime, { width: props.textWidth || props.width }] }>
        //     {props.detail ? '8:45~9:15' : null}
        //   </RX.Text>
      }
      {
        props.isEmpty || props.isEmptyButHasTimeLine
        ? null
        : <RX.Text style={[ styles.sessionTitle, { width: props.textWidth || props.width } ]}>
            {
              props.detail && props.detail.subject
              ? props.detail.subject.substring(0, cst.SUBJECT_MIN_LENGTH) +
                (
                  props.detail.subject.length > cst.SUBJECT_MIN_LENGTH ? '..' : ''
                )
              : null
            }
          </RX.Text>
      }
    </RX.View>
  );
}

Block.propTypes = {
  width: PropTypes.number,
  textWidth: PropTypes.number,
  detail: PropTypes.object,
  isEmpty: PropTypes.bool,
  isEmptyButHasTimeLine: PropTypes.bool,
  isOClock: PropTypes.bool
}

export default Block;
