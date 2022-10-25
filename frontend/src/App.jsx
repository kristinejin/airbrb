import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter,
  Route,
  Routes
} from "react-router-dom";
import Register from './pages/register.jsx';


function App() {
  return (
    <>
      <BrowserRouter>
          <Routes>
            <Route path="/register" element={<Register/>}></Route>
          </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
