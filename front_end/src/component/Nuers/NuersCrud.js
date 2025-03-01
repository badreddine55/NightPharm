import { useState } from "react";

import Sidebar from "../Function/Sidebar";
import Header from "../Function/Header";
import NuersManagement from "./NuersManagement";

export default function NuersCrud() {
  const [isCollapsed, setIsCollapsed] = useState(false);


  return (
        <>
        <div><Header toggleMenu={() => setIsCollapsed(!isCollapsed)} /></div>
        <div className="min-h-screen flex mt-20">
          {/* Sidebar */}
    
          {/* Main Content Area */}
          <div
            className={`flex-1 flex flex-col transition-all duration-300 ${
              isCollapsed ? "ml-[80px]" : "ml-[250px]"
            }`}
          >
            {/* Header */}
    
            <NuersManagement/>
    
            {/* Dashboard Content */}
            <main className="flex-1 overflow-y-auto p-6 ">
    
            <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />
    
            </main>
          </div>
        </div>
        </>
  );
}
