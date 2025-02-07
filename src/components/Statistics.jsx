import React, { useState, useEffect } from 'react';
import axios from "axios";
import PropTypes from "prop-types";
import MetricItem from "./MetricItem.jsx";
import trip from '../data/trip.json';
import LineChart from "../charts/LineChart.jsx";
import { BASE_URL } from "../Config.js";
import {TextField} from "@mui/material";

const Statistics = () => {
  const [tableData, setTableData] = useState([]);
  const [period, setPeriod] = useState('monthly');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [trips, setTrips] = useState([]);

  // States for the date filter box
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statsResult, setStatsResult] = useState(null);

  useEffect(() => {
    const fetchIncomeExpenses = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/incomes/admin/total-income-expenses/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,

          },
        });
        const data = response.data;
        console.log("total income", data);
        setTotalIncome(data.totalIncome);
        setTotalExpenses(data.totalExpenses);
      } catch (error) {
        console.error("Error fetching income and expenses:", error);
      }
    };

    fetchIncomeExpenses();
  }, []);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/trips/${localStorage.getItem("userRole")}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTrips(response.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();
  }, []);

  // Count the total number of trips and completed trips
  const totalTrips = trips.length;
  const completedTrips = trips.filter(trip => trip.status === 'completed').length;

  useEffect(() => {
    // Set the table data from JSON file
    setTableData(trip);
  }, []);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  // Handlers for date inputs
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  // Handler for the Apply button
  const handleApply = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/incomes/admin/date-wise-summary/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        params: {
          startDate,
          endDate,
        },
      });
      setStatsResult(response.data);
    } catch (error) {
      console.error("Error fetching filtered stats:", error);
    }
  };

  return (
    <section className="flex-1 flex flex-col items-start justify-start pt-[29px] px-0 pb-0 box-border max-w-[calc(100%_-_340px)] text-left mq1224:max-w-full">
      <div className="w-full flex flex-col gap-[43px]">
        {/* Container for Statistics and Date Filter boxes */}
        <div className="w-full flex flex-row gap-8 mq750:flex-col">
          {/* Statistics Box */}
          <div className="flex-1 shadow-[0px_4px_3px_rgba(0,0,0,0.25)] rounded-lg border border-gray-100 bg-white p-6 mq750:pl-5 mq750:pt-5 mq750:pb-5 mq750:box-border">
            {/* Header & Period Filter */}
            <div className="flex flex-row items-center justify-between gap-[12px] mb-4">
              <h2 className="m-0 text-black leading-[32px] font-semibold text-[35px] mq450:text-lgi mq450:leading-[26px]">
                Statistics
              </h2>
              <div className="rounded-md flex flex-row items-center justify-start py-2.5 px-[15px] gap-[8px] text-sm border border-neutral-50">
                <img
                  className="h-6 w-6 hidden min-h-[24px]"
                  alt=""
                  src="/calendar.svg"
                />
                <div className="leading-[20px] font-normal text-[20px] min-w-[74px] text-black">
                  <select
                    value={period}
                    onChange={handlePeriodChange}
                    className="border border-gray-100 bg-component text-black font-semibold text-[12px] py-2 px-4 focus:outline-none"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Metrics */}
            <div className="flex flex-row flex-wrap gap-[30px]">
              <MetricItem
                heading="Customers"
                number={totalTrips}
                propBorder="2px solid black"
                propBgColor="blue"
              />
              <MetricItem
                heading="Completed Trips"
                number={completedTrips}
                propBorder="2px solid black"
                propBgColor="orange"
              />
              <MetricItem
                heading="Income"
                number={`₹ ${totalIncome}`}
                propBorder="2px solid black"
                propBgColor="green"
              />
              <MetricItem
                heading="Expenses"
                number={`₹ ${totalExpenses}`}
                propBorder="2px solid black"
                propBgColor="red"
              />
            </div>
          </div>

          {/* Date Filter Box */}
          <div className="w-full max-w-[500px] shadow-[0px_4px_3px_rgba(0,0,0,0.25)] rounded-lg border border-gray-200 bg-white p-6 flex flex-col gap-4">
            <h3 className="m-0 text-black leading-[32px] font-semibold text-[32px] mq450:text-lgi mq450:leading-[26px]">
              Income Filter
            </h3>
            {/* Row for Start Date, End Date, and Apply button */}
            <div className="flex flex-row gap-4 items-center">
              <div className="flex flex-col">
                {/* <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className="border border-gray-300 rounded p-2"
                /> */}
                <TextField
                    id="startDate"
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    InputLabelProps={{ shrink: true }}
                    className="bg-white"
                />
              </div>
              <div className="flex flex-col">
                {/* <label htmlFor="endDate" className="text-sm">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  className="border border-gray-300 rounded p-2"
                /> */}
                <TextField
                    id="endDate"
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    InputLabelProps={{ shrink: true }}
                    className="bg-white"
                />
              </div>
              <button
                onClick={handleApply}
                className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>

            {/* Displaying the stats results as Metric Items */}
            {statsResult && (
              <div className="flex flex-row flex-wrap gap-[30px] mt-4">
                <MetricItem
                  heading="Income"
                  number={`₹ ${statsResult.totalIncome}`}
                  propBorder="2px solid black"
                  propBgColor="green"
                />
                <MetricItem
                  heading="Expense"
                  number={`₹ ${statsResult.totalExpense}`}
                  propBorder="2px solid black"
                  propBgColor="red"
                />
                <MetricItem
                  heading="Gross Profit"
                  number={`₹ ${statsResult.grossProfit}`}
                  propBorder="2px solid black"
                  propBgColor="orange"
                />
                <MetricItem
                  heading="Net Profit"
                  number={`₹ ${statsResult.netProfit}`}
                  propBorder="2px solid black"
                  propBgColor="blue"
                />
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <LineChart period={period} />
      </div>
    </section>
  );
};

export default Statistics;