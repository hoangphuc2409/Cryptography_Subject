import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, set } from 'firebase/database';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database, auth, db } from "../firebase-config";
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/register.css';
import { UserContext } from './UserContext';
import { UpdateLog } from "./UpdateLog";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faGooglePlus } from "@fortawesome/free-brands-svg-icons";

import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider} from "firebase/auth";
import axios from "axios";

const SignIn = () => {
    const LogDatabase = ref(database, 'LogHistory/Log');

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const [error, setError] = useState("");

    const { setUser } = useContext(UserContext);

    const signIn = async (e) => {
        e.preventDefault();
        try {
            // Đăng nhập với Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;
            
            // Lấy Firebase ID token
            const idToken = await userCredential.user.getIdToken();
            
            // Gửi idToken đến backend để lấy JWT
            const response = await axios.post('http://localhost:5000/api/auth', {
                idToken
            });
            const jwt = response.data.token;
            
            // Lấy thông tin user role từ Firestore
            const userDoc = await getDoc(doc(db, 'users', userId));
            let userRole = 'user';
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    userRole = 'admin';
                }
            }

            // Lưu JWT và thông tin user
            const userInfo = { token: jwt };
            localStorage.setItem('user', JSON.stringify(userInfo));

            //console.log(`This is token: ${jwt}`);

            // Cập nhật log
            UpdateLog(LogDatabase, `Tài khoản "${email}" đăng nhập`, " ");
            
            setUser(userInfo);
            navigate('/Home');
            
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
        }
    };

    // Xử lý login bằng Google
    const providerGG = new GoogleAuthProvider();
    const SignInwithGoogle = async () => {
        try {
            const auth = getAuth();
            auth.languageCode = 'en';
            
            //Đăng nhập với Google
            const result = await signInWithPopup(auth, providerGG); 
            // Lấy thông tin credential
            //const credential = GoogleAuthProvider.credentialFromResult(result);
            //const token = credential.accessToken; //Google token
            //console.log(`This is Google token: ${token}`);
    
            // Lấy thông tin user
            const user = result.user;
            const uid = user.uid;
            const username = user.displayName;
            const email = user.email;
            const phone = user.phoneNumber;
    
            // Kiểm tra thông tin user trong Firestore
            const userDoc = await getDoc(doc(db, 'users', uid));
            let userRole = 'user';
    
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    userRole = 'admin';
                }
            } else {
                // Xử lý đăng nhập lần đầu
                // Lưu vào Firestore
                await setDoc(doc(db, "users", uid), {
                    username: username,
                    role: "user"
                });
    
                // Lưu vào realtime database
                await set(ref(database, 'UserInformation/' + uid), {
                    username: username,
                    email: email,
                    phone: phone
                });
            }
    
            // Gửi IDToken đến server để lấy JWT
            const idToken = await result.user.getIdToken();
            const response = await axios.post('http://localhost:5000/api/auth', {
                idToken
            });
    
            const jwt = response.data.token;
    
            // Lưu thông tin user vào LocalStorage
            const userInfo = { token: jwt };
            localStorage.setItem('user', JSON.stringify(userInfo));

            //console.log(`This is JWT: ${jwt}`);
    
            // Cập nhật log
            UpdateLog(LogDatabase, `Tài khoản "${email}" đăng nhập từ Google`, " ");
            
            setUser(userInfo);
            navigate('/Home');
    
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
        }
    }

    // Xử lý login bằng facebook
    const providerFB = new FacebookAuthProvider();
    const SignInwithFacebook = async () => {
        try {
            const auth = getAuth();
            auth.languageCode = 'en';
            const result = await signInWithPopup(auth, providerFB);
    
            // Lấy thông tin user
            const user = result.user;
            const uid = user.uid;
            const username = user.displayName;
            const email = user.email;
            const phone = user.phoneNumber;
    
            // Kiểm tra thông tin user trong Firestore
            const userDoc = await getDoc(doc(db, 'users', uid));
            let userRole = 'user';
    
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === 'admin') {
                    userRole = 'admin';
                }

            } else { // Xử lý đăng nhập lần đầu
                // Lưu vào Firestore
                await setDoc(doc(db, "users", uid), {
                    username: username,
                    role: "user"
                });
    
                // Lưu vào realtime database
                await set(ref(database, 'UserInformation/' + uid), {
                    username: username,
                    email: email,
                    phone: phone
                });
            }
    
            // Gửi IDToken đến server để lấy JWT
            const idToken = await result.user.getIdToken();
            const response = await axios.post('http://localhost:5000/api/auth', {
                idToken
            });
            const jwt = response.data.token;
            
            // Lưu thông tin user vào LocalStorage
            const userInfo = { token: jwt };
            localStorage.setItem('user', JSON.stringify(userInfo));
    
            // Cập nhật log
            UpdateLog(LogDatabase, `Tài khoản "${username}" đăng nhập từ Facebook`, " ");

            setUser(userInfo);
            navigate('/Home');
    
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message);
        }
    }

    // Tạo axios instance với interceptor
    const api = axios.create({
        baseURL: 'http://localhost:5000/api'
    });

    api.interceptors.request.use(config => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.jwt) {
            config.headers.Authorization = `Bearer ${user.jwt}`;
        }
        return config;
    });
    
    return (
        <div>
            <title>Picute Login</title>
            <div>
                <section>
                    <div className="form-box form-Login">
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
                                    {error && <div className="error-message">{error}</div>}
                                    <button type="submit">Login</button>
                                    <div className="register">
                                        <p>Don't have an account?<a href="/Register"> Sign up now</a></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="divider"><span>Or</span></div>
                    <div className="signInMethods">
                    <button onClick={SignInwithGoogle}><FontAwesomeIcon className="symbol googleIcon" icon={faGooglePlus}/>Coutinue with Google</button>
                    <button onClick={SignInwithFacebook}><FontAwesomeIcon className="symbol facebookIcon" icon={faFacebook}/>Coutinue with Facebook</button>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default SignIn;
