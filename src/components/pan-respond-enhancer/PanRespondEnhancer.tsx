///<reference path="PanRespondEnhancer.d.tsx"/>
import React from 'react';
import ReactNative from 'react-native';
import { constants } from '../../config';
import { MOVE_DISTANCE_FROM_BORDER } from "../../config/constants";

const { View } = ReactNative;
const { Animated } = ReactNative;
const { Dimensions } = ReactNative;
const { PanResponder } = ReactNative;

let WINDOW_HEIGHT = Dimensions.get('window').height;
let WINDOW_WIDTH = Dimensions.get('window').width;

class PanRespondEnhancer extends React.Component<IPanRespondEnhancerProps, IPanRespondEnhancerState> {

    private lastMove: IMove;
    private responderInstance: __React.PanResponderInstance;

    constructor(props: IPanRespondEnhancerProps) {
        super(props);

        this.state = {
            pan: new Animated.ValueXY(),
            opacity: new Animated.Value(0),
            isMoving: false
        };

        this.lastMove = null;

        // go to centre
        let { width, height } = this.props;
        this.state.pan.setValue({ x: (-width + WINDOW_WIDTH) / 2, y: (-height + WINDOW_HEIGHT) / 2 });
    }

    protected componentWillMount() {
        this.responderInstance = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: this.onPanResponderGrant,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderRelease: this.onPanResponderRelease,
        });
    }

    protected componentDidMount() {
        this.animateEntrance();

        if (this.props.lastMove)
            this.goToNewMoveIfNeeded(this.props.lastMove);
    }

    protected componentWillReceiveProps(nextProps: IPanRespondEnhancerProps) {
        if (nextProps.lastMove)
            this.goToNewMoveIfNeeded(nextProps.lastMove);
    }

    private goToNewMoveIfNeeded = (lastMove: IMove) => {

        if (typeof lastMove != "object")
            return;

        // if (this.state.isMoving) {
        //     // setTimeout(() => this.goToNewMoveIfNeeded(lastMove), 30);
        //     return;
        // }

        let { row, column } = lastMove;
        const { TILE_HEIGHT, TILE_WIDTH } = constants;

        let tileY = row * TILE_HEIGHT;
        let tileX = column * TILE_WIDTH;



        if (this.lastMove == null || this.lastMove != lastMove) {

            // check if tile is in view
            // hack because of typescript don't know __getValue function
            let pan = this.state.pan as MyValueXY;
            let panX = -pan.x.__getValue();
            let panY = -pan.y.__getValue();

            let gotoX = null;
            let gotoY = null;

            let overLeft = tileX < panX;
            let overRight = panX + WINDOW_WIDTH < tileX + TILE_WIDTH;
            let overTop = tileY < panY;
            let overBottom = panY + WINDOW_HEIGHT < tileY + TILE_HEIGHT;

            let needMove = overLeft || overRight || overTop || overBottom;

            if (overLeft) {
                gotoX = -tileX + MOVE_DISTANCE_FROM_BORDER;
            } else if (overRight) {
                gotoX = -tileX + WINDOW_WIDTH - MOVE_DISTANCE_FROM_BORDER;
            }

            if (overTop) {
                gotoY = -tileY + MOVE_DISTANCE_FROM_BORDER;
            } else if (overBottom) {
                gotoY = -tileY + WINDOW_HEIGHT - MOVE_DISTANCE_FROM_BORDER;
            }

            if (needMove) {
                this.goToPosition(gotoX, gotoY);
            }
        }

        if (this.lastMove != lastMove)
            this.lastMove = lastMove
    };

    private onPanResponderGrant = () => {

        // hack because of typescript don't know __getValue function
        let pan = this.state.pan as MyValueXY;

        this.state.pan.setOffset({
            x: pan.x.__getValue(),
            y: pan.y.__getValue()
        });

        this.state.pan.setValue({ x: 0, y: 0 });
    };

    private onPanResponderMove = (event: any, gestureState: PanResponderGestureState) => {
        let { dx, dy } = gestureState;
        Animated.event([
            { dx: this.state.pan.x, dy: this.state.pan.y },
        ])({ dx, dy });
    };

    private onPanResponderRelease = (event: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // Flatten the offset to avoid erratic behavior
        this.state.pan.flattenOffset();

        let { dx, dy, vx, vy } = gestureState;
        if (typeof this.props.onTouch == "function" && Math.abs(dx) <= 5 && Math.abs(dy) <= 5) {
            let { locationX, locationY } = event.nativeEvent;
            this.props.onTouch(locationX, locationY);
            return;
        }

        let { height, width } = this.props;
        let pan = this.state.pan as MyValueXY;
        let oldX = pan.x.__getValue();
        let oldY = pan.y.__getValue();

        let newX = -Math.max(0, Math.min(width - WINDOW_WIDTH, -oldX));
        let newY = -Math.max(0, Math.min(height - WINDOW_HEIGHT, -oldY));

        let needAnimation = oldX != newX || oldY != newY;

        if (needAnimation)
            this.goToPosition(newX, newY);
        else
            Animated.decay(
                this.state.pan,
                { velocity: { x: vx, y: vy }, deceleration: 0.988, }
            ).start(() => {
                oldX = pan.x.__getValue();
                oldY = pan.y.__getValue();

                newX = -Math.max(0, Math.min(width - WINDOW_WIDTH, -oldX));
                newY = -Math.max(0, Math.min(height - WINDOW_HEIGHT, -oldY));

                needAnimation = oldX != newX || oldY != newY;

                if (needAnimation)
                    this.goToPosition(newX, newY);
            });
    };

    private goToPosition = (x: number, y: number) => {

        // make sure we are in view
        let { height, width } = this.props;

        x = !x ? x : -Math.max(0, Math.min(width - WINDOW_WIDTH, -x));
        y = !y ? y : -Math.max(0, Math.min(height - WINDOW_HEIGHT, -y));

        this.setState({ isMoving: true });

        let animatedValue;
        let toValue;
        if (x != null && y != null) {
            animatedValue = this.state.pan;
            toValue = { x, y }
        } else if (x != null) {
            animatedValue = this.state.pan.x;
            toValue = x;
        } else if (y != null) {
            animatedValue = this.state.pan.y;
            toValue = y;
        }

        Animated.timing(animatedValue, { toValue, duration: 200 }).start(() => {
            this.setState({ isMoving: false });
        });
    };

    private animateEntrance = () => {
        Animated.timing(this.state.opacity, { toValue: 1, duration: 800 }).start();
    };

    public render() {
        let boardStyle = {
            transform: this.state.pan.getTranslateTransform(),
            opacity: this.state.opacity,
            width: this.props.width,
            height: this.props.height,
        };

        const onLayout = (e: LayoutChangeEvent) => {
            WINDOW_WIDTH = e.nativeEvent.layout.width;
            WINDOW_HEIGHT = e.nativeEvent.layout.height;
        };

        const touchReceiverStyle: ViewStyle = {
            position: 'absolute',
            zIndex: 2,
            top: 0,
            left: 0,
            width: this.props.width,
            height: this.props.height,
        };

        return <View style={styles.responder} onLayout={onLayout}>
            <Animated.View style={boardStyle} {...this.responderInstance.panHandlers}>
                {this.props.children}
                <View style={touchReceiverStyle} />
            </Animated.View>
        </View>
    }
}

export { PanRespondEnhancer };

const styles = ReactNative.StyleSheet.create({
    responder: {
        flex: 1,
        borderStyle: 'solid',
        borderWidth: constants.TILE_BORDER_WIDTH,
        borderColor: constants.TILE_BORDER_COLOR,
        position: 'relative',
    } as ViewStyle,
});