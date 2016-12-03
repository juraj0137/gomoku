///<reference path="websocket.d.ts"/>
import {WEBSOCKET_STATUS, CHANGE_STATUS, CHANGE_WS_STATUS} from "../actions/websocket";

const initialState: IReduxStateWebsocket = {
    status: WEBSOCKET_STATUS.OFFLINE,
};

export default function websocketReducer(state: IReduxStateNet = initialState, commonAction: IAction) {

    if (commonAction.type == CHANGE_WS_STATUS) {
        const action = commonAction as  IGenericAction<CHANGE_STATUS>;
        return Object.assign({}, state, {
            status: action.payload.status
        });
    }

    return state;
}
