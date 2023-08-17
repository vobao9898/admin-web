import { Spin } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import Button from "components/Button";
import ModalSuccess from "components/Modal/ModalSuccess";
import SearchInput from "components/SeachInput/SearchInput";
import Table from "components/Table";
import IGiftCard from "interfaces/IGiftCard";
import MerchantService from "services/MerchantService";
import Columns from "./Columns";
import ModalForm from "./Component/ModalForm";
import DetailGiftCard from "./Detail";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    merchantId: number;
    toggleState: string;
}

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

interface ISelect {
    value: number;
    label: string;
}

const Activities: React.FC<IProps> = ({ merchantId, toggleState }) => {
    const [data, setData] = useState<IGiftCard[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [giftCart, setGiftCart] = useState<IGiftCard>();
    const [isDetail, setIsDetail] = useState<boolean>(false);
    const [isExport, setIsExport] = useState<boolean>(false);
    const [modalEdit, setModalEdit] = useState<boolean>(false);
    const [linkExport, setLinkExport] = useState<string>("");
    const [dataSelect, setDataSelect] = useState<ISelect[]>([]);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        if (toggleState === "Gift Card") {
            setIsDetail(false);
        }
    }, [toggleState]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data, count } = await MerchantService.getGiftCard(
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

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
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

    const handleChangeTable = (sorter: SorterResult<IGiftCard> | SorterResult<IGiftCard>[]) => {
        const field = (sorter as SorterResult<IGiftCard>)?.field;
        const order = (sorter as SorterResult<IGiftCard>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
    };

    const handleDetail = (value: IGiftCard) => {
        setGiftCart(value);
        setIsDetail(true);
    };

    const handleExport = async (id: number) => {
        try {
            setIsLoading(true);
            const link = await MerchantService.getExportGiftCard(id);
            if (link) {
                setIsExport(true);
                setLinkExport(link);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onClose = () => {
        setIsExport(false);
    };

    const onCloseEdit = () => {
        setModalEdit(false);
    };

    const onGeneral = async () => {
        try {
            const data = await MerchantService.basicList();
            const value: ISelect[] = data.map((item) => {
                return {
                    value: item.merchantid,
                    label: item.businessname,
                };
            });
            setDataSelect(value);
            setModalEdit(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleBack = () => {
        setIsDetail(false);
    };

    const handleSuccess = () => {
        setModalEdit(false);
        setLoading(true);
    };

    return (
        <Spin spinning={isLoading}>
            <ModalForm
                dataSelect={dataSelect}
                merchantId={merchantId}
                modalEdit={modalEdit}
                onClose={onCloseEdit}
                onSuccess={handleSuccess}
            />
            <ModalSuccess isExport={isExport} linkExport={linkExport} onClose={onClose} />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                {!isDetail ? (
                    <Spin spinning={loading}>
                        <div className="flex justify-between mb-2.5">
                            <div className="mr-5 mb-2">
                                <SearchInput
                                    value={keyword}
                                    placeholder="Search..."
                                    onChange={handleChangeKeyword}
                                    onClear={handleClearKeyword}
                                />
                            </div>
                            <Button btnType="ok" title="Generate Code" onClick={onGeneral} moreClass="h-10" />
                        </div>
                        <Table
                            rowKey="giftCardGeneralId"
                            data={data}
                            columns={Columns({ handleExport })}
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
                ) : giftCart ? (
                    <DetailGiftCard giftCard={giftCart} onBack={handleBack} handleExport={(id) => handleExport(id)} />
                ) : null}
            </div>
        </Spin>
    );
};

export default Activities;
