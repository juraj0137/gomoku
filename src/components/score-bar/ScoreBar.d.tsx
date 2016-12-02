///<reference path="../../reducers/game.d.ts"/>
///<reference path="../../reducers/playerToSignMapping.d.ts"/>

interface IScoreBarProps {
    me: IPlayer;
    opponent: IPlayer;
    playerInTurn: IPlayer;
    onSingChangeClick: () => void;
    playerToSignMapping: IPlayerToSignMapping;
}