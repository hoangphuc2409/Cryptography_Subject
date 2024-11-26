import React from 'react';
import { useState } from 'react';
import '../Styles/register.css';
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword  } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { database } from '../firebase-config';
import { ref,set } from 'firebase/database';

function Register() {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirm, setConfirm] = useState('');
const [phone, setPhone] = useState('');
const [notify, setNotify] = useState('');

const navigate = useNavigate();

//Lấy dữ liệu đăng ký
const handleName = (event) => {
    setName(event.target.value);
};
const handlePhone = (event) => {
    setPhone(event.target.value);
};
const handleEmail = (event) => {
    setEmail(event.target.value);
};
const handlePassword = (event) => {
    setPassword(event.target.value);
};
const handleConfirm = (event) => {
    setConfirm(event.target.value);
};

//Kiểm tra lại Password 
const checkConfirm = (event) =>{
     event.preventDefault();
    if(password !== confirm){
        setNotify("The password doesn't match. Please re-enter!");
    } 
    else
    {   //Đưa thông tin đăng ký lên database
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;
            set(ref(database, 'UserInformation/'+ uid), {
                username: name,
                email: email,
                phone: phone
            });
            if(notify === ""){
                navigate('/');
            }
        })
    }
}

    return (
        <div className='background2'>
            <title>Register</title>
            <div>
                <section>
                    <div className="form-box">
                        <div className="button-box">
                            <div className="form-value">
                                <form action="" onSubmit={checkConfirm}>
                                    <h2 className='Register-head'>Register</h2>

                                    <div className="inputbox">
                                        <input type="text" required onChange={handleName} />
                                        <label htmlFor="">Your Name</label>
                                    </div>

                                    <div className="inputbox">
                                        <input type="email" required onChange={handleEmail} />
                                        <label htmlFor="">Email</label>
                                    </div>

                                    <div className="inputbox">
                                        <input type="password" required onChange={handlePassword} />
                                        <label htmlFor="">Password</label>
                                    </div>

                                    <div className="inputbox">
                                        <input type="password" required onChange={handleConfirm}/>
                                        <label htmlFor="">Confirm Password</label>
                                    </div>

                                    <div className="inputbox">
                                        <input type="text" required onChange={handlePhone} />
                                        <label htmlFor="">Phone Number</label>
                                    </div>

                                    {notify && <p className='Notify'>{notify}</p>}
                                    <button type="submit">Register</button>
                                    <div className="register">
                                        <p>Or <a href="/">LOGIN</a> if you already have an account</p>
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

export { Register };

