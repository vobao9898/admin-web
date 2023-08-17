import React, { useEffect, useState } from "react";
import { Spin, Tooltip } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { formatMoney } from "utils";
import type { ColumnsType } from "antd/es/table";
import ArchiveIcon from "assets/svg/archive.js";
import Table from "components/Table";
import ISubscription from "interfaces/ISubscription";
import moment from "moment";
import MerchantService from "services/MerchantService";
import { usePrevious } from "hooks/usePrevious";

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

interface IProps {
    subscriptionId: number;
    refresh: number;
}

const PAGE_SIZE_DEFAULT = 10;

interface IColumnsProps {
    handleExport: (id: number) => void;
}

const Columns = ({ handleExport }: IColumnsProps) => {
    const data: ColumnsType<ISubscription> = [
        {
            title: "History ID",
            dataIndex: "subscripitonHistoryId",
            sorter: true,
        },
        {
            title: "Subscription name",
            dataIndex: "packageName",
            sorter: true,
        },
        {
            title: "Pricing Model",
            dataIndex: "pricingType",
            sorter: true,
            render: (text) => {
                return <div>Paid {text}</div>;
            },
        },
        {
            title: "Expired Date",
            dataIndex: "expiredDate",
            sorter: true,
            render: (text) => {
                return moment(text).format("MMM DD, YYYY");
            },
        },
        {
            title: "Payment Date",
            dataIndex: "createdDate",
            sorter: true,
            render: (text) => {
                return moment(text).format("MMM DD, YYYY");
            },
        },
        {
            title: "Amount",
            dataIndex: "totalPrice",
            sorter: true,
            render: (text, data) => <span>{formatMoney(text)}</span>,
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Actions",
            dataIndex: "",
            render: (text, data) => (
                <>
                    <Tooltip title={"Download"}>
                        <button
                            className="embed border text-xs rounded-lg mr-2 text-red-500"
                            onClick={() => handleExport(data?.subscripitonHistoryId)}
                        >
                            <ArchiveIcon color={data?.isDisabled === 1 ? "rgba(0,0,255,0.5)" : ""} />
                        </button>
                    </Tooltip>
                </>
            ),
        },
    ];
    return data;
};

const BillingTable: React.FC<IProps> = ({ subscriptionId, refresh }) => {
    const [data, setData] = useState<ISubscription[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [sort, setSort] = useState<ISort | null>(null);
    const [loadingExport, setLoadingExport] = useState<boolean>(false);

    const previousRefresh = usePrevious(refresh);

    useEffect(() => {
        if (previousRefresh !== refresh && previousRefresh !== undefined) {
            setLoading(true);
        }
    }, [previousRefresh, refresh]);

    useEffect(() => {
        const fetchData = async (id: number) => {
            try {
                const { data, count } = await MerchantService.getPackage(
                    id,
                    page,
                    page_size,
                    sort?.sortValue,
                    sort?.sortType
                );
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData(subscriptionId);
    }, [loading, page, page_size, subscriptionId, sort?.sortType, sort?.sortValue]);

    const handleExport = async (id: number) => {
        try {
            setLoadingExport(true);
            const data = await MerchantService.getExportSubscription(id);
            const link = document.createElement("a");
            if (data) {
                link.href = data;
                link.target = "_blank";
                link.download = "Export_Subscription.xlsx";
                link.click();
            }
            setLoadingExport(false);
        } catch (error) {
            setLoadingExport(false);
        }
    };

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleChangeTable = (sorter: SorterResult<ISubscription> | SorterResult<ISubscription>[]) => {
        const field = (sorter as SorterResult<ISubscription>)?.field;
        const order = (sorter as SorterResult<ISubscription>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
    };

    return (
        <Spin spinning={loading || loadingExport}>
            <div className="font-bold text-lg text-blue-500 mb-2.5">Billing History</div>
            <Table
                rowKey="subscripitonHistoryId"
                data={data}
                columns={Columns({ handleExport })}
                count={count}
                loading={loading}
                page={page - 1}
                rowPerPage={page_size}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
                onChange={handleChangeTable}
            />
        </Spin>
    );
};

export default BillingTable;
