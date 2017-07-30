import React from 'react';
import RX, { StatusBar } from 'reactxp';
import Schedule from './containers/Schedule';
import Detail from './containers/Detail';

let NavigationRouteId = {
  Schedule: 'Schedule',
  Detail: 'Detail'
};

const styles = {
  navCardStyle: RX.Styles.createViewStyle({
    backgroundColor: '#f5fcff'
  })
};

export default class App extends RX.Component {
  _navigator;

  constructor(props) {
    super(props);

    this._onNavigatorRef = this._onNavigatorRef.bind(this);
    this._renderScene = this._renderScene.bind(this);
    this._onPressNavigate = this._onPressNavigate.bind(this);
    this._onPressBack = this._onPressBack.bind(this);

    StatusBar.setBarStyle('light-content', true);
  }

  componentDidMount() {
    this._navigator.immediatelyResetRouteStack([{
      routeId: NavigationRouteId.Schedule,
      sceneConfigType: 'Fade'
    }]);
  }

  render() {
    return (
      <RX.Navigator
        ref={ this._onNavigatorRef }
        renderScene={ this._renderScene }
        cardStyle={ styles.navCardStyle }
      />
    );
  }

  _onNavigatorRef(navigator) {
    this._navigator = navigator;
  }

  _renderScene(navigatorRoute) {
    switch (navigatorRoute.routeId) {
      case NavigationRouteId.Schedule:
        return <Schedule onPressNavigate={ this._onPressNavigate } />;

      case NavigationRouteId.Detail:
        return <Detail onNavigateBack={ this._onPressBack } />;
    }

    return null;
  }

  _onPressNavigate() {
    this._navigator.push({
      routeId: NavigationRouteId.Detail,
      sceneConfigType: "FloatFromRight",
      customSceneConfig: {
        hideShadow: true
      }
    });
  }

  _onPressBack() {
    this._navigator.pop();
  }
};
