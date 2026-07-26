import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <div id="site-header">
        <Header />
      </div>
      <main className="site-main">
        <Outlet />
      </main>
      <div id="site-footer">
        <Footer />
      </div>
    </>
  );
}
