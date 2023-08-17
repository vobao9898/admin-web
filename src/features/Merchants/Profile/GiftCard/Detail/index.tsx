import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { Modal, Spin } from "antd";
import { SorterResult } from "antd/es/table/interface";
import Button from "components/Button";
import SearchInput from "components/SeachInput/SearchInput";
import Table from "components/Table";
import IGiftCard from "interfaces/IGiftCard";
import IGiftCardGeneral from "interfaces/IGiftCardGeneral";
import IGiftCardLog from "interfaces/IGiftCardLog";
import moment from "moment";
import MerchantService from "services/MerchantService";
import Columns from "./Columns";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    giftCard: IGiftCard;
    onBack: () => void;
    handleExport: (id: number) => void;
}

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

const DetailGiftCard: React.FC<IProps> = ({ giftCard, onBack, handleExport }) => {
    const [data, setData] = useState<IGiftCardGeneral[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [merchant, setMerchant] = useState<string[]>([]);
    const [modal, setModal] = useState<boolean>(false);
    const [dataModal, setDataModal] = useState<IGiftCardLog[]>();
    const [title, setTitle] = useState<string>("");
    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async (id: number) => {
            try {
                const { data, count, summary } = await MerchantService.getGiftCardGeneral(
                    id,
                    page,
                    page_size,
                    sort?.sortValue,
                    sort?.sortType,
                    debouncedValue
                );
                setMerchant(summary.merchantNames);
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading && giftCard.giftCardGeneralId) fetchData(giftCard.giftCardGeneralId);
    }, [loading, page, page_size, giftCard.giftCardGeneralId, sort?.sortType, sort?.sortValue, debouncedValue]);

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

    const handleChangeTable = (sorter: SorterResult<IGiftCardGeneral> | SorterResult<IGiftCardGeneral>[]) => {
        const field = (sorter as SorterResult<IGiftCardGeneral>)?.field;
        const order = (sorter as SorterResult<IGiftCardGeneral>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
    };

    const onShowInfo = async (value: IGiftCardGeneral) => {
        try {
            const data = await MerchantService.getInfoGeneralById(value?.giftCardId);
            setDataModal(data);
            setTitle(value.serialNumber);
            setModal(true);
        } catch (error) {
            console.log(error);
        }
    };

    const renderModal = () => {
        return (
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={modal}
                width={1200}
                onCancel={() => setModal(false)}
                footer={""}
                title={`Logs for ${title}`}
            >
                <div className="border-solid border-2 p-5 shadow-md rounded-lg">
                    <div className="grid grid-cols-3 gap-4 border-solid">
                        <div>
                            <strong>Time</strong>
                        </div>
                        <div>
                            <strong>Date</strong>
                        </div>
                        <div>
                            <strong>Details</strong>
                        </div>
                    </div>
                    {dataModal &&
                        dataModal.map((item, index) => {
                            const utcDate = new Date(item?.createdDate);
                            return (
                                <div key={index} className="grid grid-cols-3 gap-4 border-solid">
                                    <div>{moment(utcDate).format("hh:mm A")}</div>
                                    <div>{moment(item?.createdDate).format("MM/DD/YYYY")}</div>
                                    <div>{item?.message}</div>
                                </div>
                            );
                        })}
                </div>
            </Modal>
        );
    };

    const renderDetail = () => {
        return (
            <div>
                <div>
                    <div className="p-5 rounded-lg bg-gray-50	mt-2">
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Gift Card Label</p>
                            <p className="w-2/5">
                                <strong>{giftCard?.name}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Qty</p>
                            <p className="w-2/5">
                                <strong>{giftCard?.quantity}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Value</p>
                            <p className="w-2/5">
                                <strong>{giftCard?.amount}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Merchants can be apply</p>
                            <p className="w-2/5">
                                <strong>
                                    {merchant &&
                                        merchant.map((i, index) => {
                                            let value;
                                            if (index === merchant?.length - 1) value = i;
                                            else value = i + ",  ";
                                            return value;
                                        })}
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {renderModal()}
            <div className="p-4 bg-white shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="mb-5">
                        <div className="grid grid-cols-2 gap-3">
                            <strong className="text-lg mb-5">{giftCard?.name}</strong>
                            <div className="justify-self-end">
                                <Button title="BACK" btnType="cancel" onClick={onBack} moreClass="mr-5" />
                            </div>
                        </div>
                        {renderDetail()}
                    </div>
                    <div className="flex justify-between mb-2.5">
                        <div className="mr-5 mb-2">
                            <SearchInput
                                value={keyword}
                                placeholder="Search..."
                                onChange={handleChangeKeyword}
                                onClear={handleClearKeyword}
                            />
                        </div>
                        <Button
                            btnType="ok"
                            title="Export"
                            onClick={() => handleExport(giftCard.giftCardGeneralId)}
                            moreClass="h-10"
                        />
                    </div>
                    <Table
                        rowKey="giftCardId"
                        data={data}
                        columns={Columns({ onShowInfo })}
                        count={count}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onChange={handleChangeTable}
                    />
                </Spin>
            </div>
        </div>
    );
};

export default DetailGiftCard;
