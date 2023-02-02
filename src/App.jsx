import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddProfile from './pages/AddProfile';
import Header from './components/Header';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <Routes>
          <Route path='/' element={<AddProfile />} />
          <Route path='view-profile/:profileId' element={<Profile />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
