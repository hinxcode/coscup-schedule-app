import React from 'react';
import RX, { StatusBar } from 'reactxp';
import Schedule from './containers/Schedule';
import Detail from './containers/Detail';
import * as cst from './constants';
import { getScheduleData } from './utils';

const NavigationRouteId = {
  Schedule: 'SchedulePage',
  Detail: 'DetailPage'
};

export default class App extends RX.Component {
  navigator;

  constructor(props) {
    super(props);

    this.state = {
      json: {},
      dateList: [],
      initDate: 0,
      detail: {}
    };

    StatusBar.setBarStyle('light-content', true);
  }

  componentDidMount() {
    getScheduleData().then(res => {
      this.setState({
        json: res,
        dateList: Object.keys(res),
        initDate: Object.keys(res)[0]
      });
    }).catch(err => {
      RX.Alert.show('錯誤', `議程表資料下載失敗。`);
    });

    this.navigator.immediatelyResetRouteStack([{
      routeId: NavigationRouteId.Schedule,
      sceneConfigType: 'FloatFromLeft'
    }]);
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
    switch (navigatorRoute.routeId) {
      case NavigationRouteId.Schedule:
        return (
          <Schedule
            json={ this.state.json }
            dateList={ this.state.dateList }
            initDate={ this.state.initDate }
            onPressNavigate={ detail => { this.onPressNavigate(detail) } }
          />
        );
      case NavigationRouteId.Detail:
        return (
          <Detail
            detail={ this.state.detail }
            onNavigateBack={ () => { this.onPressBack() } }
          />
        );
    }

    return null;
  }

  onPressNavigate(detail) {
    this.setState({ detail });

    this.navigator.push({
      routeId: NavigationRouteId.Detail,
      sceneConfigType: 'FloatFromLeft',
      customSceneConfig: {
        hideShadow: true
      }
    });

    StatusBar.setBarStyle('dark-content', true);
  }

  onPressBack() {
    this.navigator.pop();

    StatusBar.setBarStyle('light-content', true);
  }
};
