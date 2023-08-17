import { Table as AntTable, DatePicker, Radio, RadioChangeEvent, Select, Slider, Spin } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { TIME_RANGE_OPTIONS } from "contants";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import type { Dayjs } from "dayjs";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Message from "components/Message";
import Page from "components/Page";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import dayjs from "dayjs";
import ISort from "interfaces/ISort";
import ITransaction from "interfaces/ITransaction";
import ReportService from "services/ReportService";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Report",
        path: "",
    },
    {
        name: "Transactions",
        path: "/reports/transactions",
    },
];

const STATUS_OPTIONS = [
    { value: "-1", label: "All" },
    { value: "1", label: "Success" },
    { value: "2", label: "Failure" },
];

interface ISummary {
    createDate: string;
    amount: string;
}

const PAGE_SIZE_DEFAULT = 10;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const Transactions = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<ITransaction[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [status, setStatus] = useState<string>("-1");
    const [timeRange, setTimeRange] = useState<string>("thisMonth");

    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    const [amountRange, setAmountRange] = useState<[number, number]>([0, 2000]);
    const [sort, setSort] = useState<ISort | null>(null);
    const [summary, setSummary] = useState<ISummary | null>(null);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count, summary } = await ReportService.getTransaction(
                    page,
                    page_size,
                    timeRange,
                    custom,
                    status,
                    amountRange,
                    debouncedValue,
                    sort?.sortType,
                    sort?.sortValue
                );
                const summaryS = {
                    createDate: "Total Transaction: " + count,
                    amount: summary?.amount,
                };
                setSummary(summaryS);
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
    }, [
        loading,
        page,
        page_size,
        debouncedValue,
        timeRange,
        custom,
        status,
        amountRange,
        sort?.sortType,
        sort?.sortValue,
    ]);

    const onRefund = async (id: number) => {
        const data: any = await ReportService.transactionRefund(id);
        if (data.coderNumber === 200) {
            setLoading(true);
        } else {
            Message.error({ text: data.message });
            setLoading(false);
        }
    };

    const handleRefund = (id: number) => {
        setLoading(true);
        onRefund(id);
    };

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
        setStatus("-1");
        setAmountRange([0, 2000]);
        setKeyword("");
        setPage(1);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleChangeTable = (sorter: SorterResult<ITransaction> | SorterResult<ITransaction>[]) => {
        const field = (sorter as SorterResult<ITransaction>)?.field;
        const order = (sorter as SorterResult<ITransaction>)?.order;

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

    const handleSliderChange = (value: [number, number]) => {
        setAmountRange(value);
        setLoading(true);
    };

    const handleChangeStatus = (event: RadioChangeEvent) => {
        setLoading(true);
        setStatus(event.target.value);
    };

    const handleChangeTimeRange = (value: string) => {
        setLoading(true);
        setTimeRange(value);
    };

    return (
        <Page title="Transactions">
            <Breadcrumb title="Transactions" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex mb-2">
                        <div className="mr-5">
                            <SearchInput
                                value={keyword}
                                placeholder="Search..."
                                onChange={handleChangeKeyword}
                                onClear={handleClearKeyword}
                            />
                        </div>
                        <div className="flex items-center mr-5">
                            <p className="mr-2 text-black font-medium">Status</p>
                            <Radio.Group
                                size="large"
                                value={status}
                                buttonStyle="solid"
                                optionType="button"
                                options={STATUS_OPTIONS}
                                onChange={handleChangeStatus}
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
                                        onChange={handleChangeTimeRange}
                                        options={TIME_RANGE_OPTIONS}
                                        size="large"
                                        className="min-w-[130px]"
                                    />
                                </div>
                                {timeRange === "custom" && (
                                    <div className="mr-2 flex items-center mb-1">
                                        <p className="text-black font-medium mr-1">From To</p>
                                        <DatePicker.RangePicker
                                            allowClear={false}
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
                    <Table
                        rowKey="paymentTransactionId"
                        count={count}
                        data={data}
                        columns={Columns({ loading, handleRefund })}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onChange={handleChangeTable}
                        renderSummary={(data) => {
                            return data && data.length && summary ? (
                                <AntTable.Summary.Row>
                                    <AntTable.Summary.Cell index={0} colSpan={4}>
                                        <p className="font-semibold">{count ? `${summary.createDate}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">{summary ? `$${summary.amount}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                </AntTable.Summary.Row>
                            ) : null;
                        }}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default Transactions;
