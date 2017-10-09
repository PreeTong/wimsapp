import React,{Component} from 'react';
import {Text,TextInput,View,Button,StyleSheet
  } from 'react-native';
  


export default class LoginScreen extends Component {
    static navigationOptions = {
      header: null
    }
    
    constructor(props) {
      super(props);
      this.state = {
        btnLock:false,
      }
    }
    _disbtn = (go)=>{
      this.setState({btnLock:true}),
      setTimeout(()=>{this.setState({btnLock:false})},1000)
    }
    

    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style={styles.contain} >
          <View style={{flex:1}} />
            <View style={{flex:3}} >

              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex:1}} />
                <View style={{flex:8}} >
                  <TextInput placeholder='Email...' />
                </View>
                <View style={{flex:1}} />
              </View>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex:1}} />
                <View style={{flex:8}} >
                  <TextInput
                  returnKeyType='go'
                  secureTextEntry 
                  placeholder='Password...'
                  ref={(input)=>this.passwordInput = input}
                  />
                </View>
                <View style={{flex:1}} />
              </View>

              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex:1}} />
                <View style={{flex:8}} >
                  <Button disabled={this.state.btnLock}
                  onPress={()=> {navigate('Home', {params:'param'}), this._disbtn() }}
                  title="Login"
                  />
              </View>
              <View style={{flex:1}} />
            </View>

            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex:1}} />
              <View style={{flex:8}} >
                <Button
                onPress={() => navigate('Details')}
                title="Forget Password"
                />
              </View>
              <View style={{flex:1}} />
            </View>
          </View>
          
          <View style={{flex:4}} />
          <View style={{flex:1}} />
        </View>
        
      );
    }
  }

  const styles = StyleSheet.create({
    contain: {
      flex: 1,
    },
  });