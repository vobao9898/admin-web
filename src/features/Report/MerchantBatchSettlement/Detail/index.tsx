import { useEffect, useState } from "react";
import { Spin } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Table as AntTable } from "antd";
import type { ColumnsType } from "antd/es/table";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Table from "components/Table";
import moment from "moment";
import ReportService from "services/ReportService";
import IMerchantTransaction from "interfaces/IMerchantTransaction";

const BREAD_CRUMBS = [
    {
        name: "Report",
        path: "",
    },
    {
        name: "Batch",
        path: "/reports/merchant-batch-settlement",
    },
    {
        name: "Detail",
        path: "",
    },
];

const PAGE_SIZE_DEFAULT = 10;

interface ISummary {
    totalAmount: string;
}

const Transactions = () => {
    const { settlementId, merchantId } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState<IMerchantTransaction[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [summary, setSummary] = useState<ISummary | null>(null);

    useEffect(() => {
        const fetchData = async (settlementId: string) => {
            try {
                const { data, count, summary } = await ReportService.getBatchById(
                    page,
                    page_size,
                    parseInt(settlementId)
                );
                setSummary(summary);
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading && settlementId) {
            fetchData(settlementId);
        }
    }, [loading, page, page_size, settlementId]);

    const columns: ColumnsType<IMerchantTransaction> = [
        {
            title: "Transaction ID",
            dataIndex: "transactionId",
            render: (text, item) => {
                return <span>{item?.paymentData?.transaction_id}</span>;
            },
        },
        {
            title: "Date/Time",
            dataIndex: "createdDate",
            render: (text, item) => <span>{moment(text).format("MM/DD/YYYY hh:mm A")}</span>,
        },
        {
            title: "Invoice Number",
            dataIndex: "checkoutId",
            render: (text) => <p>{text}</p>,
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text, item) => <span className="uppercase">{item.status}</span>,
        },
        {
            title: "Payment",
            dataIndex: "payment",
            render: (text, item) => (
                <p>
                    <span className="font-semibold mr-2">Other</span>
                    <span>{item?.paymentData?.card_number}</span>
                </p>
            ),
        },
        {
            title: "Total",
            dataIndex: "amount",
            render: (text, item) => <p>${text}</p>,
        },
    ];

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handleBack = () => {
        navigate(`/reports/merchant-batch-settlement`);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    return (
        <div>
            <Breadcrumb title="Merchant Batch Settlement" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex items-start justify-between flex-1 mb-5">
                        <p className="text-lg text-black font-semibold">Merchant ID: {merchantId}</p>
                        <Button
                            title="Back"
                            btnType="cancel"
                            moreClass="ml-5 max-h-10 text-blue-500"
                            onClick={handleBack}
                        />
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
                        renderSummary={(data) => {
                            return summary && data && data.length ? (
                                <AntTable.Summary.Row>
                                    <AntTable.Summary.Cell index={0} colSpan={5}>
                                        <p className="font-semibold">{"Total:"}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">{summary ? `$${summary.totalAmount}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                </AntTable.Summary.Row>
                            ) : null;
                        }}
                    />
                </Spin>
            </div>
        </div>
    );
};

export default Transactions;
