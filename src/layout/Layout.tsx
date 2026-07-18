import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FloatingActions from "./FloatingActions";

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <Navbar />
      <main className="pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
