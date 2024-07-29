import React from "react";
import Sidebar from "@/components/shared/Sidebar";
import MobileNav from "@/components/shared/MobileNav";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root">
      <ErrorBoundary>
        <Sidebar />
        {<MobileNav />}

        <div className="root-container">
          <div className="wrapper">{children}</div>
        </div>
        <Toaster />
      </ErrorBoundary>
    </main>
  );
};

export default Layout;
