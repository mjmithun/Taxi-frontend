import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Config";

const TripsList = () => {
    const navigate = useNavigate();

    const onAddTripClick = () => {
        navigate("/addtrip"); // Navigate to add trip form
    };

    const onReviewTripClick = (tripId) => {
        navigate(`/reviewtrip`); 
    };

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/trips/${localStorage.getItem("userRole")}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in headers
                    },
                });
                setTrips(response.data);
            } catch (error) {
                console.error("Error fetching trips:", error);
            }
        };

        fetchTrips();
    }, []);

    const onUpdateTripClick = (tripId) => {
        navigate(`/edittrip/${tripId}`);
    };

    const onEndTripClick = (tripId) => {
        navigate(`/endtrip/${tripId}`); 
    };

    return (
        <section className="flex-1 flex flex-col items-start justify-start pt-[29px] px-0 pb-0 box-border max-w-[calc(100%_-_371px)] text-left text-xs text-blacksmoke-400 font-poppins mq1224:h-[100vh]">
            <div className="self-stretch flex flex-col items-end justify-start gap-[30px] max-w-full">
                <div className="self-stretch shadow-[0px_4px_4px_rgba(0,_0,_0,_0.25)] border-[1px] border-solid border-gray-100  bg-component flex flex-row  items-start justify-evenly pt-[31px] pb-[33px] pr-[65px] pl-[52px] box-border max-w-full gap-[20px] rounded-3xl min-w-min h-[560px]  mq750:pl-[10px]  mq750:gap[3px] mq750:box-border mq750:px-9 mq750:ml-11 mq750:mt-10">
                    <form className="m-0 self-stretch h-[615.3px] flex flex-col items-start justify-start pt-0 px-0 gap-[9.5px] max-w-full  mq450:box-border ">
                        <div className="flex min-w-full gap-20 mq750:gap-[20px]">
                            <div className="left-div font-semibold text-[35px] ml-[50px] md:ml-6 mq750:text-[20px]">
                                All Trips
                            </div>
                            <div className="right-div gap-10">
                                <div className="flex flex-row gap-6">
                                <button
                                    className="border-[3px] border-solid border-[#5932EA] text-black text-[10px] md:text-[20px] px-2 py-1 ml-4 rounded-lg w-full md:w-[190px] h-[40px] mix-blend-normal  mq750:text-[15px] cursor-pointer"
                                    onClick={onAddTripClick}
                                >
                                    Add Trip
                                </button>
                                <button
                                    className="border-[3px] border-solid border-[#5932EA] text-black text-[10px] md:text-[20px] px-2 py-1 mr-4 rounded-lg w-full md:w-[190px] h-[40px] mix-blend-normal  mq750:text-[15px] cursor-pointer"
                                    onClick={onReviewTripClick}
                                >
                                    Review Trip
                                </button>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Table Container */}
                        <div className="container mx-auto px-4 py-4  mq750:px-2">
                            <div
                                className="overflow-auto"
                                style={{
                                    maxHeight: "400px",
                                    scrollbarWidth: "none", // Firefox
                                    msOverflowStyle: "none", // IE 10+
                                }}
                            >
                                {/* Hide scrollbar for Webkit browsers */}
                                <style>{`
                                    ::-webkit-scrollbar {
                                        display: none;
                                    }
                                `}</style>
                                <table className="min-w-full border-b-4 border-black">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 border-b text-[25px] font-normal mq750:text-[20px]  mq750:px-2">
                                                Driver
                                            </th>
                                            
                                            <th className="px-4 py-2 border-b text-[25px] font-normal mq1224:hidden">
                                                Start Date
                                            </th>
                                            <th className="px-4 py-2 border-b text-[25px] font-normal mq1224:hidden">
                                                Starting KM
                                            </th>
                                            <th className="px-4 py-2 border-b text-[25px] font-normal mq750:text-[20px]  mq750:px-2">
                                                Status
                                            </th>
                                            {trips.some((trip) => trip.status !== "completed") && (
                                                <th className="px-4 py-2 border-b text-[25px] font-normal mq750:text-[20px]  mq750:px-2">
                                                    Update
                                                </th>
                                            )}
                                            {trips.some((trip) => trip.status !== "completed") && (
                                                <th className="px-4 py-2 border-b text-[25px] font-normal mq750:text-[20px]  mq750:px-2">
                                                    End Trip
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trips.slice().reverse().map((trip) => (
                                            <tr key={trip._id}>
                                                <td className="px-4 py-2 border-b font-light text-[15px] mq750:text-[15px]  mq750:px-2 ">
                                                    {trip.driver.name}
                                                </td>
                                                
                                                <td className="px-4 py-2 border-b font-light text-[15px] mq1224:hidden ">
                                                    {new Date(trip.startDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-2 border-b font-light text-[15px] mq1224:hidden ">
                                                    {trip.startKm}
                                                </td>
                                                <td className="px-4 py-2 border-b">
                                                    <div
                                                        className={`px-2 py-1 border-[3px] border-solid rounded w-max font-light text-[15px] text-center mq750:text-[15px]  mq750:px-2 ${trip.status === "pending" ? "border-red-700" 
                                                            : trip.status === "completed" ? "border-green-700" 
                                                            : trip.status === "review" ? "border-gray-500" 
                                                            : "border-gray-300"} text-black`}
                                                    >
                                                        {trip.status}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-2 border-b font-light text-[15px] ">
                                                    {trip.status !== "completed" && trip.status !== "review" &&(
                                                        <button
                                                            className="bg-blue-700 text-black font-light text-[15px] px-4 py-2 rounded mq1224:hidden cursor-pointer"
                                                            onClick={() => onUpdateTripClick(trip._id)}
                                                        >
                                                            Update
                                                        </button>
                                                    )}
                                                </td>

                                                <td className="px-4 py-2 border-b">
                                                    {trip.status !== "completed" && trip.status !== "review" &&(
                                                        <button
                                                            className="bg-red-700 text-black font-light text-[15px] px-4 py-2 rounded mq750:text-[15px]  mq750:px-2 cursor-pointer"
                                                            onClick={() => onEndTripClick(trip._id)}
                                                        >
                                                            End Trip
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default TripsList;
