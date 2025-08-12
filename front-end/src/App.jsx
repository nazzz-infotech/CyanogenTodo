import Home from "./Home/home";
import Create from "./create/create";
import Update from "./update/update";
import { Routes, Route } from "react-router-dom";

function App() {
  useEffect(() => {
    const setMetaTag = (name, attr, value) => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    };

    const color = "#4527a0"; // your desired color

    // Android Chrome, Edge, Samsung Internet
    setMetaTag("theme-color", "name", color);

    // Windows Phone navigation bar
    setMetaTag("msapplication-navbutton-color", "name", color);

    // iOS Safari
    setMetaTag("apple-mobile-web-app-capable", "name", "yes");
    setMetaTag(
      "apple-mobile-web-app-status-bar-style",
      "name",
      "black-translucent"
    );
    // or "default", "black"
  }, []);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/update/:id" element={<Update />} />
      </Routes>
    </>
  );
}

export default App;
