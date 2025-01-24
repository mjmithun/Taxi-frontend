import { useCallback } from "react";
import ContainerChartForm from "./components/ContainerChartForm.jsx";
import PieChart from "./components/PieChart.jsx";
import Earnings from "./components/Earnings.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Weekly from "./components/Weekly.jsx";
import TripsList from "./components/TripsList.jsx";

const Trip = () => {

    return (
        <div className="w-full  border-[1px] border-solid border-gray-100  bg-[#efefef] overflow-hidden flex flex-col items-end justify-start pl-0 box-border pb-8 leading-[normal] tracking-[normal] mq725:pr-[23px] mq725:box-border">
            <Header />
            <main className="w-full flex flex-row items-start justify-start gap-[63px]  mq1000:pl-5 mq1000:pr-5 mq1000:box-border mq725:gap-[16px]">
                <Sidebar />
                <TripsList />
            </main>
        </div>
    );
};

export default Trip;
