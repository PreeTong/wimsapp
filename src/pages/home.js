
import React, { Component } from 'react';
import {
  AppRegistry, Text, TextInput, View,
  StyleSheet, LayoutAnimation,
  ListView, ScrollView,
  ActivityIndicator, TouchableOpacity, Dimensions
} from 'react-native';
import { PullView } from 'react-native-pull';
import AnimatedBar from "react-native-animated-bar";
import Swipeout from 'react-native-swipeout';
import Moment from 'moment';

export default class HomeScreen extends Component {

  static navigationOptions = {
    title: 'TICKET'
  };

  componentWillUpdate(nextProps, nextState) {
    LayoutAnimation.easeInEaseOut()
  }

  constructor(props) {
    super(props);
    this.state = {
      StatusText: `NEW`,
      isLoading: true,
      btnSelected: 1,
      stu: 'NEW',
      refreshing: false,
      progress: 0,
      swipeNum: null,
    };
    this.onPullRelease = this.onPullRelease.bind(this);
    this.topIndicatorRender = this.topIndicatorRender.bind(this);
  }

  topIndicatorRender(pulling, pullok, pullrelease) {
    const hide = { position: 'absolute', left: 10000 };
    const show = { position: 'relative', left: 0 };
    () => {
      if (pulling) {
        this.txtPulling && this.txtPulling.setNativeProps({ style: show });
        this.txtPullok && this.txtPullok.setNativeProps({ style: hide });
        this.txtPullrelease && this.txtPullrelease.setNativeProps({ style: hide });
      } else if (pullok) {
        this.txtPulling && this.txtPulling.setNativeProps({ style: hide });
        this.txtPullok && this.txtPullok.setNativeProps({ style: show });
        this.txtPullrelease && this.txtPullrelease.setNativeProps({ style: hide });
      } else if (pullrelease) {
        this.txtPulling && this.txtPulling.setNativeProps({ style: hide });
        this.txtPullok && this.txtPullok.setNativeProps({ style: hide });
        this.txtPullrelease && this.txtPullrelease.setNativeProps({ style: show });
      }

    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 60 }}>
        <Text>↓ </Text>
        <Text ref={(c) => { this.txtPulling = c; }}>Re</Text>
        <Text ref={(c) => { this.txtPullok = c; }}>fresh</Text>
        <Text ref={(c) => { this.txtPullrelease = c; }}> ↓</Text>
      </View>
    );
  }

  _handlePress(val, btn) {

    this.setState({
      isLoading: true,
      btnSelected: btn,
    })

    return fetch('http://iisct.info/api/ticket', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        own: '',
        limit: 20,
        stu: val,
        sev: 'SA1,SA2,SA4',
        order: 'asc'
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(responseJson.ticket_fields),
          StatusText: val,
        }, function () {
          // do something with new state
          console.log(responseJson);
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
          StatusText: 'ไม่พบข้อมูล...',
        });
        console.error(error);
      });
  }

  componentDidMount() {
    const { navigate } = this.props.navigation;
    const navParams = this.props.navigation.state.params;
    console.log(navParams.params);
    return this._handlePress('NEW', 1)

  }

  onPullRelease(resolve) {
    //do something
    return this._handlePress(this.state.stu, this.state.btnSelected);
    setTimeout(() => {
      resolve();
    }, 2000);
  }

  reFormat(times) {
    let datetime = times.split(" ");
    let date = datetime[0].split("-");
    let time = datetime[1].split(":");
    return date[2] + "/" + date[1] + "/" + (date[0].slice(-2)) + " " + time[0] + ":" + time[1];
  }

  diffTime(cre, exp, outp = 'slabar') {
    let date = new Date();
    let a = Moment(cre, 'YYYY-M-D H:i')
    let b = Moment(exp, 'YYYY-M-D H:i')
    let c = Moment(`${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`, 'YYYY-M-D H:i')

    if (outp == 'slabar') {
      if (c > b) return 0
      let diffHour = b.diff(a, 'time')
      let diffMinute = b.diff(c, 'time')
      let sla = 1 - diffMinute / diffHour.toFixed(2)
      return sla;
    }

    if (outp == 'sla') {
      if (c > b) return 0
      let diffHour = b.diff(c, 'hours')
      return diffHour + "hr.";
    }

  }


  btnSevColor(sev) {
    let color = '#c1db70';
    if (sev == 'SA1' || sev == 'SA2') return '#db7070'
    if (sev == 'SA3' || sev == 'SA4') return '#db8b70'
    if (sev == 'NSA1' || sev == 'NSA2') return '#dba670'
    if (sev == 'NSA3') return '#dbc170'
    if (sev == 'NSA4') return '#dbdb70'
    return color;
  }

  render() {
    const { navigate } = this.props.navigation;
    let tapBar =
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity style={(this.state.btnSelected == 1) ? styles.btnSel : styles.btnTapbar} onPress={() => this._handlePress('NEW', 1)} ><Text>NEW</Text></TouchableOpacity>
        <TouchableOpacity style={(this.state.btnSelected == 2) ? styles.btnSel : styles.btnTapbar} onPress={() => this._handlePress('NOT CLEAR', 2)} ><Text>INPRO</Text></TouchableOpacity>
        <TouchableOpacity style={(this.state.btnSelected == 3) ? styles.btnSel : styles.btnTapbar} onPress={() => this._handlePress('SLAHOLD', 3)} ><Text>HOLD</Text></TouchableOpacity>
        <TouchableOpacity style={(this.state.btnSelected == 4) ? styles.btnSel : styles.btnTapbar} onPress={() => this._handlePress('WAIT', 4)} ><Text>WAIT</Text></TouchableOpacity>
      </View>;


    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingTop: 20 }}>
            <ActivityIndicator /><Text style={{ textAlign: 'center', }} >Loading...</Text>
          </View>
        </View>
      );
    }

    var swipeoutBtns = [
      {
        text: 'View',
        backgroundColor: '#FF5555'
      },
      {
        text: 'COMP',
        backgroundColor: '#70db70'
      }
    ]

    return (
      <View style={{ flex: 1 }}>
        {tapBar}
        <View style={{ flex: 9 }}>
          {/* <PullView style={{width: Dimensions.get('window').width}} onPullRelease={this.onPullRelease} topIndicatorRender={this.topIndicatorRender} topIndicatorHeight={60}> */}

          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) =>

              <Swipeout
                right={swipeoutBtns}
                autoClose={true}
                onOpen={() => this.setState({
                  swipeNum: rowData.act,
                })

                }

              >
                <View
                  style={{ flexDirection: 'column', borderWidth: .2, borderBottomWidth: 1, paddingBottom: 5, borderColor: 'rgba(0,0,0,0.2)', }}
                  onTouchStart={() =>navigate('Details',{ params:rowData.act })}
                  
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 2, padding: 5, }}>
                      <TouchableOpacity style={{
                        flex: 1,
                        padding: 5,
                        borderWidth: .4,
                        borderColor: 'rgba(0,0,0,1)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,

                        height: 50,
                        backgroundColor: '#ddd',
                        borderRadius: 100,
                        backgroundColor: `${this.btnSevColor(rowData.sev)}`
                      }}

                      >
                        <Text style={{ color: '#333' }}>{rowData.sev}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flex: 10, padding: 5, }}>
                      <Text>{rowData.stt}</Text>
                      <Text style={{ fontSize: 10, }}>{rowData.sum}</Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', }}>
                    <Text style={{ flex: 1, fontSize: 10, paddingLeft: 10 }} >Create</Text>
                    <Text style={{ flex: 1, fontSize: 10, textAlign: 'center' }} >SLA</Text>
                    <Text style={{ flex: 1, fontSize: 10, textAlign: 'right', paddingRight: 10 }} >Expire</Text>
                  </View>
                  <View style={{ flex: 1, paddingLeft: 5, paddingRight: 10, }}>
                    <AnimatedBar
                      progress={this.diffTime(rowData.cre, rowData.exp)}
                      height={17}
                      borderColor="#333"
                      barColor="#333"
                      fillColor={(rowData.sla < 0) ? "tomato" : (rowData.sla < 0) ? "tomato" : "#70db70"}
                      borderRadius={5}
                      borderWidth={2}
                    >
                      <View style={{ flex: 1, flexDirection: 'row', }}>
                        <Text style={{ flex: 1, fontSize: 10, paddingLeft: 5, color: '#FFF' }} >{this.reFormat(rowData.cre)}</Text>
                        <Text style={{ flex: 1, fontSize: 10, textAlign: 'center', color: '#FFF' }} >{(this.diffTime(rowData.cre, rowData.exp) == 0) ? 'Over' : this.diffTime(rowData.cre, rowData.exp, 'sla')}</Text>
                        <Text style={{ flex: 1, fontSize: 10, textAlign: 'right', paddingRight: 5, color: '#FFF' }} >{this.reFormat(rowData.exp)}</Text>
                      </View>
                    </AnimatedBar>
                  </View>

                </View>
              </Swipeout>
            }
          />
          {/* </PullView> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnStatus: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  btnTapbar: {
    flex: 1,
    padding: 5,
    borderWidth: .4,
    borderColor: 'rgba(111,111,111,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 0,
  },
  btnCircle: {
    flex: 1,
    padding: 5,
    borderWidth: .4,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#ddd',
    borderRadius: 100,

  },
  btnSel: {
    flex: 1,
    padding: 5,
    borderWidth: .4,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#eee',
    borderRadius: 0,
  }, container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }, textsla: {
    fontSize: 10,
    flex: 1,
    alignSelf: 'center',
  }
});
