import { getAuth } from "firebase/auth";
import { onValue, ref, remove } from "firebase/database";
import { useContext, useState } from "react";
import "../Styles/Settings.css";
import { database } from "../firebase-config";
import { UserContext } from './UserContext';
import { UpdateLog } from "./UpdateLog";

function Settings() {
  const { user } = useContext(UserContext);
  const [imageList, setImageList] = useState([]);
  const LogDatabase = ref(database, 'LogHistory/Log');
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
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

   const decodeUserKey = (key) => {
    const decodedKey = atob(key);
    const [uid, role] = decodedKey.split('-');
    return { uid, role };
  };

  // Xử lý delete
  const handleDelete = (id) => {
    const updatedList = imageList.filter(image => image.id !== id);
    setImageList(updatedList);
    remove(ref(database, `ImageInformation/Image/${id}`));
    //Lưu hành động vào log
    UpdateLog(LogDatabase, `Xóa 1 ảnh khỏi database. ID ảnh bị xóa: ${id}`, currentUser.email);
  };

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
              <td>
                {user && user.key && (
                  // Decode user.key and check role
                  <button className="btnDelete" onClick={() => {
                    const { role } = decodeUserKey(user.key);
                    if (role === 'admin') {
                      handleDelete(image.id);
                    } else {
                      alert("You don't have permission to delete.");
                    }
                  }}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="space"></div>
    </div>
  );
}

export { Settings };

