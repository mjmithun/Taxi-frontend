import React, { useEffect, useState } from 'react';
import * as echarts from 'echarts';
import axios from 'axios';
import { BASE_URL } from '../Config.js';

const LineChart = ({ period }) => {
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        // Fetch data from the backend API
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/incomes/${localStorage.getItem("userRole")}/${period}-summary`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                console.log(`${period} data fetched:`, response.data);
                setMonthlyData(response.data);
            } catch (error) {
                console.error(`Error fetching ${period} data:`, error);
            }
        };

        fetchData();
    }, [period]);

    useEffect(() => {
        if (monthlyData.length === 0) {
            console.log("No data available to render the chart.");
            return;
        }

        console.log("Monthly Data for Chart:", monthlyData);

        const labels = monthlyData.map(item => {
            if (period === 'weekly') {
                return `${item._id.day}-${item._id.month}-${item._id.year}`;
            } else {
                return `${item._id.month}-${item._id.year}`;
            }
        });

        const chartDom = document.getElementById('main');
        const myChart = echarts.init(chartDom);

        const incomeData = monthlyData.map(item => item.totalIncome);
        const expenseData = monthlyData.map(item => item.totalExpense);
        const grossProfitData = monthlyData.map(item => item.grossProfit);
        const netProfitData = monthlyData.map(item => item.netProfit);

        const option = {
            backgroundColor: '#ffffff', // Set background color to white
            legend: {
                data: ['Income', 'Expense', 'Gross Profit', 'Net Profit'],
                textStyle: {
                    color: '#000000' // Black text for legend
                }
            },
            tooltip: {
                trigger: 'axis',
                textStyle: {
                    color: '#000000' // Black text for tooltips
                }
            },
            xAxis: {
                type: 'category',
                data: labels,
                axisLine: {
                    lineStyle: {
                        color: '#000000' // Black axis lines
                    }
                },
                axisLabel: {
                    color: '#000000' // Black text for x-axis labels
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#000000' // Black axis lines
                    }
                },
                axisLabel: {
                    color: '#000000' // Black text for y-axis labels
                },
                splitLine: {
                    lineStyle: {
                        color: '#cccccc' // Light grey for grid lines
                    }
                }
            },
            series: [
                {
                    name: 'Income',
                    type: 'line',
                    smooth: true,
                    data: incomeData,
                    lineStyle: {
                        color: '#1f77b4' // Blue line for Income
                    }
                },
                {
                    name: 'Expense',
                    type: 'line',
                    smooth: true,
                    data: expenseData,
                    lineStyle: {
                        color: '#ff7f0e' // Orange line for Expense
                    }
                },
                {
                    name: 'Gross Profit',
                    type: 'line',
                    smooth: true,
                    data: grossProfitData,
                    lineStyle: {
                        color: '#2ca02c' // Green line for Gross Profit
                    }
                },
                {
                    name: 'Net Profit',
                    type: 'line',
                    smooth: true,
                    data: netProfitData,
                    lineStyle: {
                        color: '#d62728' // Red line for Net Profit
                    }
                }
            ]
        };

        // Set the chart option with data
        myChart.setOption(option);

        return () => {
            myChart.dispose();
        };
    }, [monthlyData, period]);

    return <div id="main" className='w-full h-[400px] max-w-full rounded-2xl mq750:h-[300px] mq675:h-[250px] mq450:h-[200px] mq750:ml-2'></div>;
};

export default LineChart;
