import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "../Styles/Content.css";
import { database } from "../firebase-config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

function Content() {
  const navigate = useNavigate();

  //Lấy dữ liệu từ Database
  const [Images, setImages] = useState([]);

  useEffect(() => { 
    const getImage = ref(database, 'ImageInformation/Image');
    onValue(getImage, (snapshot) => {
      const fetchedImages = []; //Mảng tạm thời
      snapshot.forEach(childSnapshot => {
        let Key = childSnapshot.key;
        let data = childSnapshot.val();
        fetchedImages.push({
          "id": Key,
          "imgSrc": data.imgSrc,
          "content": data.content 
        });
      });
      setImages(fetchedImages); 
    });
  }, []);

   //Xử lý khi click vào ảnh
   const handleImageClick = (id) => {
    navigate(`/image/${id}`);
   }

    return (
      <div className="container">
        {Images && Images.map((image) => (
        <div className="box" key={image?.id} onClick={() => handleImageClick(image?.id)}>
          <img src={image?.imgSrc} alt="Ảnh"/>
          <div className="overlay"></div> {/* Thêm lớp phủ cho ảnh */}

          <button className="saveBtn">Save</button>

          <div className="bottomBtn">
          <button><FontAwesomeIcon icon={faArrowUpFromBracket} /></button>
          <button><FontAwesomeIcon icon={faEllipsis} /></button>
          </div>

        </div>
        ))}

      </div>
    );
}
export { Content };

