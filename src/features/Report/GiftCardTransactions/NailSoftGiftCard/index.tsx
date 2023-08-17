import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { DatePicker, Select, Spin } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { TIME_RANGE_OPTIONS } from "contants";
import type { Dayjs } from "dayjs";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import ReportService from "services/ReportService";
import IGiftCardSoldDetail from "interfaces/IGiftCardSoldDetail";
import dayjs from "dayjs";
import ModalSuccess from "components/Modal/ModalSuccess";
import ISort from "interfaces/ISort";
import Columns from "./Columns";

const PAGE_SIZE_DEFAULT = 10;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const Transactions = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<IGiftCardSoldDetail[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingExport, setLoadingExport] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [timeRange, setTimeRange] = useState<string>("thisMonth");
    const [isExport, setIsExport] = useState<boolean>(false);
    const [linkExport, setLinkExport] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await ReportService.getGiftCardTransactions(
                    page,
                    page_size,
                    timeRange,
                    custom,
                    "consumer_card",
                    debouncedValue,
                    sort?.sortType,
                    sort?.sortValue
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
    }, [loading, page, page_size, debouncedValue, timeRange, custom, sort]);

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
        setKeyword("");
        setPage(1);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleExport = async () => {
        try {
            setLoadingExport(true);
            const link = await ReportService.exportGiftCardTransactions(
                page,
                page_size,
                timeRange,
                custom,
                "consumer_card",
                keyword
            );
            if (link) {
                setIsExport(true);
                setLinkExport(link);
            }
            setLoadingExport(false);
        } catch (error) {
            setLoadingExport(false);
        }
    };

    const onClose = () => {
        setIsExport(false);
    };

    const handleChangeTable = (sorter: SorterResult<IGiftCardSoldDetail> | SorterResult<IGiftCardSoldDetail>[]) => {
        const field = (sorter as SorterResult<IGiftCardSoldDetail>)?.field;
        const order = (sorter as SorterResult<IGiftCardSoldDetail>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
    };

    const handleChangeDate = (value: RangeValue) => {
        setLoading(true);
        setCustom(value);
    };

    const handleChangeTypeTimeRange = (value: string) => {
        setTimeRange(value);
        setPage(1);
        setLoading(true);
    };

    return (
        <div>
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading || loadingExport}>
                    <ModalSuccess isExport={isExport} linkExport={linkExport} onClose={onClose} />
                    <div className="flex mb-1 flex-wrap justify-between">
                        <div className="mr-5">
                            <SearchInput
                                value={keyword}
                                placeholder="Search..."
                                onChange={handleChangeKeyword}
                                onClear={handleClearKeyword}
                            />
                        </div>
                        <div className="flex items-start flex-wrap">
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
                                    <div className="flex items-center mb-1">
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
                            <Button title="Reset" btnType="ok" moreClass="mr-5 max-h-10" onClick={handleResetStatus} />
                            <Button title="Export" btnType="ok" moreClass="mr-5 max-h-10" onClick={handleExport} />
                        </div>
                    </div>
                    <Table
                        rowKey="dateTime"
                        count={count}
                        data={data}
                        columns={Columns()}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onChange={handleChangeTable}
                    />
                </Spin>
            </div>
        </div>
    );
};

export default Transactions;
