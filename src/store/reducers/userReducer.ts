import {
    CREATE_USER, GET_FRIENDS,
    SET_USER_LIST,
    UPDATE_USER_LIST,
    SEARCH_FRIENDS,
} from "../actionTypes";
import {IUser} from "../../interfaces";

const initialState = {
    user: {} as IUser,
    users: [] as Array<IUser>,
    friends: [] as Array<IUser>,
    searchFriends: [] as Array<IUser>,
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
        case GET_FRIENDS:
            return { ...state, friends: action.payload };
        case SEARCH_FRIENDS:
            return { ...state, searchFriends: action.payload };
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

type GetFriends = {
    type: typeof GET_FRIENDS,
    payload: any
}

type SearchFriends = {
    type: typeof SEARCH_FRIENDS,
    payload: any
}

export type UserActionType = CreateUserType | SetUserListType | UpdateUserList | GetFriends | SearchFriends;