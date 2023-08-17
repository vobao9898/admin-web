import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { Radio, Spin, RadioChangeEvent } from "antd";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import UserService from "services/UserService";
import IUser from "interfaces/IUser";
import Page from "components/Page";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Accounts",
        path: "",
    },
    {
        name: "Admin",
        path: "/accounts/account-users",
    },
];

const STATUS_OPTIONS = [
    { value: "-1", label: "All" },
    { value: "0", label: "Active" },
    { value: "1", label: "Inactive" },
];

const PAGE_SIZE_DEFAULT = 10;

const Users = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<IUser[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const debouncedValue = useDebounce<string>(keyword, 300);
    const [status, setStatus] = useState<string>("-1");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await UserService.get(page, page_size, status, debouncedValue);
                setUsers(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading, page, page_size, status, debouncedValue]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKeyword(value);
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setPage(1);
    };

    const handleNavigateToNewUser = () => {
        navigate("/accounts/account-users/new");
    };

    const handleReset = () => {
        setStatus("-1");
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

    const handleChangeStatus = (event: RadioChangeEvent) => {
        const { value } = event.target;
        setStatus(value);
        setLoading(true);
    };

    return (
        <Page title="Users">
            <Breadcrumb title="Users" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="mb-2.5 flex justify-between">
                        <SearchInput
                            value={keyword}
                            placeholder="Search..."
                            onChange={handleChangeKeyword}
                            onClear={handleClearKeyword}
                        />
                        <div className="flex items-center mr-5">
                            <p className="mr-2 text-black font-medium">Status</p>
                            <Radio.Group
                                size="middle"
                                value={status}
                                buttonStyle="solid"
                                options={STATUS_OPTIONS}
                                optionType="button"
                                onChange={handleChangeStatus}
                            />
                            <Button title="Reset" btnType="ok" moreClass="ml-5 max-h-10" onClick={handleReset} />
                        </div>
                        <Button title="New User" btnType="ok" onClick={handleNavigateToNewUser} />
                    </div>
                    <Table
                        rowKey="waUserId"
                        data={users}
                        columns={Columns()}
                        count={count}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onRowClick={(record) => {
                            navigate(`/accounts/account-users/${record?.waUserId}`);
                        }}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default Users;
