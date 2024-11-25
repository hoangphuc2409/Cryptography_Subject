// Thông tin chi tiết của ảnh
import "../Styles/PicDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faEllipsis, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { database } from "../firebase-config";
import { ref, get } from "firebase/database";

function PicDetail () {
    const navigate = useNavigate();

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


    return (
        <div className="detailContainer">

            <div><button className="backBtn" onClick={handleBack}><FontAwesomeIcon icon={faArrowLeft} /></button></div>

            <div className="box">
                <div className="picture"><img src={imageData.imgSrc} alt=""></img></div>
                <div className="content">
                    <ul>
                        <li className="icon"><FontAwesomeIcon icon={faHeart} /></li>
                        <li className="icon"><FontAwesomeIcon icon={faDownload} /></li>
                        <li className="icon"><FontAwesomeIcon icon={faEllipsis} /></li>
                    </ul>
                    <p className="text">{imageData.content}</p>
                </div>
            </div>

        </div>
    );
}

export {PicDetail};