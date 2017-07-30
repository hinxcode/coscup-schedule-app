import React from 'react';
import RX from 'reactxp';
import Block from '../components/Block';
import TimeRow from '../components/TimeRow';
import config from '../../config';
import * as cst from '../constants';
import { getDateDiff, getWidthByTime, getScheduleData } from '../utils';

const styles = {
  scroll: RX.Styles.createScrollViewStyle({
    marginTop: 20,
    paddingRight: 15,
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: 'rgb(40, 44, 52)'
  }),
  row: RX.Styles.createViewStyle({
    flexDirection: 'row',
    alignSelf: 'flex-start'
  }),
  roomBlock: RX.Styles.createViewStyle({
    width: cst.ROOM_COL_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }),
  roomTitle: RX.Styles.createViewStyle({
    color: cst.ROOM_COL_TITLE_COLOR
  }),
};

const getBlocks = (prev, target) => {
  const blocks = [];
  let prevEnd;

  if (prev === null) {
    prevEnd = new Date(target.start);
    prevEnd.setHours(config.begin.split(':')[0]);
    prevEnd.setMinutes(config.begin.split(':')[1]);
  } else {
    prevEnd = new Date(prev.end);
  }

  const curStart = new Date(target.start);
  const curEnd = new Date(target.end);
  const breakTime = getDateDiff(prevEnd, curStart);
  const sessionTime = getDateDiff(curStart, curEnd);

  if (breakTime > 0) {
    if (prevEnd.getMinutes() + breakTime > 60) {
      blocks.push(
        <Block
          width={getWidthByTime(60 - prevEnd.getMinutes())}
          isEmpty
          isOClock={prevEnd.getMinutes() === 0}
        />
      );
      for (let n = 1; n < Math.floor((prevEnd.getMinutes() + breakTime) / 60); n++) {
        blocks.push(
          <Block
            width={getWidthByTime(60)}
            isEmpty
            isOClock
          />
        );
      }
      if ((prevEnd.getMinutes() + breakTime) % 60 > 0) {
        blocks.push(
          <Block
            width={getWidthByTime((prevEnd.getMinutes() + breakTime) % 60)}
            isEmpty
            isOClock
          />
        );
      }
    } else {
      blocks.push(
        <Block
          width={getWidthByTime(breakTime)}
          isEmpty
          isOClock={prevEnd.getMinutes() === 0}
        />
      );
    }
  }

  if (sessionTime > 0) {
    if (curStart.getMinutes() + sessionTime > 60) {
      blocks.push(
        <Block
          width={getWidthByTime(60 - curStart.getMinutes())}
          textWidth={getWidthByTime(sessionTime)}
          detail={target}
          hasNoRightBound
          isOClock={curStart.getMinutes() === 0}
        />
      );
      for (let n = 1; n < Math.floor((curStart.getMinutes() + sessionTime) / 60); n++) {
        blocks.push(
          <Block
            width={getWidthByTime(60)}
            isEmptyButHasTimeLine
            hasNoRightBound
            isOClock
          />
        );
      }
      if ((curStart.getMinutes() + sessionTime) % 60 > 0) {
        blocks.push(
          <Block
            width={getWidthByTime((curStart.getMinutes() + sessionTime) % 60)}
            isEmptyButHasTimeLine
            isOClock
          />
        );
      }
    } else {
      blocks.push(
        <Block
          width={getWidthByTime(sessionTime)}
          detail={target}
          isOClock={curStart.getMinutes() === 0}
        />
      );
    }
  }

  return blocks;
}

export default class Schedule extends RX.Component {
    constructor(props) {
      super(props);

      this.state = {
        json: []
      };
    }

    componentDidMount() {
      getScheduleData().then(res => {
        this.setState({
          json: res
        });
      })
    }

    getScheduleView(filter = {}) {
      const data = this.state.json[filter.date ? filter.date : Object.keys(this.state.json)[0]];
      const result = [];
      let columns = [];

      for (let room of Object.keys(data)) {
        for (let i = 0; i < data[room].length; i++) {
          if (i < 1) {
            columns.push(getBlocks(null, data[room][i]));
          } else {
            columns.push(getBlocks(data[room][i - 1], data[room][i]));
          }
        }

        /* just for remaining free time block */
        const ending = new Date(data[room][data[room].length - 1].end);
        ending.setHours(config.ending.split(':')[0]);
        ending.setMinutes(config.ending.split(':')[1]);

        if (getDateDiff(new Date(data[room][data[room].length - 1].end), ending) > 60) {
          columns.push(getBlocks(data[room][data[room].length - 1], { start: ending, end: ending}));
        }

        result.push(
          <RX.View key={room} style={ styles.row }>
            <RX.View style={ styles.roomBlock }>
              <RX.Text style={ styles.roomTitle }>
                { room }
              </RX.Text>
            </RX.View>
            { columns }
          </RX.View>
        );

        columns = [];
      }

      return result;
    }

    render() {
      return (
        <RX.ScrollView
          style={ styles.scroll }
          vertical={ false }
          horizontal={ false }
          bounces={ false }
        >
          <TimeRow
            begin={parseInt(config.begin.split(':')[1]) > 0 ? parseInt(config.begin.split(':')[0]) + 1 :config.begin.split(':')[0]}
            ending={parseInt(config.ending.split(':')[1]) > 0 ? parseInt(config.ending.split(':')[0]) + 1 :config.ending.split(':')[0]}
            minutesPadding={getWidthByTime(60 - config.begin.split(':')[1])}
          />
          {
            Object.keys(this.state.json).length ? this.getScheduleView() : null
          }
          <TimeRow
            begin={parseInt(config.begin.split(':')[1]) > 0 ? parseInt(config.begin.split(':')[0]) + 1 :config.begin.split(':')[0]}
            ending={parseInt(config.ending.split(':')[1]) > 0 ? parseInt(config.ending.split(':')[0]) + 1 :config.ending.split(':')[0]}
            minutesPadding={getWidthByTime(60 - config.begin.split(':')[1])}
          />
        </RX.ScrollView>
      );
    }
}
