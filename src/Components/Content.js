import { onValue, ref } from "firebase/database";
import "../Styles/Content.css";
import { database } from "../firebase-config";

function Content() {
  let Images = [];
  
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

    return (
      <div className="container">
        
        {Images && Images.map((image) => (
        <div className="box"><img src={image?.imgSrc} alt="Ảnh"/></div>
        ))}

      </div>
    );
}
export { Content };

