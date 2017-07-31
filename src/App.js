import React from 'react';
import RX, { StatusBar } from 'reactxp';
import Schedule from './containers/Schedule';
import Detail from './containers/Detail';
import { getScheduleData } from './utils';

let NavigationRouteId = {
  Schedule: 'SchedulePage',
  Detail: 'DetailPage'
};

const styles = {
  navCardStyle: RX.Styles.createViewStyle({
    backgroundColor: '#f5fcff'
  })
};

export default class App extends RX.Component {
  navigator;

  constructor(props) {
    super(props);

    this.onNavigatorRef = this.onNavigatorRef.bind(this);
    this.renderScene = this.renderScene.bind(this);
    this.onPressNavigate = this.onPressNavigate.bind(this);
    this.onPressBack = this.onPressBack.bind(this);

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

    this.navigator.immediatelyResetRouteStack([{
      routeId: NavigationRouteId.Schedule,
      sceneConfigType: 'Fade'
    }]);
  }

  render() {
    return (
      <RX.Navigator
        ref={ this.onNavigatorRef }
        renderScene={ this.renderScene }
        cardStyle={ styles.navCardStyle }
      />
    );
  }

  onNavigatorRef(navigator) {
    this.navigator = navigator;
  }

  renderScene(navigatorRoute) {
    switch (navigatorRoute.routeId) {
      case NavigationRouteId.Schedule:
        return (
          <Schedule
            json={ this.state.json }
            dateList={ this.state.dateList }
            date={ this.state.date }
            onChangeDate={ d => { this.setState({ date: d }) } }
            onPressNavigate={ this.onPressNavigate }
          />
        );
      case NavigationRouteId.Detail:
        return <Detail onNavigateBack={ this.onPressBack } />;
    }

    return null;
  }

  onPressNavigate() {
    this.navigator.push({
      routeId: NavigationRouteId.Detail,
      sceneConfigType: 'FloatFromRight',
      customSceneConfig: {
        hideShadow: true
      }
    });
  }

  onPressBack() {
    this.navigator.pop();
  }
};
