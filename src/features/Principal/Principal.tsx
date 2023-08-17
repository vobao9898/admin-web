import { SorterResult } from "antd/es/table/interface";
import { Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import Page from "components/Page";
import IPrincipal from "interfaces/IPrincipal";
import PrincipalService from "services/PrincipalService";
import StateService from "services/StateService";
import CreatePrincipal from "./Create";
import IState from "interfaces/IState";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Principal List",
        path: "/principal",
    },
];

const STATUS_OPTIONS = [
    { value: -1, label: "All" },
    { value: 0, label: "Active" },
    { value: 1, label: "Inactive" },
];

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

const PAGE_SIZE_DEFAULT = 10;

const Principal = () => {
    const navigate = useNavigate();

    const [principals, setPrincipals] = useState<IPrincipal[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [status, setStatus] = useState<number>(-1);
    const [open, setOpen] = useState<boolean>(false);
    const [state, setState] = useState<IState[]>([]);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const data = await StateService.get();
                setState(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchState();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await PrincipalService.get(
                    page,
                    page_size,
                    status,
                    debouncedValue,
                    sort?.sortValue,
                    sort?.sortType
                );
                setPrincipals(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading, page, status, page_size, sort?.sortType, sort?.sortValue, debouncedValue]);

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
        setPage(1);
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setPage(1);
    };

    const handleChangeTable = (sorter: SorterResult<IPrincipal> | SorterResult<IPrincipal>[]) => {
        const field = (sorter as SorterResult<IPrincipal>)?.field;
        const order = (sorter as SorterResult<IPrincipal>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
    };

    const handleChangeStatus = (status: number) => {
        setStatus(status);
        setLoading(true);
    };

    const toggleOpenModal = () => {
        setOpen((preVal) => !preVal);
    };

    const handleReset = () => {
        setPage(1);
        setPageSize(PAGE_SIZE_DEFAULT);
        setStatus(-1);
        setKeyword("");
        setSort(null);
        if (!keyword) {
            setLoading(true);
        }
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleSuccess = () => {
        setLoading(true);
        setOpen(false);
    };

    return (
        <Page title="Principal">
            <CreatePrincipal open={open} onClose={toggleOpenModal} state={state} onSuccess={handleSuccess} />
            <Breadcrumb title="Principal List" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex justify-between">
                        <SearchInput
                            value={keyword}
                            placeholder="Search..."
                            onChange={handleChangeKeyword}
                            onClear={handleClearKeyword}
                        />
                        <Button onClick={toggleOpenModal} title="Add Principal" btnType="ok" />
                    </div>
                    <div className="mt-2.5">
                        <div className="flex items-center mb-5">
                            <div className="flex items-center">
                                <h3 className="mr-2">Status: </h3>
                                <Select
                                    options={STATUS_OPTIONS}
                                    onChange={handleChangeStatus}
                                    value={status}
                                    size="large"
                                    style={{ width: "150px" }}
                                />
                            </div>
                            <Button onClick={handleReset} title="Reset" btnType="ok" moreClass="ml-5" />
                        </div>
                    </div>
                    <Table
                        rowKey="principalId"
                        data={principals}
                        columns={Columns()}
                        count={count}
                        page={page - 1}
                        rowPerPage={page_size}
                        loading={loading}
                        onPageChange={handlePageChange}
                        onChange={handleChangeTable}
                        onPerPageChange={handlePerPageChange}
                        onRowClick={(record) => {
                            navigate(`/principal/${record.principalId}`);
                        }}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default Principal;
