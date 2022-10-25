import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from './pages/Register.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
      <Routes>
          {/* <Route path='/' element={<LandingPage />} /> */}
        <Route path='/register' element={<Register/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
