///<reference path="constants.d.ts"/>
export const STORAGE_KEY_USER_DATA = '@Piskvorky:user_data';

export const PLAYER_ME = 1;
export const PLAYER_OPPONENT = 2;

export const DEFAULT_ROWS = 15;
export const DEFAULT_COLUMNS = 15;

export const SAME_IN_ROW = 5;

export const TILE_ZERO = 0;
export const TILE_CIRCLE = 1;
export const TILE_CROSS = 2;

export const MAX_DISTANCE_FROM_CENTER = 3;

export const TILE_WIDTH = 50;
export const TILE_HEIGHT = 50;
export const TILE_BORDER_WIDTH = 1;
export const TILE_BORDER_COLOR = 'silver';

export const WS_ADDRESS = "130.234.201.86";
export const WS_PORT = 8087;

export const GAME_LIVE = "live";
export const GAME_TIE = "tie";
export const GAME_WINNER = "winner";
export const GAME_CANCELED = "canceled";
export const GAME_OPPONENT_LEFT = "opponent-left";

export const INTERNET_DISCONNECTED = "disconnected";
export const INTERNET_CHECKING = "refreshing";
export const INTERNET_CONNECTED = "connected";

export const WS_CONNECTING = 'connecting';
export const WS_OPEN = 'open';
export const WS_CLOSING = 'closing';
export const WS_CLOSED = 'closed';

export const WS_TYPE_LOOKING_FOR_GAME = 'looking_for_game';
export const WS_TYPE_OPPONENT_LEAVED_GAME = 'opponent_leaved_game';
export const WS_TYPE_INIT_GAME = 'init_game';
export const WS_TYPE_NEW_MOVE = 'new_move';

export const SENDER_SERVER = 'server';
export const SENDER_CLIENT = 'client';
