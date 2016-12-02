interface ISettingsProps extends IScreenProps {
    user: IUser;
    updateUserData: (user: IUser) => any;
}

interface ISettingsState {
    isLoading?: boolean;
    nick?: string,
    nickError?: string;
}

interface ISettingsRoute extends IRoute {
}
