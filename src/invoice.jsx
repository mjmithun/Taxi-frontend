import React from 'react';
import RideCard from './components/RideCard.jsx';
import IncomeList from './components/IncomeList.jsx'
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";



const rideData = [
    { customerName: 'name', driverName: 'name', amount: 'name', carName: 'name' },
    { customerName: 'name', driverName: 'name', amount: 'name', carName: 'name' },
    { customerName: 'name', driverName: 'name', amount: 'name', carName: 'name' },
    { customerName: 'name', driverName: 'name', amount: 'name', carName: 'name' }
];

function invoice() {
    return (
        <div className="w-full  border-[1px] border-solid border-gray-100  bg-[#efefef] overflow-hidden flex flex-col items-end justify-start    pl-0 box-border pb-8 leading-[normal] tracking-[normal] mq725:pr-[23px] mq725:box-border">
            <Header />
            <main className="w-full flex flex-row items-start justify-start gap-[63px]  mq1000:pl-5 mq1000:pr-5 mq1000:box-border mq725:gap-[16px]">
                <Sidebar />
                <IncomeList />
            </main>
        </div>
    );
}

export default invoice;