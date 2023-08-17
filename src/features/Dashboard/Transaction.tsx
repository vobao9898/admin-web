import React, { useEffect, useState } from "react";
import { DatePicker, Select, Spin } from "antd";
import { TIME_RANGE_OPTIONS } from "contants";
import type { Dayjs } from "dayjs";
import Export from "assets/svg/export.svg";
import dayjs from "dayjs";
import ReactECharts from "echarts-for-react";
import DashBoardService from "services/DashBoardService";

export type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface Map {
    [key: string]: {
        name: string;
        color: string;
    };
}

const CHART_CONFIG: Map = {
    harmony: {
        name: "NailSoft GC",
        color: "#27AE60",
    },
    cash: {
        name: "Cash",
        color: "#4285F4",
    },
    credit_card: {
        name: "Credit Card",
        color: "#9B51E0",
    },
    other: {
        name: "Other",
        color: "#FBA705",
    },
};

const formatValue = (value: string[]) => {
    if (value.length > 0) {
        return value.map((item) => {
            return item.replaceAll(",", "");
        });
    }
    return [];
};

interface IProps {
    setLoadingExport: (value: boolean) => void;
    setLinkExport: (value: string) => void;
    setIsExport: (value: boolean) => void;
}

const Transaction: React.FC<IProps> = ({ setLoadingExport, setLinkExport, setIsExport }) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<any>();
    const [label, setLabel] = useState<string[]>([]);
    const [total, setTotal] = useState<string>("0");
    const [loading, setLoading] = useState<boolean>(true);
    const [timeRange, setTimeRange] = useState<string>("thisWeek");
    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, label, total } = await DashBoardService.getTransactions(timeRange, custom);
                const temps = data.map((item) => {
                    return {
                        name: CHART_CONFIG[item.name]?.name,
                        type: "bar",
                        barWidth: "7px",
                        itemStyle: {
                            color: CHART_CONFIG[item.name]?.color,
                            borderRadius: 4,
                        },
                        data: formatValue(item?.values),
                    };
                });
                setData(temps);
                setLabel(label);
                setTotal(total);
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
            const link = await DashBoardService.exportTransactions(timeRange, custom);
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

    return (
        <div className="bg-white p-6 rounded-[14px] min-h-[250px]">
            <Spin spinning={loading}>
                <div className="flex justify-between flex-wrap items-start">
                    <div>
                        <div className="text-black-primary text-9 font-semibold mr-2 leading-9">${total}</div>
                        <div className="mt-1.75 text-davy-grey text-3.75 font-semibold mr-2">Payment Transaction</div>
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
                <div className="relative w-full">
                    <ReactECharts
                        style={{ height: "350px", width: "100%" }}
                        option={{
                            tooltip: {
                                trigger: "axis",
                            },
                            grid: {
                                top: "40px",
                                left: "40px",
                                bottom: "30px",
                                right: "40px",
                            },
                            legend: {
                                show: true,
                            },
                            xAxis: {
                                type: "category",
                                boundaryGap: false,
                                axisLabel: {
                                    show: true,
                                },
                                axisLine: {
                                    show: true,
                                    lineStyle: {
                                        color: "#000000",
                                    },
                                },
                                splitLine: {
                                    show: false,
                                },
                                axisTick: {
                                    show: true,
                                    lineStyle: {
                                        color: "#000000",
                                    },
                                },
                                data: label,
                            },
                            yAxis: {
                                show: false,
                                type: "value",
                            },
                            series: data,
                        }}
                    />
                </div>
            </Spin>
        </div>
    );
};

export default Transaction;
