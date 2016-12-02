/**
 * Created by jkubala on 9/30/16.
 */

export default class Player {

    /**
     *
     */
    constructor() {
        this.id = 0;
        this.name = '';
        this.game = null;
    }

    /**
     *
     * @param id
     * @returns {Player}
     */
    setId(id) {
        this.id = id;
        return this;
    }

    /**
     *
     * @returns {string}
     */
    getId() {
        return this.id;
    }

    /**
     *
     * @param name
     * @returns {Player}
     */
    setName(name) {
        this.name = name;
        return this;
    }

    /**
     *
     * @returns {string}
     */
    getName() {
        return this.name;
    }

    /**
     *
     * @param {Game} game
     * @returns {Player}
     */
    setGame(game) {
        this.game = game;
        return this;
    }

    /**
     *
     * @returns {Game}
     */
    getGame() {
        return this.game;
    }

    /**
     *
     * @param row
     * @param column
     * @returns {Promise}
     */
    makeMove(row, column) {
        return new Promise((resolve, reject) => {
            try {
                this.getGame().addMove(this, row, column);
                resolve(this.getGame());
            } catch (e) {
                reject(e)
            }
        })
    }
}