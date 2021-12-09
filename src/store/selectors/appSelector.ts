import { createSelector } from 'reselect'
import {IChat, IUser} from "../../interfaces";

// export const selectChats = createSelector(
//     (state:any) => state.app.chats,
//     (state:any) => state.user.users,
//     (chats, users) => {
//     return chats.map((chat:IChat) => {
//         const resultUsers = {...chat};
//         chat.users.forEach((userId, index) => {
//             resultUsers.users[index] = users.find((user:IUser) => user.id === userId);
//         })
//         return resultUsers;
//     });
//   }
// )
