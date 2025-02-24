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
                    `http://localhost:8080//api/finance/admin/company-finance/${year}/${month}`,
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
                    <p className="text-lg">Error fetching account information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <div className="w-[500px] shadow-lg border border-gray-100 bg-component p-6 flex flex-col gap-6">
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold">Account Details</h2>
                    <Button handleClick={handleBack} />
                </div>
                <div className="text-lg">
                    <p><strong>Year:</strong> {account.year}</p>
                    <p><strong>Month:</strong> {account.month}</p>
                    <p><strong>Start Balance:</strong> {account.cashBox?.startBalance}</p>
                    <p><strong>End Balance:</strong> {account.cashBox?.endBalance}</p>
                    <p><strong>Accounting:</strong> {account.expenses?.accounting}</p>
                    <p><strong>Advertising:</strong> {account.expenses?.advertising}</p>
                    <p><strong>Insurance:</strong> {account.expenses?.insurance}</p>
                    <p><strong>Loan Payments:</strong> {account.expenses?.loanPayments}</p>
                    <p><strong>Maintenance:</strong> {account.expenses?.maintenance}</p>
                    <p><strong>Miscellaneous:</strong> {account.expenses?.miscellaneous}</p>
                    <p><strong>Phone:</strong> {account.expenses?.phone}</p>
                    <p><strong>Rent:</strong> {account.expenses?.rent}</p>
                    <p><strong>Trip Expense:</strong> {account.expenses?.tripExpense}</p>
                    <p><strong>Utilities:</strong> {account.expenses?.utilities}</p>
                    <p><strong>Wages:</strong> {account.expenses?.wages}</p>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
