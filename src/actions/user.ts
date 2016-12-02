export const UPDATE_USER = 'UPDATE_USER';
export type UPDATE_USER = {user: IUser};

export const updateUserData: IActionCreator<IGenericAction<UPDATE_USER>> = (user: IUser) => {
    return {
        type: UPDATE_USER,
        payload: {
            user
        }
    }
};