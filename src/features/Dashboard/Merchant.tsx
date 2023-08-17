import React, { useState, useEffect } from "react";
import { Select, Spin, DatePicker } from "antd";
import { TIME_RANGE_OPTIONS } from "contants";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import Export from "assets/svg/export.svg";
import DashBoardService from "services/DashBoardService";
import IAppointmentDashboard from "interfaces/IAppointmentDashboard";
import classNames from "classnames";
import IValueDashboard from "interfaces/IValueDashboard";

export type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface IProps {
    setLoadingExport: (value: boolean) => void;
    setLinkExport: (value: string) => void;
    setIsExport: (value: boolean) => void;
}

const Merchant: React.FC<IProps> = ({ setLoadingExport, setIsExport, setLinkExport }) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<IAppointmentDashboard>();
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<string>("thisWeek");
    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await DashBoardService.getMerchants(timeRange, custom);
                const data: IValueDashboard[] = resp.data.map((item) => {
                    const currency = item?.value.toString();
                    const result = Number(currency.replace(/[^0-9.]+/g, ""));
                    return {
                        value: result,
                        values: result,
                        name: item?.label === "WebApp" ? "Website/App" : item?.label,
                        label: item.label,
                    };
                });
                const results = Number(resp?.total.replace(/[^0-9.]+/g, ""));
                setData({ total: results.toString(), data: data });
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
            const link = await DashBoardService.exportMerchants(timeRange, custom);
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
                            {data?.total ? formatTotal(data.total) : 0}
                        </div>
                        <div className="mt-1.75 text-davy-grey text-3.75 font-semibold mr-2">New Merchant</div>
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
                    <div className="w-1/2 flex items-center">
                        <div className="w-full">
                            {data?.data &&
                                data?.data?.length > 0 &&
                                data?.data?.map((item: IValueDashboard, index: number) => {
                                    return (
                                        <div key={index} className="flex justify-between">
                                            <div className="flex">
                                                <div
                                                    className={classNames("h-4 w-4 rounded mb-2", {
                                                        "bg-yellow-primary": item?.name === "Pending Request",
                                                        "bg-[#EB5757]": item?.name === "Rejected Request",
                                                        "bg-[#2F80ED]": item?.name === "Approved Request",
                                                    })}
                                                />
                                                <div className="ml-2 text-black-primary font-normal text-3.5">
                                                    {item?.name}
                                                </div>
                                            </div>
                                            <div className="text-black-primary font-semibold text-3.5">
                                                {item?.values}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <div className="w-1/2 flex justify-end">
                        <div className="relative h-[150px] w-[150px]">
                            <ReactECharts
                                style={{ height: "150px", width: "100%" }}
                                option={{
                                    tooltip: {
                                        trigger: "item",
                                    },
                                    series: [
                                        {
                                            name: "Access From",
                                            type: "pie",
                                            radius: ["40%", "70%"],
                                            avoidLabelOverlap: true,
                                            label: {
                                                show: false,
                                                position: "center",
                                            },
                                            emphasis: {
                                                label: {
                                                    show: true,
                                                    fontSize: 15,
                                                    fontWeight: "bold",
                                                },
                                            },
                                            labelLine: {
                                                show: true,
                                            },
                                            data: data?.data ? data.data : [],
                                        },
                                    ],
                                    color: ["#2F80ED", "#FBA705", "#EB5757"],
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default Merchant;
