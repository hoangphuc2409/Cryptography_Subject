// Thông tin chi tiết của ảnh
import "../Styles/PicDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEllipsis, faArrowLeft, faUser } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { database } from "../firebase-config";
import { ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { UpdateLog } from "./UpdateLog";

function PicDetail () {
    const navigate = useNavigate();

    const LogDatabase = ref(database, 'LogHistory/Log');
    const auth = getAuth();
    const currentUser = auth.currentUser;

    //Xử lý hiển thị ảnh
    const {id} = useParams();
    const [imageData, setImageData] = useState(null);

    useEffect(() => {
        const imageRef = ref(database, `ImageInformation/Image/${id}`);
        get(imageRef).then((snapshot) => {
          if (snapshot.exists()) {
            setImageData(snapshot.val());
          }
        });
      }, [id]);
      if (!imageData) return <div>Loading...</div>;

      //Back button
      const handleBack = () => {
        navigate('/Home');
      }

      //Download button
      const handleDownload = (imageSrc, id) => {
        const link = document.createElement("a");
        link.href = imageSrc;
        link.download = "image.jpg";
        link.target = "_blank";
        link.click();
        //Lưu hành động vào log
        UpdateLog(LogDatabase, `Tải 1 ảnh về máy. ID của ảnh được tải: ${id}`, currentUser.email);
      };


    return (
        <div className="detailContainer">

            <div><button className="backBtn" onClick={handleBack}><FontAwesomeIcon icon={faArrowLeft} /></button></div>

            <div className="box">
                <div className="picture"><img src={imageData.imgSrc} alt=""></img></div>
                <div className="content">
                    <ul>
                        <li className="icon"><FontAwesomeIcon icon={faHeart} /></li>
                        <li className="icon" onClick={() => handleDownload(imageData.imgSrc, id)} ><FontAwesomeIcon icon={faDownload} /></li>
                        <li className="icon"><FontAwesomeIcon icon={faEllipsis} /></li>
                    </ul>
                    <div className="owner">
                        <div className="avatar"><FontAwesomeIcon icon={faUser} /></div>
                        <p className="username">{imageData.owner}</p>
                    </div>
                    <p className="text">{imageData.content}</p>
                </div>
            </div>

        </div>
    );
}

export {PicDetail};