import { Spin, Upload } from "antd";
import { SorterResult } from "antd/es/table/interface";
import { API_BASE_URL, HTTP_STATUS_CODES, KEY_TOKEN } from "contants";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import Button from "components/Button";
import Message from "components/Message";
import ModalSuccess from "components/Modal/ModalSuccess";
import SearchInput from "components/SeachInput/SearchInput";
import Table from "components/Table";
import IExtra from "interfaces/IExtra";
import MerchantService from "services/MerchantService";
import Columns from "./Columns";
import ModalForm from "./Component/ModalForm";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    merchantId: number;
}

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

const Extra: React.FC<IProps> = ({ merchantId }) => {
    const token = localStorage.getItem(KEY_TOKEN);
    const [data, setData] = useState<IExtra[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [isExport, setIsExport] = useState<boolean>(false);
    const [linkExport, setLinkExport] = useState<string>("");
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [extra, setExtra] = useState<IExtra>();
    const debouncedValue = useDebounce<string>(keyword, 300);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data, count } = await MerchantService.getExtra(
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
    }, [loading, page, page_size, merchantId, sort, debouncedValue]);

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.deleteExtra(id);
            Message.success({ text: message });
            setIsLoading(false);
            setLoading(true);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleArchive = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.archiveExtra(id);
            Message.success({ text: message });
            setIsLoading(false);
            setLoading(true);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleRestore = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.restoreExtra(id);
            Message.success({ text: message });
            setIsLoading(false);
            setLoading(true);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleChangeTable = (sorter: SorterResult<IExtra> | SorterResult<IExtra>[]) => {
        const field = (sorter as SorterResult<IExtra>)?.field;
        const order = (sorter as SorterResult<IExtra>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
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

    const handleExport = async () => {
        try {
            setIsLoading(true);
            if (merchantId) {
                const link = await MerchantService.getExportExtra(merchantId);
                setIsExport(true);
                setLinkExport(link);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleEdit = async (data: IExtra) => {
        setOpenModal(true);
        setExtra(data);
    };

    const onClose = () => {
        setIsExport(false);
        setIsError(false);
    };

    const onCloseEdit = () => {
        setOpenModal(false);
    };

    const handleSuccessEdit = () => {
        setOpenModal(false);
        setLoading(true);
    };

    return (
        <Spin spinning={isLoading}>
            {extra ? (
                <ModalForm
                    open={openModal}
                    merchantId={merchantId}
                    extra={extra}
                    onClose={onCloseEdit}
                    onSuccess={handleSuccessEdit}
                />
            ) : null}
            <ModalSuccess isExport={isExport} linkExport={linkExport} onClose={onClose} isError={isError} />
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
                        <div className="flex gap-x-2">
                            <Button btnType="ok" title="Export" onClick={handleExport} moreClass="h-10" />
                            <Upload
                                className="w-full"
                                showUploadList={false}
                                method={"put"}
                                name={"file"}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                action={`${API_BASE_URL}extra/import/` + merchantId}
                                headers={{
                                    Authorization: `Bearer ${token}`,
                                }}
                                beforeUpload={(file) => {
                                    let isExcel = false;
                                    if (
                                        file.type ===
                                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    )
                                        isExcel = true;
                                    if (!isExcel) {
                                        Message.error({
                                            text: `File type is not supported! Please choose another file.`,
                                        });
                                    }
                                    return isExcel || Upload.LIST_IGNORE;
                                }}
                                onChange={({ file }) => {
                                    if (file?.status === "uploading") {
                                        setIsLoading(true);
                                        return;
                                    }
                                    if (file?.status === "done") {
                                        if (file.response && file.response?.codeNumber !== HTTP_STATUS_CODES.OK) {
                                            if (file?.response?.data?.path) {
                                                setIsExport(true);
                                                setLinkExport(file.response.data.path);
                                                setIsError(true);
                                            } else {
                                                const err = JSON.stringify(file.response?.message);
                                                Message.error({ text: err });
                                            }
                                        }
                                        if (file.response && file.response?.codeNumber === HTTP_STATUS_CODES.OK) {
                                            setLoading(true);
                                            Message.success({ text: file.response?.message });
                                        }
                                        setIsLoading(false);
                                    }
                                }}
                            >
                                <Button moreClass="w-full h-10" btnType="ok" title="Import" />
                            </Upload>
                        </div>
                    </div>
                    <Table
                        rowKey="extraId"
                        data={data}
                        columns={Columns({ handleArchive, handleEdit, handleRestore, handleDelete })}
                        count={count}
                        page={page - 1}
                        loading={loading}
                        rowPerPage={page_size}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                        onChange={handleChangeTable}
                    />
                </Spin>
            </div>
        </Spin>
    );
};

export default Extra;
