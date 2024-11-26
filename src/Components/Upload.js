import { getAuth } from 'firebase/auth';
import { ref as dbRef, push, get } from 'firebase/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState, useEffect } from 'react';
import '../Styles/Upload.css';
import { app, database } from '../firebase-config';
import { UpdateLog } from './UpdateLog';

function Upload() {
  const storage = getStorage(app)
  const [selectedImage, setSelectedImage] = useState(null);
  const imgDatabase = dbRef(database, 'ImageInformation/Image');
  const LogDatabase = dbRef(database, 'LogHistory/Log');

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [content, setContent] = useState('');

  // Lấy thông tin người upload ảnh
  const uid = currentUser.uid;
  const [username, setUsername] = useState(null);

  useEffect(() => {
        const fetchUsername = async () => {
            if (uid) {
                const userRef = dbRef(database, 'UserInformation/' + uid);
                try {
                    const snapshot = await get(userRef);
                    const userData = snapshot.val();
                    setUsername(userData.username);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUsername();
  }, []);

  // Chọn file ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUpload = document.querySelector('.imgUpload');
      imgUpload.src = event.target.result;
    };
    if (file) {
      reader.readAsDataURL(file);
      setSelectedImage(file);
    }
  };

  // Lấy nội dung ảnh
  const handleContent = (event) => {
    setContent(event.target.value);
  };

  // Đăng ảnh và nội dung
  const handleUpload = () => {
    if (selectedImage) {
      const imageName = selectedImage.name;
      const storageRef = ref(storage, `IMG-netsec/${imageName}`);
      uploadBytes(storageRef, selectedImage)
        .then(() => {
            getDownloadURL(storageRef)
              .then((url) => {
                  const newImg = {
                    imgSrc: url,
                    content: content,
                    owner: username
                  };
                  push(imgDatabase, newImg);
                  alert("Đăng ảnh thành công!");

                  //Lưu hành động vào log
                  UpdateLog(LogDatabase,`Đăng tải 1 hình ảnh`, currentUser.email)
              })
        })
        .catch((error) => {
          alert("Lỗi trong quá trình tải lên tệp tin:", error);
        });
    }
  };

    return (
      <div id="uploadMain">
        {console.log(uid)}
        <div className="imgContainer">
          <img className="imgUpload" alt="" />
        </div>
        <input className='imgChosen' type="file" required onChange={handleImageUpload} />
        <p className='uploadtxt'>Content</p>
        <input className='contentInput' type='text' onChange={handleContent} />
        <button className='uploadBtn' onClick={() => handleUpload()}>UPLOAD</button>
      </div>
    );
}

export { Upload };

