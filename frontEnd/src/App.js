import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import Changes from "./pages/Changes";
import Intigration from "./pages/Intigration";
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

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/changes/:file/:brand" element={<Changes />} />
        <Route exact path="/doc" element={<Intigration />} />
      </Routes>
    </>
  );
}

export default App;
