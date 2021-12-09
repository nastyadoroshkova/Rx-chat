import {
    CREATE_USER,
    SET_USER_LIST,
    UPDATE_USER_LIST,
} from "../actionTypes";
import {IUser} from "../../interfaces";

const initialState = {
    user: {} as IUser,
    users: [] as Array<IUser>,
};

type InitialState = typeof initialState;

export const userReducer = (state = initialState, action:UserActionType):InitialState => {
    switch (action.type) {
        case CREATE_USER:
            return { ...state, user: action.payload };
        case SET_USER_LIST:
            return { ...state, users: action.payload };
        case UPDATE_USER_LIST:
            return { ...state, users: [...state.users, action.payload] };
        default:
            return state;
    }
};

type CreateUserType = {
    type: typeof CREATE_USER,
    payload: IUser
}

type SetUserListType = {
    type: typeof SET_USER_LIST,
    payload: Array<IUser>
}

type UpdateUserList = {
    type: typeof UPDATE_USER_LIST,
    payload: any
}

export type UserActionType = CreateUserType | SetUserListType | UpdateUserList;