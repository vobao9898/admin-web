import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Table from "components/Table";
import ReportService from "services/ReportService";
import IGiftCardSoldDetail from "interfaces/IGiftCardSoldDetail";

const BREAD_CRUMBS = [
    {
        name: "Report",
        path: "",
    },
    {
        name: "Gift Card Sold",
        path: "/reports/gift-card-sold",
    },
    {
        name: "Detail",
        path: "",
    },
];

const PAGE_SIZE_DEFAULT = 10;

const columns: ColumnsType<IGiftCardSoldDetail> = [
    {
        title: "ID",
        dataIndex: "giftCardId",
    },
    {
        title: "Serial",
        dataIndex: "serialNumber",
    },
    {
        title: "Value",
        dataIndex: "value",
    },
];

const GiftCardSold = () => {
    const { merchantId } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    const [data, setData] = useState<IGiftCardSoldDetail[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [summary, setSummary] = useState<any>();

    useEffect(() => {
        const fetchData = async (merchantId: string, state: any) => {
            try {
                const { data, count, summary } = await ReportService.getGiftCardSoldById(
                    page,
                    page_size,
                    parseInt(merchantId),
                    state.date
                );
                setSummary(summary);
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading && merchantId && state) {
            fetchData(merchantId, state);
        }
    }, [loading, page, page_size, merchantId, state]);

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleBack = () => {
        navigate(`/reports/gift-card-sold`);
    };

    return (
        <div>
            <Breadcrumb title="Gift Card Sold" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex items-start justify-between flex-1">
                        <p className="text-lg text-black font-semibold">Merchant ID: {merchantId}</p>
                        <Button
                            title="Back"
                            btnType="cancel"
                            moreClass="ml-5 max-h-10 text-blue-500"
                            onClick={handleBack}
                        />
                    </div>
                    <div className="flex items-center mb-5">
                        <p className="text-black text-sm font-semibold mr-5">Total Row: {summary?.quantity}</p>
                        <p className="text-black text-sm font-semibold">Total AMount: {summary?.amount}</p>
                    </div>
                    <Table
                        rowKey="giftCardId"
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

export default GiftCardSold;
