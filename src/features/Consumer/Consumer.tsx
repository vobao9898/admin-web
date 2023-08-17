import { Spin, Radio, RadioChangeEvent } from "antd";
import { Table as AntTable } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import { SorterResult } from "antd/es/table/interface";
import { formatMoney } from "utils";
import Button from "components/Button";
import Breadcrumb from "components/Breadcrumb";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import IConsumer from "interfaces/IConsumer";
import ConsumerService from "services/ConsumerService";
import Page from "components/Page";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Customer",
        path: "/consumer",
    },
];

const STATUS_OPTIONS = [
    { value: -1, label: "All" },
    { value: 1, label: "True" },
    { value: 0, label: "False" },
];

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

interface ISummary {
    totalAmount: string;
    credit: string;
}

const PAGE_SIZE_DEFAULT = 10;

const Consumer = () => {
    const navigate = useNavigate();

    const [data, setData] = useState<IConsumer[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [status, setStatus] = useState<number>(-1);
    const [summary, setSummary] = useState<ISummary | null>(null);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count, summary } = await ConsumerService.get(
                    page,
                    page_size,
                    status,
                    debouncedValue,
                    sort?.sortValue,
                    sort?.sortType
                );
                setSummary(summary);
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading, page, status, page_size, debouncedValue, sort?.sortType, sort?.sortValue]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKeyword(value);
        setPage(1);
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setPage(1);
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

    const handleChangeStatus = (event: RadioChangeEvent) => {
        const { value } = event.target;
        setStatus(value);
        setPage(1);
        setLoading(true);
    };

    const handleReset = () => {
        setStatus(-1);
        setPage(1);
        setKeyword("");
        if (!keyword) {
            setLoading(true);
        }
    };

    const handleChangeTable = (sorter: SorterResult<IConsumer> | SorterResult<IConsumer>[]) => {
        const field = (sorter as SorterResult<IConsumer>)?.field;
        const order = (sorter as SorterResult<IConsumer>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
    };

    return (
        <Page title="Consumer">
            <Breadcrumb title="Customer" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex space-x-5 items-center mb-5">
                        <SearchInput
                            value={keyword}
                            placeholder="Search..."
                            onChange={handleChangeKeyword}
                            onClear={handleClearKeyword}
                        />
                        <div className="flex items-center space-x-5">
                            <p className="text-black font-medium">Is Verify:</p>
                            <Radio.Group
                                options={STATUS_OPTIONS}
                                optionType="button"
                                onChange={handleChangeStatus}
                                value={status}
                                size="middle"
                                buttonStyle="solid"
                            />
                            <Button onClick={handleReset} title="Reset" btnType="ok" />
                        </div>
                    </div>
                    <Table
                        rowKey="userId"
                        data={data}
                        columns={Columns()}
                        count={count}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onChange={handleChangeTable}
                        onRowClick={(record) => {
                            navigate(`/consumer/${record.userId}`);
                        }}
                        renderSummary={(data) => {
                            return summary && data && data.length ? (
                                <AntTable.Summary.Row>
                                    <AntTable.Summary.Cell index={0} colSpan={5}>
                                        <p className="font-semibold">{count ? `Total Rows: ${count}` : ""}</p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={1}>
                                        <p className="font-semibold">
                                            {summary ? `${formatMoney(summary.credit)}` : ""}
                                        </p>
                                    </AntTable.Summary.Cell>
                                    <AntTable.Summary.Cell index={2}>
                                        <p className="font-semibold">
                                            {summary ? `${formatMoney(summary.totalAmount)}` : ""}
                                        </p>
                                    </AntTable.Summary.Cell>
                                </AntTable.Summary.Row>
                            ) : null;
                        }}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default Consumer;
