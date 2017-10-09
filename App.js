
import {AppRegistry} from 'react-native';
import {StackNavigator} from 'react-navigation';
import LoginScreen   from './src/pages/login';
import HomeScreen    from './src/pages/home';
import DetailsScreen  from './src/pages/details';

  export default SimpleApp = StackNavigator({
    Login: { screen: LoginScreen },
    Home :{ screen: HomeScreen },
    Details: { screen: DetailsScreen },
  });

// if you are using create-react-native-app you don't need this line
AppRegistry.registerComponent('WIMS', () => SimpleApp);