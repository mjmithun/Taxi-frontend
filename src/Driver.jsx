
import { useCallback } from "react";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Driverslist from "./components/Driverslist.jsx";
import React from "react";

const Driver = () => {


  return (
    <div className="w-full  border-[1px] border-solid border-gray-100  bg-[#efefef] overflow-hidden flex flex-col items-end justify-start pl-0 box-border pb-8 leading-[normal] tracking-[normal] mq725:pr-[23px] mq725:box-border">
            <Header />
            <main className="w-full flex flex-row items-start justify-start gap-[63px] max-w-full mq975:pl-5 mq975:pr-5 mq975:box-border mq450:gap-[16px] mq750:gap-[31px]">
                <Sidebar />
                <Driverslist />
            </main>
        </div>
  );
};

export default Driver;
