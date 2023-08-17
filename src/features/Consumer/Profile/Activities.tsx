import { DatePicker, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import type { Dayjs } from "dayjs";
import type { ColumnsType } from "antd/es/table";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import dayjs from "dayjs";
import IConsumer from "interfaces/IConsumer";
import IUserActivity from "interfaces/IUserActivity";
import moment from "moment";
import ReportService from "services/ReportService";

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    consumer?: IConsumer;
}

const columns: ColumnsType<IUserActivity> = [
    {
        title: "Date/time",
        dataIndex: "createDate",
        render: (text) => {
            text = text + "Z";
            return moment(text).format("MM/DD/YYYY hh:mm A");
        },
    },
    {
        title: "Activity",
        dataIndex: "action",
    },
];

const Activities: React.FC<IProps> = ({ consumer }) => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<IUserActivity[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const debouncedValue = useDebounce<string>(keyword, 300);

    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async (consumer: IConsumer) => {
            try {
                const { data, count } = await ReportService.getUserActivity(
                    page,
                    page_size,
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
    }, [loading, page, page_size, debouncedValue, custom, consumer]);

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

    return (
        <div>
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="font-bold text-lg mb-4 text-blue-500">Activities Management</div>
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
                            </div>
                            <Button title="Reset" btnType="ok" moreClass="max-h-10" onClick={handleResetStatus} />
                        </div>
                    </div>
                    <Table
                        rowKey="userActivityId"
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

export default Activities;
