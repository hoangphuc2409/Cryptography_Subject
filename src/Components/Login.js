import { signInWithEmailAndPassword } from "firebase/auth";
import { ref } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/register.css';
import { auth, database, db } from '../firebase-config';
import { UserContext } from './UserContext';
import { UpdateLog } from "./UpdateLog";

const SignIn = () => {
    const LogDatabase = ref(database, 'LogHistory/Log');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { setUser } = useContext(UserContext);
    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const userId = userCredential.user.uid;

            // Cập nhật log
            UpdateLog(LogDatabase, `Tài khoản "${email}" đăng nhập`, " ");
            
            return getDoc(doc(db, 'users', userId)).then(userDoc => {
                return { userId, userDoc };
            });
        })
        
        .then(({ userId, userDoc }) => {
            let userRole = 'user';
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    userRole = 'admin';
                }
            }

            // Concatenate uid and role before encoding to Base64
            const userKey = `${userId}-${userRole}`;

            // Base64 encoding for the concatenated key
            const encodedKey = btoa(userKey);

            const userInfo = { key: encodedKey }; //uid: userId, role: userRole, 
            localStorage.setItem('user', JSON.stringify(userInfo)); // Save to localStorage
            setUser(userInfo); // Update user status in UserContext
            navigate('/Home');
        })
        .catch((error) => {
            console.error('Login error:', error);
            setError(error.message); // Display error message
        });
    };

    return (
        <div>
            <title>NerdyGrooves Login</title>
            <div>
                <section>
                    <div className="form-box form2">
                        <div className="button-box">
                            <div className="form-value">
                                <form action="" onSubmit={signIn}>
                                    <h2 className='Register-head'>Login</h2>
                                    <div className="inputbox">
                                        <ion-icon name="mail-outline"></ion-icon>
                                        <input type="email" required
                                               value={email}
                                               onChange={(e) => setEmail(e.target.value)}  />
                                        <label htmlFor="">Email</label>
                                    </div>
                                    <div className="inputbox">
                                        <ion-icon name="lock-closed-outline"></ion-icon>
                                        <input type="password" required
                                               value={password}
                                               onChange={(e) => setPassword(e.target.value)}  />
                                        <label htmlFor="">Password</label>
                                    </div>
                                    <div className="remember">
                                        <label htmlFor=""><input type="checkbox" /> Remember Me</label>
                                    </div>
                                    {error && <div className="error-message">{error}</div>}
                                    <button type="submit">Login</button>
                                    <div className="register">
                                        <p>Or <a href="/Register">Register</a> if you do not have an account</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SignIn;
