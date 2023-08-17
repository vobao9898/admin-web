import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import { getCodeAndPhoneNumber, maskPhone } from "utils";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Page from "components/Page";
import SearchInput from "components/SeachInput";
import Spin from "components/Spin/Spin";
import Table from "components/Table";
import SelectUsers from "features/RequestManagement/Components/SelectUsers";
import IApprovedRequest from "interfaces/IApprovedRequest";
import moment from "moment";
import RequestManagementService from "services/RequestManagementService";

const BREAD_CRUMBS = [
    {
        name: "Approved Request",
        path: "/request/approved-request",
    },
];

const PAGE_SIZE_DEFAULT = 10;

const columns: ColumnsType<IApprovedRequest> = [
    {
        title: "ID",
        dataIndex: "merchantId",
    },
    {
        title: "Approved Date",
        dataIndex: "approvedDate",
        render: (text) => moment(text).format("L"),
    },
    {
        title: "MID",
        dataIndex: "merchantCode",
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
            const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(record?.phone);
            return <span>{maskPhone(codeMobilePhone, mobilePhoneNumber)}</span>;
        },
    },
    {
        title: "Approved By",
        dataIndex: "approvedBy",
        render: (_text, item: IApprovedRequest) => `${item?.adminUser?.first_name} ${item?.adminUser?.last_name}`,
    },
];

const ApprovedRequest = () => {
    const navigate = useNavigate();

    const [dataPending, setDataPending] = useState<IApprovedRequest[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [status, setStatus] = useState<number>(0);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await RequestManagementService.getApproveds(
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
        <Page title="Approved Request">
            <Breadcrumb title="Approved Request" breadcrumbs={BREAD_CRUMBS} />
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
                                <h3 className="mr-2">Approved by: </h3>
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
                            navigate(`/request/approved-request/${record?.merchantId}`);
                        }}
                        onPerPageChange={handlePerPageChange}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default ApprovedRequest;
