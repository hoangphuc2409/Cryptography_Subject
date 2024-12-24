import { useState, useEffect, useContext } from "react";
import { database } from "../firebase-config";
import { onValue, ref } from "firebase/database";
import "../Styles/Log.css";
import { UserContext } from "./UserContext";
import {jwtDecode} from "jwt-decode";


function Log() {
    const {user} = useContext(UserContext)

    const [logs, setLogs] = useState([]);
    useEffect(() => {
      // Lấy dữ liệu từ Log database
      const getLog = ref(database, 'LogHistory/Log');
      onValue(getLog, (snapshot) => {
          const logsArray = [];
          snapshot.forEach(childSnapshot => {
              let data = childSnapshot.val();
              logsArray.push({
                  "time": data.time,
                  "action": data.action,
                  "user": data.user
              });
          });

      //Sắp xếp logs theo thời gian
      logsArray.sort((a, b) => new Date(b.time) - new Date(a.time));
      
      // Cập nhật state với logs đã sắp xếp
      setLogs(logsArray);
      });
  }, []);

  //Kiểm tra role của user
  const checkRoleFromToken = (token) => {
    try {
        if (token) {
            const decoded = jwtDecode(token, false);
            return {
                uid: decoded.uid,
                email: decoded.email,
                role: decoded.role
            };
        }
        return null;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
  };

  const {role} = checkRoleFromToken(user?.token);
  console.log(`This is role: ${role}`);

   return (
    <div>
      <table id="infoTable">
      <thead>
        <tr>
          <th class="time">Thời gian</th>
          <th class="action">Hành động</th>
          <th class="user">Người thực hiện</th>
        </tr>
      </thead>
      <tbody>
      {logs && logs.map((log, index) => (
          <tr key={index}>
            <td className="timeRow">{log?.time}</td>
            <td className="actionRow">{log?.action}</td>
            <td className="userRow">{log?.user}</td>
          </tr>
        ))}
      </tbody>
     </table>
     <div className="space"></div>
    </div>
  );
}

export{Log}