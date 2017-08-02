import React from 'react';
import RX from 'reactxp';
import { Block, EmptyBlock } from '../components/Block';
import TimeRow from '../components/TimeRow';
import NavBar from '../components/NavBar';
import Modals from '../components/modals';
import config from '../config';
import * as cst from '../constants';
import { getDateDiff, getWidthByTime, getPickerItems } from '../utils';

const styles = {
  container: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: cst.BACKGROUND_COLOR,
    overflow: 'scroll'
  }),
  scroll: RX.Styles.createViewStyle({
    marginTop: cst.STATUS_BAR_HEIGHT,
    paddingRight: 15
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
      pickedDate: 0,  // temp state for date picker
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

    // add Empty blocks for free time
    if (breakTime > 0) {
      if (prevEnd.getMinutes() + breakTime > 60) {
        blocks.push(
          <EmptyBlock width={ getWidthByTime(60 - prevEnd.getMinutes()) } isOClock={ prevEnd.getMinutes() === 0 } />
        );
        for (let n = 1; n < Math.floor((prevEnd.getMinutes() + breakTime) / 60); n++) {
          blocks.push(
            <EmptyBlock width={ getWidthByTime(60) } isOClock />
          );
        }
        if ((prevEnd.getMinutes() + breakTime) % 60 > 0) {
          blocks.push(
            <EmptyBlock width={ getWidthByTime((prevEnd.getMinutes() + breakTime) % 60) } isOClock />
          );
        }
      } else {
        blocks.push(
          <EmptyBlock width={ getWidthByTime(breakTime) } isOClock={ prevEnd.getMinutes() === 0 } />
        );
      }
    }

    // add session blocks
    if (sessionTime > 0) {
      if (curStart.getMinutes() + sessionTime > 60) {
        blocks.push(
          <Block
            width={ getWidthByTime(60 - curStart.getMinutes()) }
            textWidth={ getWidthByTime(sessionTime) }
            detail={ target }
            filter={ filter }
            isOClock={ curStart.getMinutes() === 0 }
            onSessionClick={ () => { this.onShowModal(cst.MODAL_DETAIL, { target }) } }
          />
        );
        for (let n = 1; n < Math.floor((curStart.getMinutes() + sessionTime) / 60); n++) {
          blocks.push(
            <Block
              width={ getWidthByTime(60) }
              hasNoLeftBound
              hasNoRightBound={ n + 1 < Math.floor((curStart.getMinutes() + sessionTime) / 60) }
              isOClock
              onSessionClick={ () => { this.onShowModal(cst.MODAL_DETAIL, { target }) } }
            />
          );
        }
        if ((curStart.getMinutes() + sessionTime) % 60 > 0) {
          blocks.push(
            <Block
              width={ getWidthByTime((curStart.getMinutes() + sessionTime) % 60) }
              hasNoLeftBound
              isOClock
              onSessionClick={ () => { this.onShowModal(cst.MODAL_DETAIL, { target }) } }
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
            onSessionClick={ () => { this.onShowModal(cst.MODAL_DETAIL, { target }) } }
          />
        );
      }
    }

    return blocks;
  }

  getScheduleView() {
    const filter = {
      date: this.props.date || Object.keys(this.props.json)[0],
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

  onShowModal(modalId, data = {}) {
    switch (modalId) {
      case cst.MODAL_DETAIL:
        RX.Modal.show(
          <Modals.Detail
            detail={ data.target }
            onPressBack={ () => { RX.Modal.dismiss(modalId); } }
          />, modalId);
        break;
      case cst.MODAL_DATE_PICKER:
      default:
        RX.Modal.show(
          <Modals.DatePicker
            items={ getPickerItems(this.props.dateList) }
            initDate={ this.props.date }
            onPickerChange={ v => { this.setState({ pickedDate: v }) } }
            onConfirm={ () => {
              this.props.onChangeDate(this.state.pickedDate);
              RX.Modal.dismiss(modalId);
            } }
          />, modalId);
    }
  }

  render() {
    return (
      <RX.View style={ styles.container }>
        {
          Object.keys(this.props.json).length
          ? <RX.ScrollView
              style={ styles.scroll }
              vertical={ false }
              horizontal
              bounces={ false }
              onScrollBeginDrag={ () => {} }
              onScrollEndDrag={ () => {} }
            >
              <RX.ScrollView
                style={ styles.scroll }
                vertical
                horizontal={ false }
                bounces={ false }
                onScrollBeginDrag={ () => {} }
                onScrollEndDrag={ () => {} }
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
