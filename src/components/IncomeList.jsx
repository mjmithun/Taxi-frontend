import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Button,
    TextField,
} from "@mui/material";
import { BASE_URL } from "../Config.js";
import { useNavigate } from "react-router-dom";

const columns = [
    { id: "customerName", label: "Customer Name", minWidth: 170 },
    { id: "driverName", label: "Driver Name", minWidth: 170 },
    { id: "carName", label: "Car Name", minWidth: 170 },
    {
        id: "income",
        label: "Income",
        minWidth: 170,
        align: "right",
        format: (value) => value.toLocaleString("en-US"),
    },
];

const IncomeList = () => {
    const [trips, setTrips] = useState([]);
    const [expenses, setExpenses] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    // Fetch trips and associated expenses
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(
                    `${BASE_URL}/api/trips/${localStorage.getItem("userRole")}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const reversedTrips = response.data.reverse();
                setTrips(reversedTrips);
                await fetchExpenses(reversedTrips);
            } catch (error) {
                console.error("Error fetching trips:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchExpenses = async (trips) => {
            const newExpenses = {};
            for (const trip of trips) {
                try {
                    const response = await axios.get(
                        `${BASE_URL}/api/incomes/admin/total-expense/${trip.income}`,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );
                    newExpenses[trip.income] = response.data.totalExpense || 0;
                } catch (error) {
                    console.error("Error fetching expense for trip:", trip.income, error);
                    newExpenses[trip.income] = 0;
                }
            }
            setExpenses(newExpenses);
        };

        fetchTrips();
    }, []);

    const onAddExpenseClick = (tripId) => {
        const incomeId = trips.find((trip) => trip._id === tripId)?.income;
        if (incomeId) navigate(`/addexpense?incomeId=${incomeId}`);
    };

    const handleDownloadInvoice = async (tripId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/incomes/admin/${tripId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `invoice_${tripId}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } else if (response.status === 404) {
                alert("Invoice not found.");
            } else {
                console.error("Failed to fetch the invoice");
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
        }
    };

    const filteredTrips = trips
        .filter((trip) => {
            // Enhanced search filter to include name, email, and phone number
            const customerName = trip.customer?.name?.toLowerCase() || "";
            const email = trip.customer?.email?.toLowerCase() || "";
            const contactNumber = String(trip.customer?.contactNumber || "");
            const drivername = trip.driver?.name?.toLowerCase() || "";
            const searchTerm = searchQuery.toLowerCase();

            const matchesSearch =
                customerName.includes(searchTerm) ||
                email.includes(searchTerm) ||
                drivername.includes(searchTerm) ||
                contactNumber.includes(searchTerm);

            // Date range filter (unchanged)
            const tripDate = new Date(trip.startDate);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const matchesDateRange = (!start || tripDate >= start) &&
                (!end || tripDate <= end);

            return matchesSearch && matchesDateRange;
        })
        .map((trip) => ({
            id: trip._id,
            customerName: trip.customer?.name || "Unknown",
            driverName: trip.driver?.name || "Unknown",
            carName: trip.car?.make || "Unknown",
            income: trip.advance + trip.balance,
            incomeId: trip.income,
        }));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <main className="flex flex-col mt-6 font-medium">
            <div className="mb-4 px-4 flex gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-2xl border-[1px] border-solid border-black p-4"
                />
                <TextField
                    type="date"
                    label="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    className="bg-white"
                />
                <TextField
                    type="date"
                    label="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    className="bg-white"
                />
            </div>

            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        Loading trips...
                                    </TableCell>
                                </TableRow>
                            ) : filteredTrips.length > 0 ? (
                                filteredTrips
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === "number"
                                                            ? column.format(value)
                                                            : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                {expenses[row.incomeId] > 0 ? (
                                                    <p className="text-black font-bold">
                                                        Expense: {expenses[row.incomeId]}
                                                    </p>
                                                ) : (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => onAddExpenseClick(row.id)}
                                                        size="small"
                                                        style={{ marginRight: "8px" }}
                                                    >
                                                        Add Expense
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDownloadInvoice(row.id)}
                                                    size="small"
                                                >
                                                    Download Invoice
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} align="center">
                                        No trips match your search criteria.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={filteredTrips.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </main>
    );
};

export default IncomeList;