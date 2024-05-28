import Footer from "./Footer";
import NavHeader from "./NavHeader";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-layout">
      <header className="nav-header">
        <NavHeader />
      </header>
      <main className="page-content">{children}</main>
      <div
        id="footer-container"
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: "5%",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
