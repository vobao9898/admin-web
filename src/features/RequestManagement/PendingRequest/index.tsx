import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { getCodeAndPhoneNumber, maskPhone } from "utils";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import moment from "moment";
import Page from "components/Page";
import RequestManagementService from "services/RequestManagementService";
import IPendingRequest from "interfaces/IPendingRequest";

const BREAD_CRUMBS = [
    {
        name: "Pending Request",
        path: "/request/pending-request",
    },
];

const columns: ColumnsType<IPendingRequest> = [
    {
        title: "ID",
        dataIndex: "merchantId",
    },
    {
        title: "Submitted Date",
        dataIndex: "createdDate",
        render: (text) => moment(text).format("L"),
    },
    {
        title: "DBA",
        dataIndex: "businessName",
    },
    {
        title: "Owner",
        dataIndex: "owner",
        render(_value, record, _index) {
            return record?.principals?.length === 0
                ? ""
                : `${record?.principals[0]?.firstName} ${record?.principals[0]?.lastName}`;
        },
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Store Phone",
        dataIndex: "phoneBusiness",
        render(_value, record, _index) {
            const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(record.general?.phoneBusiness);
            return <span>{maskPhone(codeMobilePhone, mobilePhoneNumber)}</span>;
        },
    },
    {
        title: "Contact Phone",
        dataIndex: "phoneContact",
        render(_value, record, _index) {
            const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(record.general?.phoneContact);
            return <span>{maskPhone(codeMobilePhone, mobilePhoneNumber)}</span>;
        },
    },
    {
        title: "Status",
        dataIndex: "status",
        render(_value, record, _index) {
            return <p className="capitalize">{record?.status === 0 ? "Pending" : "Handling"}</p>;
        },
    },
];

const PAGE_SIZE_DEFAULT = 10;

const PendingRequest = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<IPendingRequest[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [status, setStatus] = useState<string>("-1");
    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await RequestManagementService.get(page, page_size, debouncedValue, status);
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
    }, [loading, page, page_size, debouncedValue, status]);

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

    const handleChangeStatus = (option: string) => {
        setStatus(option);
        setLoading(true);
        setPage(1);
    };

    const handleResetStatus = () => {
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

    return (
        <Page title="Pending Request">
            <Breadcrumb title="Pending Request" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex justify-between">
                        <SearchInput
                            value={keyword}
                            placeholder="Search..."
                            onChange={handleChangeKeyword}
                            onClear={handleClearKeyword}
                        />
                    </div>
                    <div className="mt-2.5">
                        <div className="flex items-center mb-5">
                            <div className="flex items-center">
                                <h3 className="mr-2">Status: </h3>
                                <Select
                                    size="large"
                                    style={{ width: "150px" }}
                                    value={status}
                                    onChange={(option) => handleChangeStatus(option)}
                                >
                                    <Select.Option value="-1">All</Select.Option>
                                    <Select.Option value="0">Pending</Select.Option>
                                    <Select.Option value="1">Handling</Select.Option>
                                </Select>
                            </div>
                            <Button title="Reset" btnType="ok" moreClass="ml-5" onClick={handleResetStatus} />
                        </div>
                    </div>
                    <Table
                        rowKey="merchantId"
                        count={count}
                        data={data}
                        columns={columns}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onRowClick={(record) => {
                            navigate(`/request/pending-request/${record?.merchantId}`);
                        }}
                        onPerPageChange={handlePerPageChange}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default PendingRequest;
