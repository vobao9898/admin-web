import { KEY_USER } from "contants";

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const UPDATE_PROFILE = "UPDATE_PROFILE";

export interface IGlobalUser {
    token: string;
    userAdmin: {
        firstName: string;
        lastName: string;
        imageUrl: string;
        roleName: string;
        waUserId: number;
    };
}

export interface IState {
    user: IGlobalUser | null;
}

export const initialState: IState = {
    user: localStorage.getItem(KEY_USER) ? (JSON.parse(localStorage.getItem(KEY_USER) || "null") as IGlobalUser) : null,
};

export interface IAction {
    type: string;
    payload: {
        user: IGlobalUser | null;
    };
}

export const reducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case LOGIN: {
            return {
                user: action.payload?.user,
            };
        }

        case LOGOUT: {
            return initialState;
        }
        default:
            return initialState;
    }
};
