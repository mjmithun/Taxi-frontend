import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { BASE_URL } from "../Config";

const AccountList = () => {
    const navigate = useNavigate();

    const onAddaccountsclick = () => {
        navigate('/addaccounts');
    };

    const handleRowClick = (year, month) => {
        navigate(`/accountdetails/${year}/${month}`);  // ✅ Use route parameters
    };


    const [financialData, setFinancialData] = useState([]);

    useEffect(() => {
        const fetchFinancialData = async () => {
            const startYear = 2024;
            const startMonth = 6; // June 2024
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
            const dataArray = [];

            for (let year = startYear; year <= currentYear; year++) {
                for (let month = (year === startYear ? startMonth : 1); month < (year === currentYear ? currentMonth : 13); month++) {
                    try {
                        const response = await axios.get(`${BASE_URL}/api/finance/admin/company-finance/${year}/${month}`, {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in headers
                            },
                        });

                        dataArray.push({
                            year,
                            month,
                            totalCashIn: response.data.cashBox.startBalance || 0,
                            totalCashOut: response.data.cashBox.endBalance || 0,
                            cashEndOfMonth: response.data.cashBox.startBalance - response.data.cashBox.endBalance || 0, // Fixed logic
                        });
                    } catch (error) {
                        dataArray.push({
                            year,
                            month,
                            totalCashIn: 0,
                            totalCashOut: 0,
                            cashEndOfMonth: 0,
                        });
                    }
                }
            }
            setFinancialData(dataArray);
        };
        fetchFinancialData();
    }, []);

    return (
        <div>
            <div className="self-stretch shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] border-[1px] border-solid border-gray-100 bg-component flex flex-row items-start justify-evenly pt-[31px] pb-[33px] pr-[65px] pl-[52px] box-border max-w-full gap-[20px] rounded-3xl min-w-min h-[560px] mq750:gap[3px] mq750:justify-center mq750:box-border mq750:px-9 mq750:ml-9 mq750:mt-10">
                <form className="m-0 self-stretch h-[615.3px] flex flex-col items-start justify-start pt-0 px-0 gap-[9.5px] max-w-full mq450:box-border">
                    <div className="flex justify-between min-w-full mq750:gap-[20px]">
                        <div className="left-div font-semibold text-[35px] md:text-[30px] ml-4 md:ml-6 mq750:text-[20px]">
                            All Accounts
                        </div>
                        <div className="right-div">
                            <button className="border-[3px] border-solid border-[#5932EA] text-black font-bold text-[20px] md:text-[20px] px-2 py-1 rounded-lg w-full md:w-[190px] h-[40px] mix-blend-normal mq750:text-[15px]cursor-pointer"
                                onClick={onAddaccountsclick}
                            >
                                Add Accounts
                            </button>
                        </div>
                    </div>
                    <div className="container mx-auto px-4 py-4 mq750:px-2">
                        <table className="min-w-full border-b-4 border-black">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b text-[25px] font-normal mq750:text-[20px] mq750:px-2">Month</th>
                                    <th className="px-4 py-2 border-b text-[25px] font-normal mq1224:hidden">Total Cash In</th>
                                    <th className="px-4 py-2 border-b text-[25px] font-normal mq1224:hidden">Total Cash Out</th>
                                    <th className="px-4 py-2 border-b text-[25px] font-normal mq1224:hidden">Cash at End of Month</th>
                                </tr>
                            </thead>
                            <tbody className="text-[15px] font-dm-sans">
                                {financialData.map((data, index) => (
                                    <tr key={index}>
                                        <td
                                            className="px-4 py-2 border-b border-white cursor-pointer text-black hover:text-[#7551ff] no-underline mq750:text-[15px] mq750:px-2"
                                            onClick={() => handleRowClick(data.year, data.month)}
                                        >
                                            {`${data.year}-${data.month}`}
                                        </td>
                                        <td className="px-4 py-2 border-b font-light text-[15px] mq1224:hidden">{data.totalCashIn}</td>
                                        <td className="px-4 py-2 border-b font-light text-[15px] mq1224:hidden">{data.totalCashOut}</td>
                                        <td className="px-4 py-2 border-b font-light text-[15px] mq1224:hidden">{data.cashEndOfMonth}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountList;
