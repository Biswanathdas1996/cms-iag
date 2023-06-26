import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Redux from "./pages/Redux";
import ApiCall from "./pages/ApiCall";
import CMS from "./pages/CMS";
import { site_text } from "./utils/languageMapper";
import { useDispatch, useSelector } from "react-redux";
import { updateLanguage } from "./redux/slices/config/configSlice";
import Header from "./layout/Header";

function App() {
  const config = useSelector((state) => state.config);
  const dispatch = useDispatch();

  window.site_lang = config?.language;
  window.site_text = site_text;

  React.useEffect(() => {
    const lang_value = localStorage.getItem("site-lang");
    if (lang_value) {
      dispatch(updateLanguage(lang_value));
    } else {
      dispatch(updateLanguage("Engligh"));
    }
  }, []);

  const changeLang = (lang) => {
    dispatch(updateLanguage(lang));
    localStorage.setItem("site-lang", lang);
  };

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "2rem",
        }}
      >
        <Link to="/" className="header-link">
          Home
        </Link>
      </div>

      <Routes>
        <Route exact path="/" element={<CMS />} />
        <Route exact path="/redux" element={<Redux />} />
        <Route exact path="/api" element={<ApiCall />} />
      </Routes>
    </>
  );
}

export default App;