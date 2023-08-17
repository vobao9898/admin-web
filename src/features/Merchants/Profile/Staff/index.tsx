import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { SorterResult } from "antd/es/table/interface";
import Table from "components/Table";
import IStaff from "interfaces/IStaff";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import Button from "components/Button";
import SearchInput from "components/SeachInput/SearchInput";
import StaffDetail from "./Detail";
import StaffCreate from "./Create/index";
import Columns from "./Columns";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    merchantId: number;
    toggleState: string;
}

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

const Staff: React.FC<IProps> = ({ merchantId, toggleState }) => {
    const [data, setData] = useState<IStaff[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [isDetail, setIsDetail] = useState<boolean>(false);
    const [staffId, setStaffId] = useState<number>();
    const [isCreate, setIsCreate] = useState<boolean>(false);
    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        closeDetail();
        closeCreate();
    }, [toggleState]);

    const handleArchive = async (id: number) => {
        try {
            const message = await MerchantService.archiveStaff(id);
            Message.success({ text: message });
            setLoading(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleRestore = async (id: number) => {
        try {
            const message = await MerchantService.restoreStaff(id);
            Message.success({ text: message });
            setLoading(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleDetail = (data: IStaff) => {
        setIsDetail(true);
        setStaffId(data.staffId);
    };

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data, count } = await MerchantService.getStaff(
                    merchantId,
                    page,
                    page_size,
                    sort?.sortValue,
                    sort?.sortType,
                    debouncedValue
                );

                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading && merchantId) fetchData(merchantId);
    }, [loading, page, page_size, merchantId, sort?.sortType, sort?.sortValue, debouncedValue]);

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

    const handleChangeTable = (sorter: SorterResult<IStaff> | SorterResult<IStaff>[]) => {
        const field = (sorter as SorterResult<IStaff>)?.field;
        const order = (sorter as SorterResult<IStaff>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
    };

    const closeDetail = () => {
        setIsDetail(false);
    };

    const closeCreate = () => {
        setIsCreate(false);
    };

    const handleCreateStaffSuccess = () => {
        setIsCreate(false);
        setLoading(true);
    };

    return (
        <div>
            {!isDetail && !isCreate && (
                <div className="p-4 bg-gray-50 shadow rounded-xl">
                    <Spin spinning={loading}>
                        <div className="flex justify-between">
                            <div className="mr-5 mb-2">
                                <SearchInput
                                    value={keyword}
                                    placeholder="Search..."
                                    onChange={handleChangeKeyword}
                                    onClear={handleClearKeyword}
                                />
                            </div>
                            <div className="flex flex-wrap flex-1 justify-end">
                                <Button
                                    btnType="ok"
                                    title="New staff"
                                    onClick={() => {
                                        setIsCreate(true);
                                    }}
                                    moreClass="h-10 mb-1"
                                />
                            </div>
                        </div>
                        <Table
                            rowKey="staffId"
                            data={data}
                            columns={Columns({ handleArchive, handleRestore })}
                            count={count}
                            loading={loading}
                            page={page - 1}
                            rowPerPage={page_size}
                            onPageChange={handlePageChange}
                            onPerPageChange={handlePerPageChange}
                            onChange={handleChangeTable}
                            onRowClick={(record) => {
                                handleDetail(record);
                            }}
                        />
                    </Spin>
                </div>
            )}
            {isDetail && staffId && <StaffDetail id={staffId} merchantId={merchantId} closeDetail={closeDetail} />}
            {isCreate && (
                <StaffCreate onClose={closeCreate} merchantId={merchantId} onSuccess={handleCreateStaffSuccess} />
            )}
        </div>
    );
};

export default Staff;
