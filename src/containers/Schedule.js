import React from 'react';
import RX from 'reactxp';
import { Block, EmptyBlock } from '../components/Block';
import TimeRow from '../components/TimeRow';
import NavBar from '../components/NavBar';
import Modals from '../components/modals';
import config from '../config';
import * as cst from '../constants';
import { getDateDiff, getWidthByTime, getPickerItems } from '../utils';
import iconReload from '../img/reload.png';

const styles = {
  container: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: cst.BACKGROUND_COLOR,
    overflow: 'scroll'
  }),
  iconContainer: RX.Styles.createViewStyle({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cst.BACKGROUND_COLOR
  }),
  scrollX: RX.Styles.createScrollViewStyle({
    alignSelf: 'center'
  }),
  scrollY: RX.Styles.createScrollViewStyle({
    marginTop: cst.STATUS_BAR_HEIGHT
  }),
  row: RX.Styles.createViewStyle({
    flexDirection: 'row',
    alignSelf: 'flex-start',
    overflow: 'visible'
  }),
  roomBlock: RX.Styles.createViewStyle({
    width: cst.ROOM_COL_WIDTH,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }),
  roomTitle: RX.Styles.createViewStyle({
    color: cst.ROOM_COL_TITLE_COLOR
  }),
  reloadText: RX.Styles.createViewStyle({
    color: cst.ROOM_COL_TITLE_COLOR,
    paddingTop: 10
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

  getBlocks(prev, target, index, filter) {
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

    if (sessionTime > 0) {
      if (curStart.getMinutes() + sessionTime > 60) {
        blocks.push(
          <Block
            width={ getWidthByTime(60 - curStart.getMinutes()) }
            textWidth={ getWidthByTime(sessionTime) }
            detail={ target }
            filter={ filter }
            zIndex={ index }
            isOClock={ curStart.getMinutes() === 0 }
            onSessionClick={ () => { this.props.onPressNavigate(target) } }
          />
        );
        for (let n = 1; n < Math.floor((curStart.getMinutes() + sessionTime) / 60); n++) {
          blocks.push(
            <Block
              width={ getWidthByTime(60) }
              hasNoLeftBound
              hasNoRightBound={ n + 1 < Math.floor((curStart.getMinutes() + sessionTime) / 60) }
              isOClock
              zIndex={ index + n }
              onSessionClick={ () => { this.props.onPressNavigate(target) } }
            />
          );
        }
        if ((curStart.getMinutes() + sessionTime) % 60 > 0) {
          blocks.push(
            <Block
              width={ getWidthByTime((curStart.getMinutes() + sessionTime) % 60) }
              hasNoLeftBound
              isOClock
              zIndex={ index + Math.floor((curStart.getMinutes() + sessionTime) / 60) }
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
            zIndex={ index }
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
          columns.push(this.getBlocks(null, data[room][i], i, filter));
        } else {
          columns.push(this.getBlocks(data[room][i - 1], data[room][i], i, filter));
        }
      }

      /* just for remaining free time block */
      const ending = new Date(data[room][data[room].length - 1].end);
      ending.setHours(config.ending.split(':')[0]);
      ending.setMinutes(config.ending.split(':')[1]);

      if (getDateDiff(new Date(data[room][data[room].length - 1].end), ending) > 60) {
        columns.push(this.getBlocks(data[room][data[room].length - 1], { start: ending, end: ending }, data[room].length - 1, filter));
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
    if (this.props.isDownloading) {
      return (
        <RX.View style={ styles.iconContainer }>
          <RX.ActivityIndicator color={ '#fff' } />
        </RX.View>
      );
    } else if (Object.keys(this.props.json).length > 0) {
      return (
        <RX.View style={ styles.container }>
          <RX.ScrollView
            style={[ styles.scrollY, RX.Platform.getType() === 'web' && { overflowY: 'visible' } ]}
            vertical={ false }
            horizontal
            bounces={ false }
            onScrollBeginDrag={ () => {} }
            onScrollEndDrag={ () => {} }
          >
            <RX.ScrollView
              style={[ styles.scrollX, RX.Platform.getType() === 'web' && { overflowX: 'visible' } ]}
              vertical
              horizontal={ false }
              bounces
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
          <NavBar
            date={ this.props.dateList.indexOf(this.state.date) > 0 ? this.props.dateList.indexOf(this.state.date) + 1 : '1' }
            filterName={ this.state.display }
            filterFunc={ v => { this.setState({ display: v }) } }
            modalFunc={ id => this.onShowModal(id) }
          />
        </RX.View>
      );
    } else {
      return (
        <RX.View style={ styles.iconContainer }>
          <RX.Button
            onPress={ () => this.props.onPressRefetch() }
          >
            <RX.Image
              style={{ height: 32, width: 32 }}
              source={ iconReload }
              resizeMode={ 'cover' }
            />
            <RX.Text style={ styles.reloadText }>
              重試
            </RX.Text>
          </RX.Button>
        </RX.View>
      );
    }
  }
}
