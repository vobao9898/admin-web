import { DatePicker, Select, Spin } from "antd";
import Export from "assets/svg/export.svg";
import { TIME_RANGE_OPTIONS } from "contants";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import IGiftCardDashBoard from "interfaces/IGiftCardDashBoard";
import React, { useEffect, useState } from "react";
import DashBoardService from "services/DashBoardService";

export type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface IProps {
    setLoadingExport: (value: boolean) => void;
    setLinkExport: (value: string) => void;
    setIsExport: (value: boolean) => void;
}

const GiftCard: React.FC<IProps> = ({ setLoadingExport, setLinkExport, setIsExport }) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<IGiftCardDashBoard>();
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<string>("today");
    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await DashBoardService.getGifCard(timeRange, custom);
                setData(resp);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) {
            fetchData();
        }
    }, [loading, timeRange, custom]);

    const handleExport = async () => {
        try {
            setLoadingExport(true);
            const link = await DashBoardService.exportGifCard(timeRange, custom);
            setLinkExport(link);
            setIsExport(true);
            setLoadingExport(false);
        } catch (error) {
            setLoadingExport(false);
        }
    };

    const handleChangeTypeTimeRange = (value: string) => {
        setTimeRange(value);
        setLoading(true);
    };

    const handleChangeDate = (value: RangeValue) => {
        setLoading(true);
        setCustom(value);
    };

    const formatTotal = (val: string) => {
        return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
        <div className="bg-white p-6 rounded-[14px] min-h-[250px]">
            <Spin spinning={loading}>
                <div className="flex justify-between flex-wrap items-start">
                    <div>
                        <div className="text-black-primary text-9 font-semibold mr-2 leading-9">
                            {data?.total ? formatTotal(data?.total?.toString()) : 0}
                        </div>
                        <div className="mt-1.75 text-davy-grey text-3.75 font-semibold mr-2">Gift Card Total</div>
                    </div>
                    <div className="flex items-center justify-end flex-1 flex-wrap gap-x-2 gap-y-2">
                        <div className="flex items-center">
                            <Select
                                value={timeRange}
                                options={TIME_RANGE_OPTIONS}
                                onChange={handleChangeTypeTimeRange}
                                size="large"
                                className="min-w-[130px]"
                            />
                        </div>
                        {timeRange === "custom" && (
                            <div className="flex items-center gap-x-2">
                                <p className="text-black font-medium">From To</p>
                                <DatePicker.RangePicker
                                    defaultValue={custom}
                                    allowClear={false}
                                    onChange={handleChangeDate}
                                    size="large"
                                    className="w-[240px]"
                                    format="MM/DD/YYYY"
                                />
                            </div>
                        )}
                        <button
                            onClick={handleExport}
                            className="border border-blue-three rounded-md px-4 py-2.5 h-10 box-border"
                        >
                            <div className="flex items-center">
                                <img src={Export} alt="" />
                                <div className="ml-0.75 leading-4.25 text-3.5 text-blue-three font-semibold">
                                    Export
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-1/2 flex items-center mr-2.5">
                        <div className="h-[132px] mt-[25px] flex justify-center items-center bg-[#2F80ED] rounded-[17px] w-full">
                            <div>
                                <div className="text-[36px] text-white font-semibold leading-9.75 w-full text-center">
                                    {data?.totalSold ? data?.totalSold : 0}
                                </div>
                                <div className="text-3.5 text-white font-semibold leading-4.25 w-full text-center">
                                    Total Sold
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 flex items-center ml-2.5">
                        <div className="h-[132px] mt-[25px] flex justify-center items-center bg-yellow-primary rounded-[17px] w-full">
                            <div>
                                <div className="text-[36px] text-white font-semibold leading-9.75 w-full text-center">
                                    {data?.totalUsage ? data?.totalUsage : 0}
                                </div>
                                <div className="text-3.5 text-white font-semibold leading-4.25 w-full text-center">
                                    Total Usage
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex">
                    <div className="w-1/2 flex items-center mr-2.5">
                        <div className="h-[132px] mt-[25px] flex justify-center items-center bg-[#2F80ED] rounded-[17px] w-full">
                            <div>
                                <div className="text-[36px] text-white font-semibold leading-9.75 w-full text-center">
                                    ${data?.amountSold ? data?.amountSold : 0}
                                </div>
                                <div className="text-3.5 text-white font-semibold leading-4.25 w-full text-center">
                                    Amount Sold
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 flex items-center ml-2.5">
                        <div className="h-[132px] mt-[25px] flex justify-center items-center bg-yellow-primary rounded-[17px] w-full">
                            <div>
                                <div className="text-[36px] text-white font-semibold leading-9.75 w-full text-center">
                                    ${data?.amountUsage ? data?.amountUsage : 0}
                                </div>
                                <div className="text-3.5 text-white font-semibold leading-4.25 w-full text-center">
                                    Amount Usage
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default GiftCard;
