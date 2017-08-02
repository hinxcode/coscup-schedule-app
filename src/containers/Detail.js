import React from 'react';
import RX from 'reactxp';
import * as cst from '../constants';
import { getDateDiff } from '../utils'

const styles = {
  container: RX.Styles.createViewStyle({
    flex: 1,
    backgroundColor: cst.DETAIL_HEADER_COLOR
  }),
  header: RX.Styles.createViewStyle({
    marginTop: cst.STATUS_BAR_HEIGHT,
    justifyContent: 'flex-end'
  }),
  scroll: RX.Styles.createScrollViewStyle({
    backgroundColor: cst.BACKGROUND_COLOR,
    padding: 15
  }),
  backButton: RX.Styles.createButtonStyle({
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  }),
  backButtonText: RX.Styles.createTextStyle({
    color: cst.BACKGROUND_COLOR,
    fontSize: 16
  }),
  speakerView: RX.Styles.createViewStyle({
    flexDirection: 'row',
    justifyContent: 'space-around'
  }),
  avatar: RX.Styles.createImageStyle({
    width: 185,
    height: 185
  }),
  sessionInfo: RX.Styles.createViewStyle({
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 5
  }),
  speakerInfo: RX.Styles.createViewStyle({
    flex: 1
  }),
  timeInfo: RX.Styles.createViewStyle({
    flexDirection: 'row',
    alignItems: 'flex-end'
  }),
  langText: RX.Styles.createTextStyle({
    color: cst.ROOM_COL_TITLE_COLOR,
    fontSize: 17,
    textAlign: 'right'
  }),
  nameText: RX.Styles.createTextStyle({
    color: '#dfdfdf',
    fontSize: 27,
    textAlign: 'right',
    paddingTop: 5,
    paddingLeft: 5
  }),
  roomText: RX.Styles.createTextStyle({
    color: '#e4bf7f',
    fontSize: 18
  }),
  timeText: RX.Styles.createTextStyle({
    color: '#64aedf',
    fontSize: 18,
    paddingRight: 10
  }),
  timeDiffText: RX.Styles.createTextStyle({
    color: '#de6875',
    fontSize: 15
  }),
  subjectText: RX.Styles.createTextStyle({
    color: '#dfdfdf',
    fontSize: 23,
    paddingTop: 15,
    paddingBottom: 10
  }),
  summaryText: RX.Styles.createTextStyle({
    color: '#cdcdcd',
    lineHeight: 25,
    fontSize: 15,
    paddingBottom: 20
  }),
  aboutBioText: RX.Styles.createTextStyle({
    color: '#a9d589',
    fontSize: 23,
    paddingTop: 10,
    paddingBottom: 10
  }),
};

export default class Detail extends RX.Component {
  render() {
    const {
      speaker,
      room,
      subject,
      lang,
      summary,
      time,
      start,
      end
    } = this.props.detail;

    return (
      <RX.View style={ styles.container }>
        <RX.View style={ styles.header }>
          <RX.Button style={ styles.backButton } onPress={ this.props.onNavigateBack }>
            <RX.Text style={ styles.backButtonText }>{ '◀  返回' }</RX.Text>
          </RX.Button>
        </RX.View>
        <RX.ScrollView style={ styles.scroll }>
          <RX.View style={ styles.speakerView }>
            <RX.Image
              style={ styles.avatar }
              source={ speaker && speaker.avatar }
              resizeMode={ 'cover' }
            />
            <RX.View style={ styles.speakerInfo }>
              <RX.Text style={ styles.langText }>{ lang }</RX.Text>
              <RX.Text style={ styles.nameText }>{ speaker && speaker.name }</RX.Text>
            </RX.View>
          </RX.View>
          <RX.View>
            <RX.Text style={ styles.subjectText }>{ subject }</RX.Text>
          </RX.View>
          <RX.View style={ styles.sessionInfo }>
            <RX.Text style={ styles.roomText }>{ `ROOM ${room}` }</RX.Text>
            <RX.View style={ styles.timeInfo }>
              <RX.Text style={ styles.timeText }>
                { time }
              </RX.Text>
              <RX.Text style={ styles.timeDiffText }>
                { `${getDateDiff(new Date(start), new Date(end))} mins` }
              </RX.Text>
            </RX.View>
          </RX.View>
          <RX.View>
            <RX.Text style={ styles.summaryText }>{ summary }</RX.Text>
          </RX.View>
          <RX.View>
            {
              speaker && speaker.bio ? <RX.Text style={ styles.aboutBioText }>關於講者</RX.Text> : null
            }
          </RX.View>
          <RX.View>
            <RX.Text style={ styles.summaryText }>{ speaker && speaker.bio }</RX.Text>
          </RX.View>
        </RX.ScrollView>
      </RX.View>
    );
  }
}
