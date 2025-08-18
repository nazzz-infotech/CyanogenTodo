import { Helmet } from "react-helmet";
import Home from "./Home/home";
import Create from "./create/create";
import Update from "./update/update";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Helmet>
        <title>Cyanogen Todo</title>

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme color (address bar color on mobile Chrome, etc.) */}
        <meta name="theme-color" content="#4527a0" />

        {/* iOS support (optional, for Safari) */}
        <link rel="apple-touch-icon" href="/app_icons/icon_192X192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </Helmet>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/update/:id" element={<Update />} />
      </Routes>
    </>
  );
}

export default App;
