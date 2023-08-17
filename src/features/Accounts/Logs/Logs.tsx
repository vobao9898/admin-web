import { DatePicker, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import type { Dayjs } from "dayjs";
import Page from "components/Page";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Table from "components/Table";
import dayjs from "dayjs";
import ILogs from "interfaces/ILogs";
import UserService from "services/UserService";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Logs",
        path: "/accounts/logs",
    },
];

const PAGE_SIZE_DEFAULT = 10;

type RangeValue = [Dayjs | null, Dayjs | null] | null;

const ApprovedRequest = () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [data, setData] = useState<ILogs[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<number>(0);
    const [users, setUsers] = useState([{ value: 0, label: "All" }]);
    const [custom, setCustom] = useState<RangeValue>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await UserService.get(0, 0);
                if (data && data.length) {
                    const newUsers = [{ value: 0, label: "All" }];
                    for (const item of data) {
                        newUsers.push({ value: item?.waUserId, label: `${item?.firstName} ${item?.lastName}` });
                    }
                    setUsers(newUsers);
                }
            } catch (error) {}
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const { data, count } = await UserService.getMerchantLog(page, page_size, status, custom);
                setData(data || []);
                setCount(count);
                setLoading(false);
            } catch (error: any) {
                //TODO: Check codeNumber
                if (error?.codeNumber === 400) {
                    setData([]);
                    setCount(0);
                    setLoading(false);
                }
                setLoading(false);
            }
        };
        if (loading) {
            fetchLogs();
        }
    }, [loading, page, page_size, status, custom]);

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const changeStatus = async (value: number) => {
        setStatus(value);
        setLoading(true);
        setPage(1);
    };

    const handleReset = () => {
        setCustom([dayjs(new Date(year, month, 1)), dayjs(new Date(year, month + 1, 0))]);
        setStatus(0);
        setPage(1);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    return (
        <Page title="Logs">
            <div>
                <Breadcrumb title="Logs" breadcrumbs={BREAD_CRUMBS} />
                <div className="p-4 bg-gray-50 shadow rounded-xl">
                    <Spin spinning={loading}>
                        <div className="mt-2.5">
                            <div className="flex items-center mb-5 flex-wrap">
                                <div className="flex items-center mb-1 mr-5 gap-x-4">
                                    <p className="text-black font-medium mr-1">Time range</p>
                                    <DatePicker.RangePicker
                                        defaultValue={custom}
                                        onChange={(val) => {
                                            setCustom(val);
                                            setLoading(true);
                                        }}
                                        size="large"
                                        className="w-[240px]"
                                        format="MM/DD/YYYY"
                                    />
                                </div>
                                <div className="flex items-center">
                                    <h3 className="mr-2">User </h3>
                                    <Select
                                        size="large"
                                        showSearch
                                        optionFilterProp="label"
                                        filterOption={(input, option) =>
                                            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
                                        }
                                        style={{ width: "150px" }}
                                        value={status}
                                        options={users}
                                        onChange={(value) => changeStatus(value)}
                                    />
                                </div>
                                <Button title="Reset" btnType="ok" moreClass="ml-5" onClick={handleReset} />
                            </div>
                        </div>
                        <Table
                            rowKey="approvalLogId"
                            count={count}
                            data={data}
                            columns={Columns()}
                            page={page - 1}
                            rowPerPage={page_size}
                            loading={loading}
                            onPageChange={handlePageChange}
                            onPerPageChange={handlePerPageChange}
                        />
                    </Spin>
                </div>
            </div>
        </Page>
    );
};

export default ApprovedRequest;
