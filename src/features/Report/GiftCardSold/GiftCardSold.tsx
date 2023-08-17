import { useEffect, useState } from "react";
import { TIME_RANGE_OPTIONS } from "contants";
import { formatMoney } from "utils";
import { useDebounce } from "usehooks-ts";
import { DatePicker, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Table as AntTable } from "antd";
import type { Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import moment from "moment";
import ReportService from "services/ReportService";
import IGiftCardSold from "interfaces/IGiftCardSold";
import dayjs from "dayjs";
import Page from "components/Page";

const BREAD_CRUMBS = [
    {
        name: "Report",
        path: "",
    },
    {
        name: "Gift Card Sold",
        path: "/reports/gift-card-sold",
    },
];

const PAGE_SIZE_DEFAULT = 10;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface ISummary {
    amount: string;
    quantity: number;
}

const columns: ColumnsType<IGiftCardSold> = [
    {
        title: "Date/Time",
        dataIndex: "date",
        render: (text) => {
            return <p className="min-w-[170px]">{moment(text).format("MM/DD/YYYY hh:mm A")}</p>;
        },
    },
    {
        title: "Merchant Account",
        dataIndex: "merchant",
    },
    {
        title: "Quantity Sold",
        dataIndex: "quantity",
    },
    {
        title: "Total Amount",
        dataIndex: "amount",
        render: (text) => text && <p>{formatMoney(text)}</p>,
    },
];

const GiftCardSold = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const navigate = useNavigate();

    const [data, setData] = useState<IGiftCardSold[]>([]);
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

    const [summary, setSummary] = useState<ISummary | null>(null);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count, summary } = await ReportService.getGiftCardSold(
                    page,
                    page_size,
                    timeRange,
                    custom,
                    debouncedValue
                );
                setSummary(summary);
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
    }, [loading, page, page_size, debouncedValue, timeRange, custom]);

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
        if (!keyword) {
            setLoading(true);
        }
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
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
        <Page title="Gift Card Sold">
            <Breadcrumb title="Gift Card Sold" breadcrumbs={BREAD_CRUMBS} />
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
                    </div>
                    <div className="flex items-start flex-wrap flex-1 mb-5">
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
                        <Button title="Reset" btnType="ok" moreClass="max-h-10" onClick={handleResetStatus} />
                    </div>
                    <Table
                        //TODO: ADD ROW KEY
                        count={count}
                        data={data}
                        columns={columns}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onRowClick={(record) => {
                            navigate(`/reports/gift-card-sold/${record.merchantId}`, { state: { date: record.date } });
                        }}
                        renderSummary={(data) => {
                            return summary && data && data.length ? (
                                <AntTable.Summary.Row>
                                    <AntTable.Summary.Cell index={0} colSpan={2}>
                                        <p className="font-semibold">{count ? `Total Transaction: ${count}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">{summary ? `${summary.quantity}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">
                                            {summary ? `${formatMoney(summary.amount)}` : ""}
                                        </p>
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

export default GiftCardSold;
