import React from 'react';
import RX from 'reactxp';
import * as cst from '../../constants';

const styles = {
  modal: RX.Styles.createViewStyle({
    backgroundColor: '#fff',
    borderRadius: 3,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  }),
  picker: RX.Styles.createPickerStyle({
    width: 200
  }),
  button: RX.Styles.createButtonStyle({
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 100,
    paddingRight: 100
  }),
  buttonText: RX.Styles.createTextStyle({
    fontSize: 15,
    color: cst.BACKGROUND_COLOR
  }),
};

export default class DatePicker extends RX.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: props.initDate
    };
  }

  onChange(value, index) {
    this.setState({
      date: value
    });

    this.props.onPickerChange(value);
  }

  render() {
    return (
      <RX.View style={ styles.modal }>
        <RX.Picker
          style={ styles.picker }
          items={ this.props.items }
          selectedValue={ this.state.date }
          onValueChange={ (v, i) => this.onChange(v, i) }
        />
        <RX.Button
          style={ styles.button }
          onPress={ () => this.props.onConfirm(this.state.date) }
        >
          <RX.Text style={ styles.buttonText }>確定</RX.Text>
        </RX.Button>
      </RX.View>
    );
  }
}
