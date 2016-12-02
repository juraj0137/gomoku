/**
 * Created by jkubala on 9/30/16.
 */

import Player from './Player';
import DeviceInfo from 'react-native-device-info';
let id = 0;

export default class PlayerPhone extends Player {

    /**
     *
     */
    constructor() {
        super();

        let postfix = typeof __DEV__ != 'undefined' && __DEV__ == true ? Date.now() : '';
        this.id = DeviceInfo.getUniqueID() + postfix;
    }

}