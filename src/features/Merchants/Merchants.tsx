import type { ColumnsType } from "antd/es/table";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { SorterResult } from "antd/es/table/interface";
import { isMerchantExpiredDate, getCodeAndPhoneNumber, maskPhone } from "utils";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import IMerchant from "interfaces/IMerchant";
import MerchantService from "services/MerchantService";
import moment from "moment";
import "./index.css";
import Page from "components/Page";

const BREAD_CRUMBS = [
    {
        name: "Merchant List",
        path: "",
    },
];

const PAGE_SIZE_DEFAULT = 10;

const MERCHANT_TYPE_OPTIONS = [
    { value: "-1", label: "All" },
    { value: "0", label: "Salon POS" },
    { value: "1", label: "Retailer" },
    { value: "2", label: "Staff One" },
    { value: "3", label: "Restaurant" },
];

const IS_TEST_OPTIONS = [
    { value: "-1", label: "All" },
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
];

const MERCHANT_STATUS_OPTIONS = [
    { value: "-1", label: "All" },
    { value: "0", label: "Active" },
    { value: "1", label: "Inactive" },
];

export interface ISort {
    expiredDate: "ASC" | "DESC" | undefined;
    isDisabled: "ASC" | "DESC" | undefined;
}

const columns: ColumnsType<IMerchant> = [
    {
        title: "ID",
        dataIndex: "merchantId",
    },
    {
        title: "MID",
        dataIndex: "merchantCode",
    },
    {
        title: "DBA",
        dataIndex: "businessName",
    },
    {
        title: "Merchant Type",
        dataIndex: "type",
    },
    {
        title: "Owner",
        dataIndex: "owner",
        render(value, record, index) {
            return (
                record?.principals?.length > 0 &&
                record?.principals[0]?.firstName + " " + record?.principals[0]?.lastName
            );
        },
    },
    {
        title: "Email",
        dataIndex: "email",
    },
    {
        title: "Store Phone",
        dataIndex: "phone",
        render(value, record, index) {
            const [codePhone, phoneNumber] = getCodeAndPhoneNumber(record.phone);
            return <span>{maskPhone(codePhone, phoneNumber)}</span>;
        },
    },
    {
        title: "Contact Phone",
        dataIndex: "cellPhone",
        render(value, record, index) {
            const [codePhone, phoneNumber] = getCodeAndPhoneNumber(record.cellPhone);
            return <span>{maskPhone(codePhone, phoneNumber)}</span>;
        },
    },
    {
        title: "Status",
        dataIndex: "isDisabled",
        sorter: {
            multiple: 2,
        },
        defaultSortOrder: "ascend",
        render(value, record, index) {
            return record.isDisabled === 0 ? "Active" : "Inactive";
        },
    },
    {
        title: "Expire Date",
        dataIndex: "expiredDate",
        sorter: {
            multiple: 1,
        },
        defaultSortOrder: "ascend",
        render(value, record, index) {
            return moment(record.expiredDate).format("MM/DD/YYYY hh:mm A");
        },
    },
];

const Merchants = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState("-1");
    const [merchantType, setMerchantType] = useState("-1");
    const [isTest, setIsTest] = useState("-1");
    const [merchants, setMerchants] = useState<IMerchant[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [loadingExport, setLoadingExport] = useState<boolean>(false);
    const [sort, setSort] = useState<ISort>({
        isDisabled: "ASC",
        expiredDate: "ASC",
    });

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await MerchantService.get(
                    page,
                    page_size,
                    sort,
                    status,
                    merchantType,
                    isTest,
                    debouncedValue
                );
                setMerchants(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading, page, page_size, debouncedValue, sort, status, isTest, merchantType]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchExport = async () => {
            try {
                const data = await MerchantService.export(status, merchantType, isTest);
                if (data) window.open(data);
                setLoadingExport(false);
            } catch (error) {
                setLoadingExport(false);
            }
        };
        if (loadingExport) {
            fetchExport();
        }
    }, [isTest, keyword, loadingExport, merchantType, sort, status]);

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

    const handleChangeTable = (sorter: SorterResult<IMerchant> | SorterResult<IMerchant>[]) => {
        if (sorter && (sorter as SorterResult<IMerchant>[]).length) {
            const status = (sorter as SorterResult<IMerchant>[]).find((x) => x.field === "isDisabled");
            const expiredDate = (sorter as SorterResult<IMerchant>[]).find((x) => x.field === "expiredDate");
            if (status && expiredDate) {
                setSort({
                    isDisabled: status.order === "ascend" ? "ASC" : status.order === "descend" ? "DESC" : undefined,
                    expiredDate:
                        expiredDate.order === "ascend" ? "ASC" : expiredDate.order === "descend" ? "DESC" : undefined,
                });
                setLoading(true);
            }
        } else {
            const field = (sorter as SorterResult<IMerchant>)?.field;
            const order = (sorter as SorterResult<IMerchant>)?.order;
            if (field && typeof field === "string") {
                setSort({
                    [field]: order === "ascend" ? "ASC" : order === "descend" ? "DESC" : undefined,
                } as Pick<ISort, keyof ISort>);
                setLoading(true);
            }
        }
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleAdd = () => {
        navigate("/merchant/add");
    };

    const handleChangeStatus = (status: string) => {
        setStatus(status);
        setLoading(true);
    };

    const handleChangeMerchantType = (type: string) => {
        setMerchantType(type);
        setLoading(true);
    };

    const handleChangeIsTest = (value: string) => {
        setIsTest(value);
        setLoading(true);
    };

    const handleReset = () => {
        if (isTest === "-1" && merchantType === "-1" && status === "-1" && keyword === "") return;
        setIsTest("-1");
        setMerchantType("-1");
        setStatus("-1");
        setKeyword("");
        if (!keyword) {
            setLoading(true);
        }
    };

    const handleExport = () => {
        setLoadingExport(true);
    };

    return (
        <Page title="Merchant">
            <Breadcrumb title="Merchant List" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading || loadingExport}>
                    <div className="flex justify-between">
                        <SearchInput
                            value={keyword}
                            placeholder="Search..."
                            onChange={handleChangeKeyword}
                            onClear={handleClearKeyword}
                        />
                        <div className="flex space-x-2">
                            <Button onClick={handleExport} title="Export" btnType="ok" />
                            <Button onClick={handleAdd} title="Add Merchant" btnType="ok" />
                        </div>
                    </div>
                    <div className="mt-2.5">
                        <div className="flex items-center mb-5 space-x-5">
                            <div className="flex items-center">
                                <h3 className="mr-2">Status: </h3>
                                <Select
                                    size="large"
                                    value={status}
                                    onChange={handleChangeStatus}
                                    options={MERCHANT_STATUS_OPTIONS}
                                    style={{ width: "150px" }}
                                />
                            </div>
                            <div className="flex items-center">
                                <h3 className="mr-2">Merchant Type: </h3>
                                <Select
                                    size="large"
                                    value={merchantType}
                                    onChange={handleChangeMerchantType}
                                    options={MERCHANT_TYPE_OPTIONS}
                                    style={{ width: "150px" }}
                                />
                            </div>
                            <div className="flex items-center">
                                <h3 className="mr-2">Is Test: </h3>
                                <Select
                                    size="large"
                                    value={isTest}
                                    onChange={handleChangeIsTest}
                                    options={IS_TEST_OPTIONS}
                                    style={{ width: "150px" }}
                                />
                            </div>
                            <Button onClick={handleReset} title="Reset" btnType="ok" moreClass="ml-5" />
                        </div>
                    </div>
                    <Table
                        rowKey="merchantId"
                        data={merchants}
                        columns={columns}
                        count={count}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onChange={handleChangeTable}
                        onPageChange={handlePageChange}
                        handleRowClassName={(record) => {
                            if (isMerchantExpiredDate(record?.expiredDate)) {
                                return "custom-ant-table-bg bg-yellow-200";
                            }
                            return "";
                        }}
                        onPerPageChange={handlePerPageChange}
                        onRowClick={(record) => {
                            localStorage.setItem("toggleState", JSON.stringify("General"));
                            navigate(`/${record.merchantId}`);
                        }}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default Merchants;
