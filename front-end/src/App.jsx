import Home from "./Home/home";
import Create from "./create/create";
import Update from "./update/update";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/create" element={<Create/>}/>
        <Route path="/update/:id" element={<Update/>}/>
      </Routes>
    </>
  );
}

export default App;
