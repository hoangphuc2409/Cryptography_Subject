import { onValue, ref, remove } from "firebase/database";
import { useContext, useState } from "react";
import "../Styles/Settings.css";
import { database } from "../firebase-config";
import { UserContext } from './UserContext';
import { UpdateLog } from "./UpdateLog";
import { jwtDecode } from "jwt-decode";

function Settings() {
  // Decode JWT
  const { user } = useContext(UserContext);
  const decoded = jwtDecode(user.token);
  const userRole = decoded.role;
  const userEmail = decoded.email;

  const [imageList, setImageList] = useState([]);
  const LogDatabase = ref(database, 'LogHistory/Log');
  
  //Lấy thông tin hình ảnh
    let images = [];
    const getImage = ref(database, 'ImageInformation/Image');
    onValue(getImage, (snapshot) => {
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key;
        let data = childSnapshot.val();
        images.push({
          "id": key,
          "imgSrc": data.imgSrc,
          "content": data.content
        });
    })
   })

  // Xử lý delete
  const handleDelete = (id) => {
    const updatedList = imageList.filter(image => image.id !== id);
    setImageList(updatedList);
    remove(ref(database, `ImageInformation/Image/${id}`));
    //Lưu hành động vào log
    UpdateLog(LogDatabase, `Xóa 1 ảnh khỏi database. ID ảnh bị xóa: ${id}`, userEmail);
  };

  if(!user || userRole !== "admin"){
    return (
      <div className="errorScreen">
        <p>Tính năng này không khả dụng với bạn!</p>
      </div>
    );
  } else {

    return (
      <div>
        <table id="infoTable">
          <thead>
            <tr>
              <th className="imgSrc">Ảnh</th>
              <th className="content">Nội dung</th>
              <th className="settings"></th>
            </tr>
          </thead>
          <tbody>
            {images.map((image, index) => (
              <tr key={index}>
                <td>
                  <img className="picture" src={image.imgSrc} alt="Ảnh" />
                </td>
                <td className="rowContent">{image.content}</td>
                <td><button className="btnDelete" onClick={() => {handleDelete(image.id)}}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space"></div>
      </div>
    );
  }
}

export { Settings };

