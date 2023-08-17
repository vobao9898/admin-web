import { DatePicker, Select, Slider, Spin } from "antd";
import { useEffect, useState } from "react";
import { TIME_RANGE_OPTIONS } from "contants";
import { useDebounce } from "usehooks-ts";
import type { Dayjs } from "dayjs";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Page from "components/Page";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import dayjs from "dayjs";
import IConsumerReloadGiftCard from "interfaces/IConsumerReloadGiftCard";
import ReportService from "services/ReportService";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Report",
        path: "",
    },
    {
        name: "Consumer Reload Gift Card",
        path: "/reports/consumer-reload-gift-card",
    },
];

const PAGE_SIZE_DEFAULT = 10;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const ConsumerReloadGiftCard = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<IConsumerReloadGiftCard[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [timeRange, setTimeRange] = useState<string>("thisMonth");
    const debouncedValue = useDebounce<string>(keyword, 300);

    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    const [amountRange, setAmountRange] = useState<[number, number]>([0, 2000]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await ReportService.getTransactionsGiftCard(
                    page,
                    page_size,
                    timeRange,
                    custom,
                    amountRange,
                    debouncedValue
                );
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) {
            fetchData();
        }
    }, [loading, page, page_size, debouncedValue, timeRange, custom, amountRange]);

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKeyword(value);
        setPage(1);
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setPage(1);
    };

    const handleResetStatus = () => {
        setTimeRange("thisMonth");
        setCustom([dayjs(new Date(year, month, 1)), dayjs(new Date(year, month + 1, 0))]);
        setAmountRange([0, 2000]);
        setKeyword("");
        setPage(1);
        if (!keyword) {
            setLoading(true);
        }
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleChangeDate = (value: RangeValue) => {
        setLoading(true);
        setCustom(value);
    };

    const handleChangeTypeTimeRange = (value: string) => {
        setTimeRange(value);
        setLoading(true);
    };

    const handleSliderChange = (value: [number, number]) => {
        setAmountRange(value);
        setLoading(true);
    };

    return (
        <Page title="Consumer Reload Gift Card">
            <Breadcrumb title="Consumer Reload Gift Card" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="mb-5">
                        <div className="flex">
                            <div className="mr-5">
                                <SearchInput
                                    value={keyword}
                                    placeholder="Search..."
                                    onChange={handleChangeKeyword}
                                    onClear={handleClearKeyword}
                                />
                            </div>
                        </div>
                        <div className="mt-2.5 flex justify-between">
                            <div className="flex items-start flex-wrap flex-1">
                                <div className="mr-5 flex">
                                    <div className="flex items-center mr-2 mb-1">
                                        <p className="mr-2 text-black font-medium">Time Range</p>
                                        <Select
                                            value={timeRange}
                                            options={TIME_RANGE_OPTIONS}
                                            onChange={handleChangeTypeTimeRange}
                                            size="large"
                                            className="min-w-[130px]"
                                        />
                                    </div>
                                    {timeRange === "custom" && (
                                        <div className="mr-2 flex items-center mb-1">
                                            <p className="text-black font-medium mr-1">From To</p>
                                            <DatePicker.RangePicker
                                                defaultValue={custom}
                                                onChange={handleChangeDate}
                                                size="large"
                                                className="w-[240px]"
                                                format="MM/DD/YYYY"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mr-5 mb-3 flex items-center">
                                    <p className="mr-2 text-black font-medium">Amount Range</p>
                                    <Slider
                                        className="w-[150px]"
                                        min={0}
                                        max={2000}
                                        range
                                        defaultValue={amountRange}
                                        onAfterChange={handleSliderChange}
                                    />
                                    <p className="ml-2">
                                        [{amountRange[0]} - {amountRange[1]}]
                                    </p>
                                </div>
                            </div>
                            <Button title="Reset" btnType="ok" moreClass="ml-5 max-h-10" onClick={handleResetStatus} />
                        </div>
                    </div>
                    <Table
                        rowKey="giftCardId"
                        count={count}
                        data={data}
                        columns={Columns()}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default ConsumerReloadGiftCard;
