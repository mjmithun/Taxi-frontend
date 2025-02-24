import { useState, useEffect } from "react";
import axios from "axios";

const AccountForm = () => {
    const [formData, setFormData] = useState({
        cashComingIn: '',
        inventory: '',
        rent: '',
        wages: '',
        utilities: '',
        phone: '',
        insurance: '',
        loanPayments: '',
        tripExpense: '',
        advertising: '',
        accounting: '',
        miscellaneous: '',
        maintenance: ''
    });

    const [yearMonth, setYearMonth] = useState(""); // Stores selected year and month
    const [cashAtStartOfMonth, setCashAtStartOfMonth] = useState(0);

    useEffect(() => {
        if (yearMonth) {
            const [year, month] = yearMonth.split("-");
            fetchPrevBalance(year, month);
            fetchTripExpense(year, month);
        }
    }, [yearMonth]);

    const fetchPrevBalance = async (year, month) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/finance/admin/company-finance/prev-balance/${year}/${month}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in headers
                },
            });
            console.log("response : ", response.data);
            setCashAtStartOfMonth(response.data.cashIn || 0);
        } catch (error) {
            console.error("Error fetching previous balance:", error);
        }
    };

    const fetchTripExpense = async (year, month) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/incomes/admin/monthly-income/${year}/${month}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in headers
                },
            });
            console.log(response.data);
            const tripExpenseTotal = response.data.extraExpense;
            setCashAtStartOfMonth(cashAtStartOfMonth + response.data.tripIncome);
            setFormData(prevState => ({ ...prevState, tripExpense: tripExpenseTotal, }));

        } catch (error) {
            console.error("Error fetching trip expenses:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const totalCashIn = cashAtStartOfMonth + Number(formData.cashComingIn || 0);

    const totalCashOut = Object.keys(formData)
        .filter(key => key !== "cashComingIn")
        .reduce((acc, key) => acc + Number(formData[key] || 0), 0);

    const cashAtEndOfMonth = totalCashIn - totalCashOut;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!yearMonth) {
            alert("Please select a month and year.");
            return;
        }

        const [year, month] = yearMonth.split("-");

        try {
            const payload = {
                startBalance: cashAtStartOfMonth,
                cashIn: Number(formData.cashComingIn || 0),
                expenses: {
                    inventory: Number(formData.inventory || 0),
                    rent: Number(formData.rent || 0),
                    wages: Number(formData.wages || 0),
                    utilities: Number(formData.utilities || 0),
                    phone: Number(formData.phone || 0),
                    insurance: Number(formData.insurance || 0),
                    loanPayments: Number(formData.loanPayments || 0),
                    tripExpense: Number(formData.tripExpense || 0),
                    advertising: Number(formData.advertising || 0),
                    accounting: Number(formData.accounting || 0),
                    miscellaneous: Number(formData.miscellaneous || 0),
                    maintenance: Number(formData.maintenance || 0),
                }
            };

            await axios.post(`http://localhost:8080/api/finance/admin/company-finance/${year}/${month}`, payload, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in headers
                },
            });
            alert("Data saved successfully!");
        } catch (error) {
            console.error("Error submitting data:", error);
        }
    };

    return (
        <div className="w-full right-0 bottom-0 left-0 px-4 py-4 md:px-16 lg:px-32 h-full text-left text-sm text-black z-0">
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center h-full w-full max-w-2xl mx-5 mt-8">
                        <div className="absolute shadow-md rounded-2xl box-border border border-gray-100 bg-component w-full h-full p-14 md:p-16 overflow-y-auto"></div>

                        <div className="relative flex flex-col gap-2 p-6 z-50 w-full">
                            <div className="flex flex-row gap-2">
                                <div className="pb-6 font-semibold text-[25px] text-center">Account Summary</div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className="font-medium text-sm">Month & Year</label>
                                    <input
                                        type="month"
                                        value={yearMonth}
                                        onChange={(e) => setYearMonth(e.target.value)}
                                        className="w-11/12 bg-transparent border border-gray-400 outline-none text-black text-left p-2 rounded-md"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="font-medium text-sm">Cash at Start of Month</label>
                                    <div className="rounded-lg flex items-center border border-black p-3">{cashAtStartOfMonth}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-3">
                                    <label className="font-medium text-sm">Cash Coming In</label>
                                    <input
                                        name="cashComingIn"
                                        value={formData.cashComingIn}
                                        onChange={handleChange}
                                        className="w-11/12 bg-transparent border border-gray-400 outline-none text-black text-left p-2 rounded-md"
                                        placeholder="Enter Cash Coming In"
                                        type="number"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <label className="font-medium text-sm">Total Cash In</label>
                                    <div className="rounded-lg flex items-center border border-black p-3">{totalCashIn}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.keys(formData).map((field, index) => (
                                    field !== "cashComingIn" && (
                                        <div key={index} className="flex flex-col gap-3">
                                            <label className="font-medium text-sm">{field.replace(/([A-Z])/g, " $1").trim()}</label>
                                            <input
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                className="w-11/12 bg-transparent border border-gray-400 outline-none text-black text-left p-2 rounded-md"
                                                placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").trim()}`}
                                                type="number"
                                            />
                                        </div>
                                    )
                                ))}

                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="flex flex-col gap-3">
                                    <label className="font-medium text-sm">Total Cash Out</label>
                                    <div className="rounded-lg flex items-center border border-black p-3">{totalCashOut}</div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="font-medium text-sm">Cash at End of Month</label>
                                    <div className="rounded-lg flex items-center border border-black p-3">{cashAtEndOfMonth}</div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center mt-2">
                                <button type="submit" className="w-full md:w-[400px] rounded-2xl border border-primary-purple-blue-400 text-black py-3 px-4 font-medium text-lg">
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AccountForm;
