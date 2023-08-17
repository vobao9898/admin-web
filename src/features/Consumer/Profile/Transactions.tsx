import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { DatePicker, Select, Spin } from "antd";
import { TIME_RANGE_OPTIONS } from "contants";
import type { Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import moment from "moment";
import ReportService from "services/ReportService";
import dayjs from "dayjs";
import ITransaction from "interfaces/ITransaction";
import IConsumer from "interfaces/IConsumer";

const PAGE_SIZE_DEFAULT = 10;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

interface IProps {
    consumer?: IConsumer;
}

const columns: ColumnsType<ITransaction> = [
    {
        title: "Date/time",
        dataIndex: "createDate",
        render: (text) => {
            text = text + "Z";
            return moment(text).format("MM/DD/YYYY hh:mm A");
        },
    },
    {
        title: "Transaction Id",
        dataIndex: "paymentTransactionId",
    },
    {
        title: "Activity",
        dataIndex: "activity",
    },
    {
        title: "Payment Method",
        dataIndex: "PaymentMethod",
        render: (_text, item) => <p className="capitalize">{item?.paymentData?.method}</p>,
    },
    {
        title: "Card Type",
        dataIndex: "cardType",
        render: (_text, item) => <p className="capitalize">{item?.paymentData?.card_type}</p>,
    },
    {
        title: "Amount",
        dataIndex: "amount",
    },
    {
        title: "Ip",
        dataIndex: "ip",
    },
    {
        title: "Validation State",
        dataIndex: "validationState",
        render: (_text, item) => <p className="capitalize">{item?.paymentData?.validation_status}</p>,
    },
    {
        title: "Transaction State",
        dataIndex: "transactionState",
        render: (_text, item) => <p className="capitalize">{item?.paymentData?.transaction_status}</p>,
    },
];

const Transactions: React.FC<IProps> = ({ consumer }) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<ITransaction[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [timeRange, setTimeRange] = useState<string>("thisMonth");
    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async (consumer: IConsumer) => {
            try {
                const { data, count } = await ReportService.getTransactionByUser(
                    page,
                    page_size,
                    timeRange,
                    custom,
                    consumer?.userId,
                    debouncedValue
                );
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading && consumer) {
            fetchData(consumer);
        }
    }, [loading, page, page_size, debouncedValue, timeRange, custom, consumer]);

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

    const handleChangeDate = (value: RangeValue) => {
        setPage(1);
        setCustom(value);
        setLoading(true);
    };

    const handleChangeTimeRange = (value: string) => {
        setLoading(true);
        setTimeRange(value);
    };

    return (
        <div>
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="font-bold text-lg mb-4 text-blue-500">Transactions Management</div>
                    <div className="flex mb-2 flex-wrap justify-between">
                        <div className="mr-5 mb-1">
                            <SearchInput
                                value={keyword}
                                placeholder="Search..."
                                onChange={handleChangeKeyword}
                                onClear={handleClearKeyword}
                            />
                        </div>
                        <div className="flex">
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
                                    <div className="flex items-center mb-1">
                                        <p className="text-black font-medium mr-2">From To</p>
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
                    </div>
                    <Table
                        rowKey="paymentTransactionId"
                        count={count}
                        data={data}
                        columns={columns}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                    />
                </Spin>
            </div>
        </div>
    );
};

export default Transactions;
