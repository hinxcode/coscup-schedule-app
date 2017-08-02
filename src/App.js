import React from 'react';
import RX, { StatusBar } from 'reactxp';
import Schedule from './containers/Schedule';
import { getScheduleData } from './utils';

export default class App extends RX.Component {
  constructor(props) {
    super(props);

    this.state = {
      json: {},
      dateList: [],
      date: 0
    };

    StatusBar.setBarStyle('light-content', true);
  }

  componentDidMount() {
    getScheduleData().then(res => {
      this.setState({
        json: res,
        dateList: Object.keys(res),
        date: Object.keys(res)[0]
      });
    }).catch(err => {
      RX.Alert.show('錯誤', `議程表資料下載失敗。`);
    });
  }

  render() {
    return (
      <Schedule
        json={ this.state.json }
        dateList={ this.state.dateList }
        date={ this.state.date }
        onChangeDate={ d => { this.setState({ date: d }) } }
      />
    );
  }
};
