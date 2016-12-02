const colors = {
    bg: '#F5FCFF',
    silver: 'silver',
};

const size = {
    baseText: 15
};

const container = {
    flex: 1,
    margin: 10,
    backgroundColor: colors.bg,
};
const containerCenterHorizontal = Object.assign({}, container, {justifyContent: 'center'});
const containerCenterVertical = Object.assign({}, container, {alignItems: 'center'});
const containerCenter = Object.assign({}, container, containerCenterHorizontal, containerCenterVertical);

const border = {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.silver,
};

const text = {
    fontSize: size.baseText
};

const smallText = {
    fontSize: size.baseText * 0.8
};

const bigText = {
    fontSize: size.baseText * 1.5
};

export {
    container,
    containerCenter,
    containerCenterVertical,
    containerCenterHorizontal,
    border,
    text,
    bigText,
    smallText,
    colors,
}
