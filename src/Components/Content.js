import { onValue, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "../Styles/Content.css";
import { database } from "../firebase-config";

function Content() {
  let Images = [];
  const navigate = useNavigate();
  
  //Lấy dữ liệu từ Database
  var getImage = ref(database, 'ImageInformation/Image');
  onValue(getImage, (snapshot) =>{
    snapshot.forEach(childSnapshot => {
        let Key = childSnapshot.key;
        let data = childSnapshot.val();
        Images.push(
        {
            "id": Key,
            "imgSrc": data.imgSrc,
            "content": data.content 
        });
    })
   })

   //Xử lý khi click vào ảnh
   const handleImageClick = (id) => {
    navigate(`/image/${id}`);
   }

    return (
      <div className="container">
        
        {Images && Images.map((image) => (
        <div className="box" key={image?.id} onClick={() => handleImageClick(image?.id)}>
          <img src={image?.imgSrc} alt="Ảnh"/>
          <div className="overlay"></div> {/* Thêm lớp phủ */}
        </div>
        ))}

      </div>
    );
}
export { Content };

