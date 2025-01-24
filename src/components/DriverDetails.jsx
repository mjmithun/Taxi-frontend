import React, { useEffect, useState } from 'react';
import { useParams ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../Config';
import Button from './Button';

const DriverDetails = () => {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                const response = await axios.get(
                    `${BASE_URL}/api/drivers/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in headers
                        }
                    }
                );
                setDriver(response.data);
            } catch (error) {
                console.error('Error fetching driver details:', error);
            }
        };


        fetchDriverDetails();
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    if (!driver) {
        return (<div className="h-screen w-full  border-[1px] border-solid border-gray-100  bg-component overflow-hidden flex flex-row items-center justify-center pt-[187px] px-5 pb-[186px] box-border leading-[normal] tracking-[normal] text-left text-[36px] text-black font-dm-sans">
            <div className="w-[500px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25)] border-[1px] border-solid border-gray-100  bg-component flex flex-col items-start justify-start pt-[21px] px-10 pb-28 box-border gap-[70px] max-w-full mq675:gap-[35px] mq675:pt-5 mq675:pb-[73px] mq675:box-border">
                <div className="flex flex-col items-start justify-start gap-[8px]">
                    <div className='flex flex-row gap-[80px]'>
                    <a className="[text-decoration:none] relative tracking-[-0.02em] leading-[56px] font-bold text-[inherit] inline-block min-w-[111px] z-[1]">
                        Driver Details
                    </a>
                    <Button handleClick={handleBack} />
                    </div>
                    <div className="flex flex-row items-start justify-start py-0 pr-0 pl-px text-[16px] text-black">
                        <div className="relative tracking-[-0.02em] leading-[100%] z-[1]">
                            Error Fetching information about the driver.
                        </div>
                    </div>
                </div>
            </div>
        </div>);

    }

    return (
        <div className="h-screen w-full border-[1px] border-solid border-gray-100  bg-component overflow-hidden flex flex-row items-center justify-center pt-[187px] px-5 pb-[186px] box-border leading-[normal] tracking-[normal] text-left text-[36px] text-black font-dm-sans">
            <div className="w-[500px] shadow-[4px_4px_4px_rgba(0,_0,_0,_0.25)]  border-[1px] border-solid border-gray-100  bg-component flex flex-col items-start justify-start pt-[21px] px-10 box-border gap-[70px] max-w-full mq675:gap-[35px] mq675:pt-5 mq675:pb-[73px] mq675:box-border">
                <div className="flex flex-col items-start justify-start gap-
                [4px]">
                    <div className='flex flex-row gap-[80px]'>
                    <a className="[text-decoration:none] relative tracking-[-0.02em] leading-[56px] font-bold text-[inherit] inline-block min-w-[111px] z-[1]">
                        Driver Details
                    </a>
                    <Button handleClick={handleBack} />
                    </div>
                    <div className="flex flex-row items-start justify-start py-0 pr-0 pl-px text-[16px] text-black">
                        <div className="relative tracking-[-0.02em] leading-[100%] z-[1]">
                            Displaying detailed information about the driver.
                        </div>
                    </div>
                </div>

                <div className="m-0 w-[410px] flex flex-col items-start justify-start max-w-full">
                    {/* Driver Details */}
                    <div className="self-stretch flex flex-col items-start justify-start max-w-full">
                        {/* Name */}
                        <div className="flex w-full items-center justify-start gap-4">
                            <div className="relative text-md tracking-[-0.02em] leading-[100%] font-medium font-dm-sans text-left z-[1]">
                                <span className="text-black">Name:</span>
                            </div>
                            <p className="font-dm-sans text-md text-black">
                                {driver.name}
                            </p>
                        </div>

                        {/* numberOfTrips */}
                        <div className="flex w-full items-center justify-start gap-4">
                            <div className="relative text-md tracking-[-0.02em] leading-[100%] font-medium font-dm-sans text-left z-[1]">
                                <span className="text-black">Number Of Trips:</span>
                            </div>
                            <p className="font-dm-sans text-md text-black">
                                {driver.numberOfTrips}
                            </p>
                        </div>

                        {/* Email */}
                        <div className="flex w-full items-center justify-start gap-4">
                            <div className="relative text-md tracking-[-0.02em] leading-[100%] font-medium font-dm-sans text-left z-[1]">
                                <span className="text-black">Email:</span>
                            </div>
                            <p className="font-dm-sans text-md text-black">
                                {driver.email}
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div className="flex w-full items-center justify-start gap-4">
                            <div className="relative text-md tracking-[-0.02em] leading-[100%] font-medium font-dm-sans text-left z-[1]">
                                <span className="text-black">Phone Number:</span>
                            </div>
                            <p className="font-dm-sans text-md text-black">
                                {driver.contactNumber}
                            </p>
                        </div>

                        {/* License Number */}
                        <div className="flex w-full items-center justify-start gap-4">
                            <div className="relative text-md tracking-[-0.02em] leading-[100%] font-medium font-dm-sans text-left z-[1]">
                                <span className="text-black">License Number:</span>
                            </div>
                            <p className="font-dm-sans text-md text-black">
                                {driver.licenseNumber}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="flex w-full items-center justify-start gap-4">
                            <div className="relative text-md tracking-[-0.02em] leading-[100%] font-medium font-dm-sans text-left z-[1]">
                                <span className="text-black">Status:</span>
                            </div>
                            <p className="font-dm-sans text-md text-black">
                                {driver.status}
                            </p>
                        </div>

                        {/* Address */}
                        <div className="flex w-full items-center justify-start gap-4">
                            <div className="relative text-md tracking-[-0.02em] leading-[100%] font-medium font-dm-sans text-left z-[1]">
                                <span className="text-black">Address:</span>
                            </div>
                            <p className="font-dm-sans text-md text-black flex-wrap">
                                {driver.address}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetails;
