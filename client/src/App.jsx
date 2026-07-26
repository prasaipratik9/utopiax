import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ContentProvider } from "./context/ContentContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import OpenMindX from "./pages/OpenMindX";
import IdeationWorX from "./pages/IdeationWorX";
import LumiereX from "./pages/LumiereX";
import Xperiences from "./pages/Xperiences";
import Media from "./pages/Media";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/openmindx" element={<OpenMindX />} />
            <Route path="/ideationworx" element={<IdeationWorX />} />
            <Route path="/lumierex" element={<LumiereX />} />
            <Route path="/xperiences" element={<Xperiences />} />
            <Route path="/media" element={<Media />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
