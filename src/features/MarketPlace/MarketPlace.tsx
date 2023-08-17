import { useState, useEffect } from "react";
import { Radio, RadioChangeEvent, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "usehooks-ts";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import IMarketPlace from "interfaces/IMarketPlace";
import MarketPlaceService from "services/MarketPlaceService";
import MarketPlaceModal from "./Create";
import "./index.css";
import Page from "components/Page";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Market Place",
        path: "/market-place",
    },
];

const PAGE_SIZE_DEFAULT = 10;

const STATUS_OPTIONS = [
    { value: "-1", label: "All" },
    { value: "0", label: "Active" },
    { value: "1", label: "Inactive" },
];

const MarketPlace = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [data, setData] = useState<IMarketPlace[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [status, setStatus] = useState<string>("-1");
    const [open, setOpen] = useState<boolean>(false);
    const debouncedValue = useDebounce<string>(keyword, 300);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await MarketPlaceService.get(page, page_size, status, debouncedValue);
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading, page, page_size, status, debouncedValue]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKeyword(value);
    };

    const handleClearKeyword = () => {
        setKeyword("");
        setPage(1);
    };

    const handleChangeStatus = (event: RadioChangeEvent) => {
        const { value } = event.target;
        setStatus(value);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const toggleOpenModal = () => {
        setOpen((preVal) => !preVal);
    };

    const handleClose = (isReload: boolean) => {
        setOpen(false);
        if (isReload) setLoading(true);
    };

    const handleReset = () => {
        setStatus("-1");
        setPage(1);
        setPageSize(PAGE_SIZE_DEFAULT);
        setKeyword("");
        if (!keyword) {
            setLoading(true);
        }
    };

    return (
        <Page title="Market Place">
            <Breadcrumb title="Market Place" breadcrumbs={BREAD_CRUMBS} />
            {open ? <MarketPlaceModal onClose={handleClose} /> : null}
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex justify-between">
                        <SearchInput
                            value={keyword}
                            placeholder="Search..."
                            onChange={handleChangeKeyword}
                            onClear={handleClearKeyword}
                        />
                        <Button onClick={toggleOpenModal} title="New Brand" btnType="ok" />
                    </div>
                    <div className="mb-5 mt-2.5 flex items-center space-x-5">
                        <p className="text-black font-medium">Status:</p>
                        <Radio.Group
                            onChange={handleChangeStatus}
                            value={status}
                            options={STATUS_OPTIONS}
                            optionType="button"
                            size="middle"
                            buttonStyle="solid"
                        />
                        <Button onClick={handleReset} title="Reset" btnType="ok" />
                    </div>
                    <Table
                        rowKey="marketPlaceId"
                        data={data}
                        columns={Columns()}
                        count={count}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onRowClick={(record) => {
                            navigate(`/market-place/${record.marketPlaceId}`, {
                                state: {
                                    marketPlace: record,
                                },
                            });
                        }}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default MarketPlace;
