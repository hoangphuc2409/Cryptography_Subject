import { onValue, ref, remove } from "firebase/database";
import { useContext, useState } from "react";
import "../Styles/Settings.css";
import { database } from "../firebase-config";
import { UserContext } from './UserContext';
import { UpdateLog } from "./UpdateLog";
import { jwtDecode } from "jwt-decode";

function MyPhotos() {
  // Decode JWT
  const { user } = useContext(UserContext);
  const decoded = jwtDecode(user.token);
  const userEmail = decoded.email;
  const userID = decoded.uid;

  const [imageList, setImageList] = useState([]);
  const LogDatabase = ref(database, 'LogHistory/Log');
  
  //Lấy thông tin hình ảnh
    let images = [];
    const getImage = ref(database, 'ImageInformation/Image');
    onValue(getImage, (snapshot) => {
      snapshot.forEach(childSnapshot => {
        let key = childSnapshot.key;
        let data = childSnapshot.val();

        // Chỉ Lấy ảnh do user upload
        if (data.userID === userID){
        images.push({
          "id": key,
          "imgSrc": data.imgSrc,
          "content": data.content
        });
      }
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

  //Xử lý download
  const handleDownload = (imageSrc, id) => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "image.jpg";
    link.target = "_blank";
    link.click();
    UpdateLog(LogDatabase, `Tải 1 ảnh về máy. ID của ảnh được tải: ${id}`, userEmail);
  };

    return (
      <div>
        <table id="infoTable">
          <thead>
            <tr>
              <th className="imgSrc">Uploaded photos</th>
              <th className="content">Content</th>
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
                <button className="btnDownload" onClick={() => handleDownload(image.imgSrc)}>Download</button>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="space"></div>
      </div>
    );
  
}

export { MyPhotos };

