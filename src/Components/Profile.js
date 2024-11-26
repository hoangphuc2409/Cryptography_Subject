//Thông tin tài khoản user
import "../Styles/Profile.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { getAuth } from 'firebase/auth';
import { database } from '../firebase-config';
import { ref, get } from 'firebase/database';

function Profile() {

    //Lấy thông tin user hiện tại
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const uid = currentUser.uid;

    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);

    useEffect(() => {
        const fetchUsername = async () => {
            if (uid) {
                const userRef = ref(database, 'UserInformation/' + uid);
                try {
                    const snapshot = await get(userRef);
                    const userData = snapshot.val();
                    setUsername(userData.username);
                    setEmail(userData.email);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUsername();
    }, []);

    return (
        <div className="profileContainer">
            <div className="avatar"><FontAwesomeIcon icon={faUser} /></div>
            <div className="content">
                <h1 className="username">{username}</h1>
                <p className="email">{email}</p>
                <p style={{fontWeight: "lighter", color: "#2d2d2d" }}>10 people are following</p>
            </div>
            <div className="profileBtn">
                <button>Share</button>
                <button>Edit profile</button>
            </div>
        </div>
    );
}

export {Profile}