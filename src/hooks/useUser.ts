import GlobalContext from "context/GlobalContext";
import { KEY_TOKEN, KEY_USER } from "contants";
import { IGlobalUser, LOGIN, LOGOUT } from "context/Reducer";
import { useContext } from "react";
import { useLocalStorage } from "./useLocalStorage";

export const useUser = () => {
    const [state, dispatch] = useContext(GlobalContext) || [];

    const { setItem, removeItem } = useLocalStorage();

    const login = (user: IGlobalUser) => {
        if (dispatch) {
            dispatch({
                type: LOGIN,
                payload: {
                    user: user,
                },
            });
            setItem(KEY_USER, JSON.stringify(user));
            setItem(KEY_TOKEN, user.token);
        }
    };

    const logout = () => {
        if (dispatch) {
            dispatch({
                type: LOGOUT,
                payload: {
                    user: null,
                },
            });
            removeItem(KEY_USER);
        }
    };

    return { userGlobal: state?.user, login, logout };
};

export default useUser;
