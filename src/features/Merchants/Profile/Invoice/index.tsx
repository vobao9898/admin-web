import { DatePicker, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { TIME_RANGE_OPTIONS } from "contants";
import { formatMoney } from "utils";
import type { ColumnsType } from "antd/es/table";
import type { Dayjs } from "dayjs";
import Table from "components/Table";
import IInvoice from "interfaces/IInvoice";
import moment from "moment";
import MerchantService from "services/MerchantService";
import SearchInput from "components/SeachInput/SearchInput";
import dayjs from "dayjs";
import Button from "components/Button";
import Detail from "./Detail";

const PAGE_SIZE_DEFAULT = 10;

const PAYMENT_OPTIONS = [
    { value: "", label: "All" },
    { value: "nailsoft", label: "NailSoft" },
    { value: "credit_card", label: "Credit Card" },
    { value: "cash", label: "Cash" },
    { value: "other", label: "Other" },
    { value: "giftcard", label: "Gift Card" },
];

const TRANSACTION_STATUS_OPTIONS = [
    { value: "", label: "All" },
    { value: "complete", label: "Complete" },
    { value: "incomplete", label: "Incomplete" },
    { value: "paid", label: "Paid" },
    { value: "void", label: "Void" },
    { value: "refund", label: "Refund" },
    { value: "cancel", label: "Cancel" },
    { value: "transaction fail", label: "Transaction Fail" },
];

interface IProps {
    merchantId: number;
    toggleState: string;
}

const columns: ColumnsType<IInvoice> = [
    {
        title: "ID",
        dataIndex: "code",
        render: (text, _item) => `#${text}`,
    },
    {
        title: "Date",
        dataIndex: "createdDate",
        render: (text, _item) => moment(text).format("MM/DD/YYYY"),
    },
    {
        title: "Time",
        dataIndex: "time",
        render: (_text, item) => moment(item?.createdDate).format("hh:mm A"),
    },
    {
        title: "Customer",
        dataIndex: "customer",
        render: (_text, item) => `${item?.user?.firstName} ${item?.user?.lastName}`,
    },
    {
        title: "Status",
        dataIndex: "status",
    },
    {
        title: "Total",
        dataIndex: "total",
        render: (text, _item) => formatMoney(text),
    },
];

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const Invoice: React.FC<IProps> = ({ merchantId, toggleState }) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<IInvoice[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [timeRange, setTimeRange] = useState<string>("thisMonth");
    const [status, setStatus] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [isDetail, setIsDetail] = useState<boolean>(false);
    const [dataDetail, setDataDetail] = useState<IInvoice>();

    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        if (toggleState === "Invoice") {
            setIsDetail(false);
        }
    }, [toggleState]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data, count } = await MerchantService.getInvoiceById(
                    merchantId,
                    page,
                    page_size,
                    timeRange,
                    custom,
                    status,
                    paymentMethod,
                    debouncedValue
                );
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading && merchantId) fetchData(merchantId);
    }, [loading, page, page_size, merchantId, debouncedValue, timeRange, custom, status, paymentMethod]);

    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKeyword(value);
        setPage(1);
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setPage(1);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleResetStatus = () => {
        setTimeRange("thisMonth");
        setCustom([dayjs(new Date(year, month, 1)), dayjs(new Date(year, month + 1, 0))]);
        setKeyword("");
        setPage(1);
    };

    const handleChangeStatus = (status: string) => {
        setStatus(status);
        setPage(1);
        setLoading(true);
    };

    const handleChangePayment = (status: string) => {
        setPaymentMethod(status);
        setPage(1);
        setLoading(true);
    };

    const handleDetail = async (item: IInvoice) => {
        try {
            const data = await MerchantService.getCheckoutById(item.checkoutId, merchantId);
            setDataDetail(data);
            setIsDetail(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRefundInvoice = async (record: IInvoice) => {
        try {
            await MerchantService.putRefundInvoice(record?.checkoutId);
            handleDetail(record);
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeTimeRange = (value: string) => {
        setTimeRange(value);
        setLoading(true);
    };

    const handleChangeDate = (value: RangeValue) => {
        setLoading(true);
        setCustom(value);
    };

    const handleBack = () => {
        setLoading(true);
        setIsDetail(false);
    };

    return (
        <div>
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    {!isDetail && (
                        <>
                            <div className="flex mb-2 flex-wrap justify-between">
                                <div className="mr-5 mb-2">
                                    <SearchInput
                                        value={keyword}
                                        placeholder="Search..."
                                        onChange={handleChangeKeyword}
                                        onClear={handleClearKeyword}
                                    />
                                </div>
                                <div className="flex flex-wrap">
                                    <div className="mr-5 flex mb-2">
                                        <div className="flex items-center mr-2 mb-1">
                                            <p className="mr-2 text-black font-medium">Time Range</p>
                                            <Select
                                                value={timeRange}
                                                options={TIME_RANGE_OPTIONS}
                                                onChange={handleChangeTimeRange}
                                                size="large"
                                                className="min-w-[130px]"
                                            />
                                        </div>
                                        {timeRange === "custom" && (
                                            <div className="mr-2 flex items-center mb-2">
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
                                    <div className="flex items-center mr-5 mb-2">
                                        <p className="mr-2 text-black font-medium">Status</p>
                                        <Select
                                            options={TRANSACTION_STATUS_OPTIONS}
                                            value={status}
                                            onChange={handleChangeStatus}
                                            className="min-w-[130px]"
                                            size="large"
                                        />
                                    </div>
                                    <div className="flex items-center mr-5 mb-2">
                                        <p className="mr-2 text-black font-medium">Payment method</p>
                                        <Select
                                            options={PAYMENT_OPTIONS}
                                            value={paymentMethod}
                                            onChange={handleChangePayment}
                                            className="min-w-[130px]"
                                            size="large"
                                        />
                                    </div>
                                    <Button
                                        title="Reset"
                                        btnType="ok"
                                        moreClass="max-h-10"
                                        onClick={handleResetStatus}
                                    />
                                </div>
                            </div>
                            <Table
                                rowKey="checkoutId"
                                data={data}
                                columns={columns}
                                count={count}
                                loading={loading}
                                page={page - 1}
                                rowPerPage={page_size}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                                onRowClick={(record) => {
                                    handleDetail(record);
                                }}
                            />
                        </>
                    )}
                    {isDetail && dataDetail && (
                        <Detail dataDetail={dataDetail} onRefundInvoice={handleRefundInvoice} onBack={handleBack} />
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default Invoice;
