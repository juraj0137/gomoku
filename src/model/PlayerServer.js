/**
 * Created by jkubala on 9/30/16.
 */

import Player from './Player'
let id = 0;

export default class PlayerServer extends Player {

    constructor() {
        super();
        this.ws = null;
    }

    /**
     *
     * @param ws
     */
    setWS(ws) {
        this.ws = ws;
    }

    /**
     *
     * @returns {*|null}
     */
    getWS() {
        return this.ws;
    }

    /**
     *
     * @param json
     * @returns {PlayerServer}
     */
    static fromJson(json) {
        let player = new PlayerServer();
        player.setId(json.id);
        return player;
    }

    /**
     *
     */
    toJson() {
        let {id} = this;

        return JSON.stringify({
            id
        })
    }
}