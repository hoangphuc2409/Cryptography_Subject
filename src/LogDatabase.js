import { database } from "./firebase-config";
import { ref, set } from "firebase/database";

const Log = [
    {
        time: "",
        action: "",
        user:""
    }
];

set(ref(database, 'LogHistory/'), {Log});