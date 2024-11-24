import { push } from "firebase/database";
export const UpdateLog =(LogDatabase, action, uid) => {
    const currentTime = new Date();
    const formattedTime = `${currentTime.toLocaleDateString()} ${currentTime.toLocaleTimeString()}`;
    const newAction = {
        time: formattedTime,
        action: action,
        user: uid,
    };
    push(LogDatabase, newAction);
}