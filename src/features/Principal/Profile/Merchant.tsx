import React, { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getCodeAndPhoneNumber, maskPhone } from "utils";
import type { ColumnsType } from "antd/es/table";
import Button from "components/Button/Button";
import Table from "components/Table/Table";
import moment from "moment";
import IMerchant from "interfaces/IMerchant";
import PrincipalService from "services/PrincipalService";

const MERCHANT_TYPE_OPTIONS = [
    { value: "-1", label: "All" },
    { value: "0", label: "Salon POS" },
    { value: "1", label: "Retailer" },
    { value: "2", label: "Staff One" },
    { value: "3", label: "Restaurant" },
];

const IS_TEST_OPTIONS = [
    { value: "-1", label: "All" },
    { value: true, label: "Yes" },
    { value: false, label: "No" },
];

const MERCHANT_STATUS_OPTIONS = [
    { value: "-1", label: "All" },
    { value: "0", label: "Active" },
    { value: "1", label: "Inactive" },
];

interface IProps {
    id: string;
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
        dataIndex: "principals",
        render: (text, item: any) =>
            item?.principals?.length > 0 && `${item?.principals[0]?.firstName} ${item?.principals[0]?.lastName}`,
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
        render: (text) => (text === 0 ? "Active" : "Inactive"),
    },
    {
        title: "Expire Date",
        dataIndex: "expiredDate",
        render: (text) => moment(text).format("MM/DD/YYYY hh:mm A"),
    },
];

const PAGE_SIZE_DEFAULT = 10;

const Merchant: React.FC<IProps> = ({ id }) => {
    const [merchant, setMerchant] = useState<IMerchant[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<string>("-1");
    const [merchantType, setMerchantType] = useState<string>("-1");
    const [isTest, setIsTest] = useState<string | boolean>("-1");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await PrincipalService.getMerchants(
                    parseInt(id),
                    page,
                    page_size,
                    status,
                    merchantType,
                    isTest
                );
                setMerchant(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading, page, page_size, status, merchantType, isTest, id]);

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handleChangeStatus = (option: string) => {
        setStatus(option);
        setPage(1);
        setLoading(true);
    };

    const changeMerchantType = (option: string) => {
        setMerchantType(option);
        setPage(1);
        setLoading(true);
    };

    const changeIsTest = (option: string | boolean) => {
        setIsTest(option);
        setPage(1);
        setLoading(true);
    };

    const handleResetStatus = () => {
        setStatus("-1");
        setIsTest("-1");
        setMerchantType("-1");
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    return (
        <Spin spinning={loading}>
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <div className="mt-2.5">
                    <div className="flex items-center flex-wrap mb-5">
                        <div className="flex items-center mr-5">
                            <h3 className="mr-2">Status: </h3>
                            <Select
                                options={MERCHANT_STATUS_OPTIONS}
                                size="large"
                                style={{ width: "150px" }}
                                value={status}
                                onChange={handleChangeStatus}
                            />
                        </div>
                        <div className="flex items-center mr-5">
                            <h3 className="mr-2">Merchant Type: </h3>
                            <Select
                                options={MERCHANT_TYPE_OPTIONS}
                                size="large"
                                style={{ width: "150px" }}
                                value={merchantType}
                                onChange={changeMerchantType}
                            />
                        </div>
                        <div className="flex items-center mr-5">
                            <h3 className="mr-2">Is Test: </h3>
                            <Select
                                options={IS_TEST_OPTIONS}
                                size="large"
                                style={{ width: "150px" }}
                                value={isTest}
                                onChange={changeIsTest}
                            />
                        </div>
                        <Button title="Reset" btnType="ok" moreClass="mr-5" onClick={handleResetStatus} />
                    </div>
                </div>
                <Table
                    rowKey="merchantId"
                    data={merchant}
                    columns={columns}
                    count={count}
                    page={page - 1}
                    rowPerPage={page_size}
                    loading={loading}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </div>
        </Spin>
    );
};

export default Merchant;
