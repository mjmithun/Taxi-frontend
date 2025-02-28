import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../Config';
import Button from './Button';

const AccountDetails = () => {
    const { year, month } = useParams();
    const [account, setAccount] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/finance/admin/company-finance/${year}/${month}/`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        }
                    }
                );
                setAccount(response.data);
            } catch (error) {
                console.error('Error fetching account details:', error);
            }
        };

        fetchAccountDetails();
    }, [year, month]);

    const handleBack = () => {
        navigate(-1);
    };

    if (!account) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <div className="w-[500px] shadow-lg border border-gray-100 bg-component p-6 flex flex-col gap-6">
                    <div className="flex justify-between">
                        <h2 className="text-2xl font-bold">Account Details</h2>
                        <Button handleClick={handleBack} />
                    </div>
                    <p className="text-lg">No details can be found for this month and year</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="w-[500px] m-14 shadow-lg border border-gray-100 bg-component p-8 flex flex-col gap-2">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Account Details</h2>
                    <div className='mt-7'>

                        <Button handleClick={handleBack} />
                    </div>
                </div>
                <div className="text-lg flex flex-wrap">
                    <p className="w-1/2"><strong>Year:</strong> {account.year}</p>
                    <p className="w-1/2"><strong>Month:</strong> {account.month}</p>
                    <p className="w-1/2"><strong>Start Balance:</strong> {account.cashBox?.startBalance}</p>
                    <p className="w-1/2"><strong>End Balance:</strong> {account.cashBox?.endBalance}</p>
                    <p className="w-1/2"><strong>Accounting:</strong> {account.expenses?.accounting}</p>
                    <p className="w-1/2"><strong>Advertising:</strong> {account.expenses?.advertising}</p>
                    <p className="w-1/2"><strong>Insurance:</strong> {account.expenses?.insurance}</p>
                    <p className="w-1/2"><strong>Loan Payments:</strong> {account.expenses?.loanPayments}</p>
                    <p className="w-1/2"><strong>Maintenance:</strong> {account.expenses?.maintenance}</p>
                    <p className="w-1/2"><strong>Miscellaneous:</strong> {account.expenses?.miscellaneous}</p>
                    <p className="w-1/2"><strong>Phone:</strong> {account.expenses?.phone}</p>
                    <p className="w-1/2"><strong>Rent:</strong> {account.expenses?.rent}</p>
                    <p className="w-1/2"><strong>Trip Expense:</strong> {account.expenses?.tripExpense}</p>
                    <p className="w-1/2"><strong>Utilities:</strong> {account.expenses?.utilities}</p>
                    <p className="w-1/2"><strong>Wages:</strong> {account.expenses?.wages}</p>
                </div>

            </div>
        </div>
    );
};

export default AccountDetails;
