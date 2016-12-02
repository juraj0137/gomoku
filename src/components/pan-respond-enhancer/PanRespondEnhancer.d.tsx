import MyValueXY = __React.Animated.MyValueXY;
import PanResponderGestureState = __React.PanResponderGestureState;
import GestureResponderEvent = __React.GestureResponderEvent;
import LayoutChangeEvent = __React.LayoutChangeEvent;

interface IPanRespondEnhancerProps {
    width: number;
    height: number;
    lastMove: IMove;
    onTouch: (x: number, y: number) => void;
}

interface IPanRespondEnhancerState {
    pan?: __React.Animated.ValueXY;
    opacity?: __React.Animated.Value;
    isMoving?: boolean;
}
