interface IAfterGameModalProps {
    type: "opponent-left" | "win" | "loss" | "tie" | "";
    onNewGameClick: () => void;
    onGoToMenuClick: () => void;
}

interface IAfterGameModalState {

}