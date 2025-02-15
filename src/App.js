import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { Register } from './Components/Register';
import SignIn from './Components/Login';
import { Content } from './Components/Content';
import { Settings } from './Components/Settings';
import { Log } from './Components/Log.js';
import { Upload } from './Components/Upload';
import { TopMenu } from './Components/TopMenu';
import { PicDetail } from './Components/PicDetail.js';
import { Profile } from './Components/Profile.js';
import ProtectedRoute from './Components/ProtectedRoute';
import { MyPhotos } from './Components/MyPhotos.js';
// import "./ImageDatabase.js";
//import "./LogDatabase.js";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/Register" element={<Register />} />

        <Route 
          path="/Home" 
          element={
            <ProtectedRoute>
              <TopMenu />
              <Content />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/Image/:id" 
          element={
            <ProtectedRoute>
              <TopMenu />
              <PicDetail />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/Settings" 
          element={
            <ProtectedRoute>
              <TopMenu />
              <Settings />
            </ProtectedRoute>
          } 
        />

      <Route path="/Log" element=
      {<>
       <ProtectedRoute>
         <TopMenu />
         <Log />
       </ProtectedRoute>
      </>
      } />

      <Route 
        path="/Upload" 
        element={
          <ProtectedRoute>
            <TopMenu />
            <Upload />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/Profile" 
        element={
          <ProtectedRoute>
            <TopMenu />
            <Profile />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/myPhotos" 
        element={
          <ProtectedRoute>
            <TopMenu />
            <MyPhotos />
          </ProtectedRoute>
        } 
      />

      </Routes>
    </div>
  );
}

export default App;