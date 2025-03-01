import { useState, useEffect } from "react";
import NearbyPharmacies from '../Pharmacy/NearbyPharmacies';
import Sidebar from './Sidebar';

import Header from "../Function/Header";

export default function Map() {
  const [isCollapsed, setIsCollapsed] = useState(false);



  return (
    <>
      <div>
        <Header toggleMenu={() => setIsCollapsed(!isCollapsed)} />
      </div>
      <div className="min-h-screen flex">
        <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isCollapsed ? "ml-[80px]" : "ml-[250px]"
          }`}
        >
          <main className="flex-1 overflow-y-auto  mt-10">
          <NearbyPharmacies />
            
          </main>
        </div>
      </div>
    </>
  );
}
