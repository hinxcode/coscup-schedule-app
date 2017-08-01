import React from 'react';
import RX from 'reactxp';
import Block from '../components/Block';
import TimeRow from '../components/TimeRow';
import NavBar from '../components/NavBar';
import Modals from '../components/modals';
import config from '../config';
import * as cst from '../constants';
import { getDateDiff, getWidthByTime, getPickerItems } from '../utils';

const styles = {
  container: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: cst.BACKGROUND_COLOR
  }),
  scroll: RX.Styles.createScrollViewStyle({
    marginTop: cst.STATUS_BAR_HEIGHT,
    paddingRight: 15,
    flexDirection: 'column',
    alignSelf: 'center'
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
  })
};

export default class Schedule extends RX.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: 0,
      display: 'subject'
    };
  }

  getBlocks(prev, target, filter) {
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
            width={ getWidthByTime(60 - prevEnd.getMinutes()) }
            isEmpty
            isOClock={ prevEnd.getMinutes() === 0 }
          />
        );
        for (let n = 1; n < Math.floor((prevEnd.getMinutes() + breakTime) / 60); n++) {
          blocks.push(
            <Block
              width={ getWidthByTime(60) }
              isEmpty
              isOClock
            />
          );
        }
        if ((prevEnd.getMinutes() + breakTime) % 60 > 0) {
          blocks.push(
            <Block
              width={ getWidthByTime((prevEnd.getMinutes() + breakTime) % 60) }
              isEmpty
              isOClock
            />
          );
        }
      } else {
        blocks.push(
          <Block
            width={ getWidthByTime(breakTime) }
            isEmpty
            isOClock={ prevEnd.getMinutes() === 0 }
          />
        );
      }
    }

    if (sessionTime > 0) {
      if (curStart.getMinutes() + sessionTime > 60) {
        blocks.push(
          <Block
            width={ getWidthByTime(60 - curStart.getMinutes()) }
            textWidth={ getWidthByTime(sessionTime) }
            detail={ target }
            filter={ filter }
            hasNoRightBound
            isOClock={ curStart.getMinutes() === 0 }
            onSessionClick={ () => { this.props.onPressNavigate(target) } }
          />
        );
        for (let n = 1; n < Math.floor((curStart.getMinutes() + sessionTime) / 60); n++) {
          blocks.push(
            <Block
              width={ getWidthByTime(60) }
              isEmptyButHasTimeLine
              hasNoRightBound
              isOClock
              onSessionClick={ () => { this.props.onPressNavigate(target) } }
            />
          );
        }
        if ((curStart.getMinutes() + sessionTime) % 60 > 0) {
          blocks.push(
            <Block
              width={ getWidthByTime((curStart.getMinutes() + sessionTime) % 60) }
              isEmptyButHasTimeLine
              isOClock
              onSessionClick={ () => { this.props.onPressNavigate(target) } }
            />
          );
        }
      } else {
        blocks.push(
          <Block
            width={ getWidthByTime(sessionTime) }
            detail={ target }
            filter={ filter }
            isOClock={ curStart.getMinutes() === 0 }
            onSessionClick={ () => { this.props.onPressNavigate(target) } }
          />
        );
      }
    }

    return blocks;
  }

  getScheduleView() {
    const filter = {
      date: this.state.date || Object.keys(this.props.json)[0],
      display: this.state.display
    }
    const data = this.props.json[filter.date];
    const result = [];
    let columns = [];

    for (let room of Object.keys(data)) {
      for (let i = 0; i < data[room].length; i++) {
        if (i < 1) {
          columns.push(this.getBlocks(null, data[room][i], filter));
        } else {
          columns.push(this.getBlocks(data[room][i - 1], data[room][i], filter));
        }
      }

      /* just for remaining free time block */
      const ending = new Date(data[room][data[room].length - 1].end);
      ending.setHours(config.ending.split(':')[0]);
      ending.setMinutes(config.ending.split(':')[1]);

      if (getDateDiff(new Date(data[room][data[room].length - 1].end), ending) > 60) {
        columns.push(this.getBlocks(data[room][data[room].length - 1], { start: ending, end: ending }, filter));
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

  onShowModal(modalId) {
    switch (modalId) {
      case cst.MODAL_DATE_PICKER:
        RX.Modal.show(
          <Modals.DatePicker
            items={ getPickerItems(this.props.dateList) }
            initDate={ this.state.date }
            onPickerChange={ v => { this.setState({ date: v }) } }
            onConfirm={ () => { RX.Modal.dismiss(modalId) } }
          />, modalId);
    }
  }

  render() {
    return (
      <RX.View style={ styles.container }>
        {
          Object.keys(this.props.json).length
          ? <RX.ScrollView
              vertical={ false }
              horizontal={ true }
              bounces={ false }
            >
              <RX.ScrollView
                style={ styles.scroll }
                vertical={ true }
                horizontal={ false }
                bounces={ false }
              >
                <TimeRow
                  begin={ parseInt(config.begin.split(':')[1]) > 0 ? parseInt(config.begin.split(':')[0]) + 1 :config.begin.split(':')[0] }
                  ending={ parseInt(config.ending.split(':')[1]) > 0 ? parseInt(config.ending.split(':')[0]) + 1 :config.ending.split(':')[0] }
                  minutesPadding={ getWidthByTime(60 - config.begin.split(':')[1]) }
                />
                { this.getScheduleView() }
                <TimeRow
                  begin={ parseInt(config.begin.split(':')[1]) > 0 ? parseInt(config.begin.split(':')[0]) + 1 :config.begin.split(':')[0] }
                  ending={ parseInt(config.ending.split(':')[1]) > 0 ? parseInt(config.ending.split(':')[0]) + 1 :config.ending.split(':')[0] }
                  minutesPadding={ getWidthByTime(60 - config.begin.split(':')[1]) }
                />
              </RX.ScrollView>
            </RX.ScrollView>
          : <RX.View style={{ height: '100%', justifyContent: 'center' }}>
              <RX.ActivityIndicator color={ '#fff' } />
            </RX.View>
        }
        <NavBar
          filterName={ this.state.display }
          filterFunc={ v => { this.setState({ display: v }) } }
          modalFunc={ id => this.onShowModal(id) }
        />
      </RX.View>
    );
  }
}
