import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ChatWidget from "@/components/ChatWidget";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 md:pt-20">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  );
};

export default Layout;
