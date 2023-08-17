import { DatePicker, Select, Spin } from "antd";
import Export from "assets/svg/export.svg";
import { TIME_RANGE_OPTIONS } from "contants";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import IConsumerDashBoard from "interfaces/IConsumerDashBoard";
import React, { useEffect, useState } from "react";
import DashBoardService from "services/DashBoardService";

export type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface IProps {
    setLoadingExport: (value: boolean) => void;
    setLinkExport: (value: string) => void;
    setIsExport: (value: boolean) => void;
}

const Consumer: React.FC<IProps> = ({ setLoadingExport, setIsExport, setLinkExport }) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<IConsumerDashBoard>();
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<string>("today");
    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await DashBoardService.getConsumers(timeRange, custom);
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
            const link = await DashBoardService.exportConsumers(timeRange, custom);
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
                            {data?.totalConsumer ? formatTotal(data?.totalConsumer?.toString()) : 0}
                        </div>
                        <div className="mt-1.75 text-davy-grey text-3.75 font-semibold mr-2">Consumer Total</div>
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
                                <div className="text-8 text-white font-semibold leading-9.75 w-full text-center">
                                    {data?.totalLogin ? data?.totalLogin : 0}
                                </div>
                                <div className="text-3.5 text-white font-semibold leading-4.25 w-full text-center">
                                    Login Total
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-1/2 flex items-center ml-2.5">
                        <div className="h-[132px] mt-[25px] flex justify-center items-center bg-green-primary rounded-[17px] w-full">
                            <div>
                                <div className="text-8 text-white font-semibold leading-9.75 w-full text-center">
                                    ${data?.totalAmount ? data?.totalAmount : 0}
                                </div>
                                <div className="text-3.5 text-white font-semibold leading-4.25 w-full text-center">
                                    Amount Total
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default Consumer;
