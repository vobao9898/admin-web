import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { formatMoney } from "utils";
import { DatePicker, Select, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { SorterResult } from "antd/es/table/interface";
import { Table as AntTable } from "antd";
import { TIME_RANGE_OPTIONS } from "contants";
import type { Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import moment from "moment";
import ReportService from "services/ReportService";
import IMerchantBatchSettlement from "interfaces/IMerchantBatchSettlement";
import dayjs from "dayjs";
import ISort from "interfaces/ISort";
import Page from "components/Page";

interface ISummary {
    paymentByHarmony: string;
    paymentByCreditCard: string;
    paymentByCash: string;
    paymentByGiftcard: string;
    otherPayment: string;
    discount: string;
    total: string;
}

const BREAD_CRUMBS = [
    {
        name: "Report",
        path: "",
    },
    {
        name: "Batch",
        path: "/reports/merchant-batch-settlement",
    },
];

const PAGE_SIZE_DEFAULT = 10;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const columns: ColumnsType<IMerchantBatchSettlement> = [
    {
        title: "Date/Time",
        dataIndex: "settlementDate",
        sorter: true,
        render: (text) => {
            return <p>{moment(text).format("MM/DD/YYYY hh:mm A")}</p>;
        },
    },
    {
        title: "Merchant DBA",
        dataIndex: "doBusinessName",
        sorter: true,
        render: (text) => <p>{text}</p>,
    },
    {
        title: "Merchant ID",
        dataIndex: "merchantId",
        sorter: true,
        render: (text) => <p>{text}</p>,
    },
    {
        title: "Terminal",
        dataIndex: "serialNumber",
        sorter: true,
        render: (text) => text && <p>#{text}</p>,
    },
    {
        title: "NailSoftPay",
        width: 100,
        dataIndex: "paymentByHarmony",
        sorter: true,
        render: (text) => <p className="min-w-[80px]">{formatMoney(text)}</p>,
    },
    {
        title: "Credit Card",
        width: 100,
        dataIndex: "paymentByCreditCard",
        sorter: true,
        render: (text) => <p className="min-w-[100px]">{formatMoney(text)}</p>,
    },
    {
        title: "Cash",
        width: 100,
        dataIndex: "paymentByCash",
        sorter: true,
        render: (text) => <p className="min-w-[80px]">{formatMoney(text)}</p>,
    },
    {
        title: "Gift Card",
        width: 100,
        dataIndex: "paymentByGiftcard",
        sorter: true,
        render: (text) => <p className="min-w-[80px]">{formatMoney(text)}</p>,
    },
    {
        title: "Other",
        width: 100,
        dataIndex: "paymentByGiftcard",
        sorter: true,
        render: (text) => <p className="min-w-[80px]">{formatMoney(text)}</p>,
    },
    {
        title: "Discount",
        width: 100,
        dataIndex: "discount",
        sorter: true,
        render: (text) => <p className="min-w-[80px]">{formatMoney(text)}</p>,
    },
    {
        title: "Total",
        width: 100,
        dataIndex: "total",
        sorter: true,
        render: (text) => <p className="min-w-[80px]">{formatMoney(text)}</p>,
    },
];

const Transactions = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const navigate = useNavigate();

    const [dataPending, setDataPending] = useState<IMerchantBatchSettlement[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const debouncedValue = useDebounce<string>(keyword, 300);

    const [timeRange, setTimeRange] = useState<string>("thisMonth");

    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    const [sort, setSort] = useState<ISort | null>(null);
    const [summary, setSummary] = useState<ISummary | null>(null);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count, summary } = await ReportService.getMerchantBatchSettlements(
                    page,
                    page_size,
                    timeRange,
                    custom,
                    debouncedValue,
                    sort?.sortType,
                    sort?.sortValue
                );
                setSummary(summary);
                setDataPending(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) {
            fetchData();
        }
    }, [loading, page, page_size, debouncedValue, timeRange, custom, sort?.sortType, sort?.sortValue]);

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

    const handleChangeTable = (
        sorter: SorterResult<IMerchantBatchSettlement> | SorterResult<IMerchantBatchSettlement>[]
    ) => {
        const field = (sorter as SorterResult<IMerchantBatchSettlement>)?.field;
        const order = (sorter as SorterResult<IMerchantBatchSettlement>)?.order;

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
        setLoading(true);
    };

    return (
        <Page title="Merchant Batch Settlement">
            <Breadcrumb title="Merchant Batch Settlement" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex mb-2 justify-between">
                        <div className="mr-5">
                            <SearchInput
                                value={keyword}
                                placeholder="Search..."
                                onChange={handleChangeKeyword}
                                onClear={handleClearKeyword}
                            />
                        </div>
                        <Button
                            title="Close Settlement"
                            btnType="ok"
                            onClick={() => {
                                navigate("/reports/merchant-batch-settlement/close");
                            }}
                            moreClass="mr-5"
                        />
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
                                    <p className="text-black font-medium mr-2">From To</p>
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
                        </div>
                        <Button title="Reset" btnType="ok" moreClass="ml-5 max-h-10" onClick={handleResetStatus} />
                    </div>
                    <Table
                        rowKey="settlementId"
                        count={count}
                        data={dataPending}
                        columns={columns}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onRowClick={(record) => {
                            navigate(`/reports/merchant-batch-settlement/${record?.settlementId}/${record.merchantId}`);
                        }}
                        onChange={handleChangeTable}
                        renderSummary={(data) => {
                            return summary && data && data.length ? (
                                <AntTable.Summary.Row>
                                    <AntTable.Summary.Cell index={0} colSpan={4}>
                                        <p className="font-semibold">{count ? `Total Transaction: ${count}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">{summary ? `$${summary.paymentByHarmony}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">
                                            {summary ? `$${summary.paymentByCreditCard}` : ""}
                                        </p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">{summary ? `$${summary.paymentByCash}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">
                                            {summary ? `$${summary.paymentByGiftcard}` : ""}
                                        </p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">{summary ? `$${summary.otherPayment}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">{summary ? `$${summary.discount}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">{summary ? `$${summary.total}` : ""}</p>
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
