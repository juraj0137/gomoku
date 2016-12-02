/** @flow */
import {AsyncStorage} from 'react-native';
import {STORAGE_KEY_USER_DATA} from './constants'

export default class Storage {

    /**
     * @returns {Promise}
     */
    static loadUserData = () => {

        return new Promise((resolve, reject) => {

            AsyncStorage
                .getItem(STORAGE_KEY_USER_DATA)
                .then((data) => {

                    if (data != null) {
                        data = JSON.parse(data);
                    }

                    resolve(Object.assign({}, emptyUserData, data));

                }).catch(error => console.warn(error.message));
        })
    };


    /**
     *
     * @param user
     * @returns {Promise}
     */
    static updateUserData = (user) => {

        return new Promise((resolve, reject) => {

            let dataToSave = Object.assign({}, emptyUserData, user);

            AsyncStorage
                .mergeItem(STORAGE_KEY_USER_DATA, JSON.stringify(dataToSave))
                .then(() => {
                    resolve(dataToSave);
                }).catch(error => console.warn(error.message));
        })
    }
}

const emptyUserData = {
    nick: ''
};
