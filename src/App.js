import React from 'react';
import RX, { StatusBar } from 'reactxp';
import Schedule from './containers/Schedule';
import Detail from './containers/Detail';
import * as cst from './constants';
import { getScheduleData } from './utils';

export default class App extends RX.Component {
  navigator;

  constructor(props) {
    super(props);

    this.state = {
      json: {},
      dateList: [],
      initDate: 0,
      detail: {},
      isDownloading: true
    };

    StatusBar.setBarStyle('light-content', true);
  }

  componentDidMount() {
    this.getData();

    this.navigator.immediatelyResetRouteStack([{
      routeId: 'SCHEDULE',
      sceneConfigType: 'FloatFromLeft'
    }]);
  }

  getData() {
    getScheduleData().then(res => {
      this.setState({
        json: res,
        dateList: Object.keys(res),
        initDate: Object.keys(res)[0],
        isDownloading: false
      });
    }).catch(err => {
      this.setState({
        isDownloading: false
      });

      RX.Alert.show('錯誤', `議程表資料下載失敗。`);
    });
  }

  render() {
    return (
      <RX.Navigator
        ref={ ref => { this.navigator = ref } }
        renderScene={ route => this.renderScene(route) }
        cardStyle={{
          backgroundColor: cst.BACKGROUND_COLOR
        }}
      />
    );
  }

  renderScene(navigatorRoute) {
    if (navigatorRoute.routeId === 'SCHEDULE') {
      return (
        <Schedule
          json={ this.state.json }
          dateList={ this.state.dateList }
          initDate={ this.state.initDate }
          isDownloading={ this.state.isDownloading }
          onPressNavigate={ detail => { this.onPressNavigate(detail) } }
          onPressRefetch={ () => { this.getData() } }
        />
      );
    } else {
      return (
        <Detail
          detail={ this.state.detail }
          onNavigateBack={ () => { this.onPressBack() } }
        />
      );
    }
  }

  onPressNavigate(detail) {
    if (detail.subject !== this.state.detail.subject) {
      this.setState({ detail });

      this.navigator.push({
        routeId: detail.subject,
        sceneConfigType: 'FloatFromLeft',
        customSceneConfig: {
          hideShadow: true
        }
      });

      StatusBar.setBarStyle('dark-content', true);
    }
  }

  onPressBack() {
    this.navigator.pop();

    StatusBar.setBarStyle('light-content', true);
  }
};
