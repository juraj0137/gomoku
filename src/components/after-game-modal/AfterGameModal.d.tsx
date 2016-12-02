interface IAfterGameModalProps {
    type: "win" | "loss" | "tie" | "";
    onNewGameClick: () => void;
    onGoToMenuClick: () => void;
}

interface IAfterGameModalState {

}