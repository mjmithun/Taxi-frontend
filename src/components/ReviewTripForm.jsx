import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Button from "./Button.jsx";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../Config.js";

const ReviewTripForm = ({ className = "", tripId }) => {
    const [formData, setFormData] = useState({
        discount: 0,
        tripExpense: 0,
        gstChecked: false,
        gstPercentage: 0,
        gstAmount: 0, // GST Amount will be calculated
        customerGstNumber: "", // New field for customer GST number
        paymentType: "", // New field for payment type
        paymentDetail: "", // New field for card/cheque number
    });

    const [tripDetails, setTripDetails] = useState(null);
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/trips/${userRole}/pending/${tripId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setTripDetails(response.data);
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching trip details:", error);
            }
        };

        fetchTripDetails();
    }, [tripId, userRole]);

    const handleBack = () => {
        navigate(-1);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });

        if (name === "gstPercentage" && formData.gstChecked) {
            const gstAmount = (parseFloat(value) / 100) * (Number(calculateBalance() + tripDetails.advance) || 0);
            setFormData((prevData) => ({
                ...prevData,
                gstAmount,
            }));
        }
    };



    const calculateBalance = () => {
        if (!tripDetails) return 0;

        const farePrice = tripDetails.fare || 0;
        const advanceAmount = tripDetails.advance || 0;
        const endKm = tripDetails.endKm || 0;
        const startKm = tripDetails.startKm || 0;
        const discount = parseFloat(formData.discount) || 0;
        const tripExpense = parseFloat(formData.tripExpense) || 0;
        let balance = 0;

        if (tripDetails.fareType === "day") {
            const daysDifference = Math.ceil(
                (new Date() - new Date(tripDetails.startDate)) / (1000 * 60 * 60 * 24)
            );
            balance = farePrice * daysDifference - advanceAmount - discount + tripExpense;
        } else if (tripDetails.fareType === "km") {
            balance = farePrice * (endKm - startKm) - advanceAmount - discount + tripExpense;
        }

        return balance || 0; // Ensure balance is always a number
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tripDetails) {
            alert("Trip details are not available.");
            return;
        }

        const balance = calculateBalance();
        const tripExpense = formData.tripExpense;
        const gstAmount = formData.gstAmount;
        const gstPercentage = formData.gstPercentage;
        try {
            const response = await axios.post(
                `${BASE_URL}/api/trips/${userRole}/${tripDetails._id}/finalize-trip`,
                {
                    ...formData,
                    balance,
                    tripExpense,
                    gstPercentage,
                    gstAmount
                    ,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            if (response.status === 200) {
                navigate("/trips");
            }
        } catch (error) {
            console.error("Error ending the trip:", error);
        }
    };

    let TotalBalanceAmount = 0;
    if (formData.gstChecked) {
        TotalBalanceAmount = (Number(calculateBalance()) || 0) + parseFloat(formData.gstAmount || 0);
    } else {
        TotalBalanceAmount = (Number(calculateBalance()) || 0)
    }

    return (
        <div className={`w-full px-4 h-full text-left text-sm text-black ${className}`}>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col items-center">
                    <div className="relative flex items-center justify-center h-full w-full max-w-2xl mx-auto mt-16">
                        <div className="absolute shadow-md rounded-2xl box-border border-[1px] border-solid border-gray-100  bg-component w-full h-full p-8"></div>

                        <div className="relative flex flex-col gap-6 z-50 w-full p-4">
                            <div className="flex flex-row gap-2">
                                <div className="pb-6 font-semibold text-[25px] text-center">Complete Trip</div>
                                <div className="absolute right-0 top-0 mt-4">
                                    <Button handleClick={handleBack} />
                                </div>
                            </div>
                            {userRole !== "driver" && (
                                <>
                                    <div className="flex flex-col md:flex-row justify-between gap-4 text-lg font-bold">
                                        <div className="flex flex-col gap-2 flex-1">
                                            <label className="font-medium text-sm">Trip Expense</label>
                                            <div className="rounded-2xl flex items-center border-[1px] border-solid border-black p-4">
                                                <input
                                                    name="tripExpense"
                                                    value={formData.tripExpense}
                                                    onChange={handleChange}
                                                    className="w-full bg-transparent border-none outline-none text-black text-left"
                                                    placeholder="Enter Trip Expense"
                                                    type="number"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 flex-1">
                                            <label className="font-medium text-sm">Discount</label>
                                            <div className="rounded-2xl flex items-center border-[1px] border-solid border-black p-4">
                                                <input
                                                    name="discount"
                                                    value={formData.discount}
                                                    onChange={handleChange}
                                                    className="w-full bg-transparent border-none outline-none text-black text-left"
                                                    placeholder="Enter Discount"
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* GST Section */}
                                    <div className="flex flex-col gap-4">
                                        <label className="font-medium text-sm">Apply GST %</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="gstChecked"
                                                checked={formData.gstChecked}
                                                onChange={handleChange}
                                            />
                                            <span>Tick to apply GST</span>
                                        </div>
                                        {formData.gstChecked && (
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex flex-col gap-2 flex-1">
                                                    <label className="font-medium text-sm">GST %</label>
                                                    <div className="rounded-2xl flex items-center border-[1px] border-solid border-black p-4">
                                                        <input
                                                            name="gstPercentage"
                                                            value={formData.gstPercentage}
                                                            onChange={handleChange}
                                                            className="w-full bg-transparent border-none outline-none text-black text-left"
                                                            placeholder="Enter GST Percentage"
                                                            type="number"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2 flex-1">
                                                    <label className="font-medium text-sm">GST Amount</label>
                                                    <div className="rounded-2xl flex items-center border-[1px] border-solid border-black p-4">
                                                        <input
                                                            name="gstAmount"
                                                            value={formData.gstAmount ? formData.gstAmount.toFixed(2) : "0.00"}
                                                            className="w-full bg-transparent border-none outline-none text-black text-left"
                                                            placeholder="GST Amount"
                                                            type="number"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Customer GST Number */}
                                        <div className="flex flex-col gap-2 flex-1">
                                            <label className="font-medium text-sm">Customer GSTIN Number</label>
                                            <div className="rounded-2xl flex items-center border-[1px] border-solid border-black p-4">
                                                <input
                                                    name="customerGstNumber"
                                                    value={formData.customerGstNumber}
                                                    onChange={handleChange}
                                                    className="w-full bg-transparent border-none outline-none text-black text-left"
                                                    placeholder="Enter Customer GST Number"
                                                    type="text"
                                                />
                                            </div>
                                        </div>

                                        {/* Payment Type Section */}
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex flex-col gap-4 flex-1">
                                                <label className="font-medium text-sm">Payment Type</label>
                                                <div className="rounded-2xl flex items-center border-[1px] border-solid border-black p-4">
                                                    <select
                                                        name="paymentType"
                                                        value={formData.paymentType}
                                                        onChange={handleChange}
                                                        className="w-full bg-transparent border-none outline-none text-black text-left"
                                                    >
                                                        <option value="">Select Payment Type</option>
                                                        <option value="Cash">Cash</option>
                                                        <option value="Card">Card</option>
                                                        <option value="Cheque">Cheque</option>
                                                        <option value="UPI">UPI</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Conditional Card/Cheque Number */}
                                            {(formData.paymentType === "Card" || formData.paymentType === "Cheque") && (
                                                <div className="flex flex-col gap-4 flex-1">
                                                    <label className="font-medium text-sm">{formData.paymentType === "Card" ? "Card Number" : "Cheque Number"}</label>
                                                    <div className="rounded-2xl flex items-center border-[1px] border-solid border-black p-4">
                                                        <input
                                                            name="paymentDetail"
                                                            value={formData.paymentDetail}
                                                            onChange={handleChange}
                                                            className="w-full bg-transparent border-none outline-none text-black text-left"
                                                            placeholder={`${formData.paymentType === "card" ? "Enter Card Number" : "Enter Cheque Number"}`}
                                                            type="text"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Summary Section */}
                            <div className="mt-2 w-full box-border border-[1px] border-solid border-black bg-component p-6 rounded-2xl text-black shadow-md">
                                <h2 className="text-lg font-semibold mb-4">Trip Summary</h2>
                                {/* <div className="flex justify-between">
                                    <span>Balance:</span>
                                    <span>{calculateBalance().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Total Amount:</span>
                                    <span>{TotalAmount.toFixed(2)}</span>
                                </div> */}
                                {/* Cusstomer Trip Details */}
                                <h3 className="text-lg font-semibold mb-4">Customer Details</h3>
                                <div className="flex justify-between mb-2">
                                    <span>Name:</span>
                                    <span>{tripDetails?.customer?.name || "N/A"}</span> {/* Placeholder for Customer Name */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Email:</span>
                                    <span>{tripDetails?.customer?.email || "N/A"}</span> {/* Placeholder for Customer Email */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>PhoneNo:</span>
                                    <span>{tripDetails?.customer?.contactNumber || "N/A"}</span> {/* Placeholder for Customer Email */}
                                </div>

                                <h3 className="text-lg font-semibold mb-4">Trip Details</h3>

                                <div className="flex justify-between mb-2">
                                    <span>Driver:</span>
                                    <span>{tripDetails?.driver?.name || "N/A"}</span> {/* Placeholder for Driver Name */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Car:</span>
                                    <span>{tripDetails?.car?.make || "N/A"}</span> {/* Placeholder for Car Name */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Car No:</span>
                                    <span>{tripDetails?.car?.registrationNumber || "N/A"}</span> {/* Placeholder for Car Name */}
                                </div>

                                <div className="flex justify-between mb-2">
                                    <span>Start Date:</span>
                                    <span>{new Date(tripDetails?.startDate).toLocaleString() || "N/A"}</span> {/* Placeholder for Start Date */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>End Date:</span>
                                    <span>{new Date(tripDetails?.endDate).toLocaleString() || "N/A"}</span> {/* Placeholder for End Date */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Total Kilometers:</span>
                                    <span>{tripDetails?.endKm - tripDetails?.startKm || "N/A"} km</span> {/* Placeholder for Total Kilometers */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Trip Expense Amount:</span>
                                    <span>{parseInt(formData.tripExpense).toFixed(2) || 0}</span> {/* Placeholder for Trip Expense */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Discount Amount:</span>
                                    <span>{parseFloat(formData.discount).toFixed(2) || 0}</span> {/* Placeholder for Trip Discount */}
                                </div>

                                {/* Payment Details */}
                                <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
                                <div className="flex justify-between mb-2">
                                    <span>Advance Amount:</span>
                                    <span>{parseFloat(tripDetails?.advance).toFixed(2) || 0}</span> {/* Placeholder for Trip Advance */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>GST Amount:</span>
                                    <span>{parseFloat(formData.gstAmount).toFixed(2) || 0}</span> {/* Placeholder for Trip Advance */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Total Balance Amount:</span>
                                    <span>{TotalBalanceAmount.toFixed(2) || 0}</span> {/* Placeholder for Trip Balance */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Payment Mode:</span>
                                    <span>{formData.paymentType || "N/A"}</span> {/* Placeholder for Trip Advance */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Total Trip Income:</span>
                                    <span>{(parseFloat(tripDetails?.advance) + (Number(calculateBalance()) || 0) - (parseFloat(formData.tripExpense))).toFixed(2)}</span> {/* Placeholder for Trip Total Income */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Amount Paid:</span>
                                    <span>{parseFloat(tripDetails?.advance).toFixed(2) || 0}</span> {/* Placeholder for Amount Paid */}
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Amount Due:</span>
                                    <span>{TotalBalanceAmount.toFixed(2) || 0}</span> {/* Placeholder for Amount Due */}
                                </div>
                                <div className="flex justify-between mb-2 mt-10">
                                    <span className="text-lg font-semibold">Total Amount To Pay:</span>
                                    <span>{TotalBalanceAmount.toFixed(2) || 0}</span> {/* Placeholder for Amount Due */}
                                </div>
                            </div>

                            {/* Complete Trip Button */}
                            <div className="flex flex-col items-center mt-4">
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer md:w-[400px] rounded-2xl border-[3px] border-solid border-primary-purple-blue-400 text-black py-3 px-4 font-medium text-lg "
                                >
                                    Complete Trip
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

ReviewTripForm.propTypes = {
    className: PropTypes.string,
    tripId: PropTypes.string.isRequired,
};

export default ReviewTripForm;
