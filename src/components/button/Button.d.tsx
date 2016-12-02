import TouchableHighlight = __React.TouchableHighlight;
import StatelessComponent = __React.StatelessComponent;

interface IButtonProps extends __React.ViewProperties {
    style?: __React.ViewStyle;
    border?: number;
    onPress: () => void;
}