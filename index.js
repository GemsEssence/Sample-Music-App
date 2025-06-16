/**
 * @format
 */
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import './gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
global.Buffer = global.Buffer || Buffer;

AppRegistry.registerComponent(appName, () => App);
