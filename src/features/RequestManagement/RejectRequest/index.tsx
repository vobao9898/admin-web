import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import { Spin } from "antd";
import { getCodeAndPhoneNumber, maskPhone } from "utils";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Page from "components/Page";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import SelectUsers from "features/RequestManagement/Components/SelectUsers";
import IApprovedRequest from "interfaces/IApprovedRequest";
import RequestManagementService from "services/RequestManagementService";
import moment from "moment";

const BREAD_CRUMBS = [
    {
        name: "Reject Request",
        path: "/request/rejected-request",
    },
];

const PAGE_SIZE_DEFAULT = 10;

const columns: ColumnsType<IApprovedRequest> = [
    {
        title: "ID",
        dataIndex: "merchantId",
    },
    {
        title: "Rejected Date",
        dataIndex: "approvedDate",
        render: (text) => moment(text).format("L"),
    },
    {
        title: "DBA",
        dataIndex: "dba",
        render: (_text, item) => item?.general?.doBusinessName,
    },
    {
        title: "Owner",
        dataIndex: "owner",
        render: (_text, item) => (item?.principals[0]?.firstName || "") + " " + (item?.principals[0]?.lastName || ""),
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Store Phone",
        dataIndex: "phone",
        render(_value, record, _index) {
            const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(record.phone);
            return <span>{maskPhone(codeMobilePhone, mobilePhoneNumber)}</span>;
        },
    },
    {
        title: "Contact Phone",
        dataIndex: "phone",
        render(_value, record, _index) {
            const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(record.general.phoneContact);
            return <span>{maskPhone(codeMobilePhone, mobilePhoneNumber)}</span>;
        },
    },
    {
        title: "Rejected By",
        dataIndex: "rejectedBy",
        render: (_text, item: any) => item?.adminUser?.first_name + " " + item?.adminUser?.last_name,
    },
];

const RejectRequest = () => {
    const navigate = useNavigate();

    const [dataPending, setDataPending] = useState<IApprovedRequest[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const debouncedValue = useDebounce<string>(keyword, 300);
    const [status, setStatus] = useState<number>(0);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await RequestManagementService.getRejecteds(
                    page,
                    page_size,
                    status,
                    debouncedValue
                );
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

    const changeStatus = async (value: number) => {
        setStatus(value);
        setLoading(true);
        setPage(1);
    };

    const handleResetStatus = () => {
        setStatus(0);
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
        <Page title="Reject Request">
            <Breadcrumb title="Reject Request" breadcrumbs={BREAD_CRUMBS} />
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
                                <h3 className="mr-2">Reject by: </h3>
                                <SelectUsers value={status} changeStatus={changeStatus} />
                            </div>
                            <Button title="Reset" btnType="ok" moreClass="ml-5" onClick={handleResetStatus} />
                        </div>
                    </div>
                    <Table
                        rowKey="merchantId"
                        count={count}
                        data={dataPending}
                        columns={columns}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onRowClick={(record) => {
                            navigate(`/request/rejected-request/${record?.merchantId}`);
                        }}
                        onPerPageChange={handlePerPageChange}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default RejectRequest;
