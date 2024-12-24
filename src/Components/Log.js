import { useState, useEffect, useContext } from "react";
import { database } from "../firebase-config";
import { onValue, ref } from "firebase/database";
import "../Styles/Log.css";
import { UserContext } from "./UserContext";
import { jwtDecode } from "jwt-decode";

function Log() {
    const {user} = useContext(UserContext)

    // Decode JWT
    const decoded = jwtDecode(user.token);
    const userRole = decoded.role;

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
      setLogs(logsArray); 
      });
  }, []);

  if(!user || userRole !== "admin"){
    return (
      <div className="errorScreen">
        <p>Tính năng này không khả dụng với bạn!</p>
      </div>
    );
  }

  else {
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
}

export{Log}