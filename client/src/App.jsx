import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./pages/AdminServices";
import AdminProducts from "./pages/AdminProducts";
import AdminMedia from "./pages/AdminMedia";

export default function App() {
  return (
    <AuthProvider>
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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/media" element={<AdminMedia />} />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}
