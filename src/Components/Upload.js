import { getAuth } from 'firebase/auth';
import { ref as dbRef, push } from 'firebase/database';
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useState } from 'react';
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

  // Lấy dữ liệu nội dung ảnh
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

