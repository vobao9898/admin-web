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
import ICategory from "interfaces/ICategory";
import IExtra from "interfaces/IExtra";
import IService from "interfaces/IService";
import MerchantService from "services/MerchantService";
import EditForm from "./EditForm";
import ServicesColumn from "./ServicesColumn";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    merchantId: number;
    toggleState: string;
}

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

const Service: React.FC<IProps> = ({ merchantId, toggleState }) => {
    const token = localStorage.getItem(KEY_TOKEN);
    const [data, setData] = useState<IService[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingData, setLoadingData] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [isExport, setIsExport] = useState<boolean>(false);
    const [linkExport, setLinkExport] = useState<string>("");
    const [openEdit, setOpenEdit] = useState<boolean>();
    const [service, setService] = useState<IService>();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [extras, setExtras] = useState<IExtra[]>([]);

    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        if (toggleState === "Service") {
            setOpenEdit(false);
        }
    }, [toggleState]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await MerchantService.getCategory(
                    merchantId,
                    0,
                    0,
                    0,
                    "service",
                    undefined,
                    undefined,
                    true,
                    "",
                    0
                );
                setCategories(data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchExtras = async () => {
            try {
                const { data } = await MerchantService.getExtra(merchantId);
                setExtras(data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchData = async () => {
            try {
                await Promise.all([fetchCategories(), fetchExtras()]);
                setLoadingData(false);
            } catch (error) {
                setLoadingData(false);
            }
        };
        if (merchantId && loadingData) {
            fetchData();
        }
    }, [merchantId, loadingData]);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data, count } = await MerchantService.getService(
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

    const handleDelete = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.deleteService(id);
            Message.success({ text: message });
            setIsLoading(false);
            setLoading(true);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleEdit = async (data: IService) => {
        setService(data);
        setOpenEdit(true);
    };

    const handleArchive = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.archiveService(id);
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
            const message = await MerchantService.restoreService(id);
            Message.success({ text: message });
            setIsLoading(false);
            setLoading(true);
        } catch (error) {
            setIsLoading(false);
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

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const handleChangeTable = (sorter: SorterResult<IService> | SorterResult<IService>[]) => {
        const field = (sorter as SorterResult<IService>)?.field;
        const order = (sorter as SorterResult<IService>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
        }
    };

    const handleExport = async () => {
        try {
            setIsLoading(true);
            if (merchantId) {
                const data = await MerchantService.getExportService(merchantId);
                if (data) {
                    setIsExport(true);
                    setLinkExport(data);
                    setIsLoading(false);
                }
            }
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onClose = () => {
        setIsExport(false);
    };

    const onCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleSuccess = () => {
        setOpenEdit(false);
        setLoadingData(true);
        setLoading(true);
    };

    return (
        <Spin spinning={isLoading}>
            {!openEdit && (
                <div className="p-4 bg-gray-50 shadow rounded-xl">
                    <ModalSuccess isExport={isExport} linkExport={linkExport} onClose={onClose} />
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
                                <Button btnType="ok" title="Export" onClick={handleExport} moreClass="h-10 mb-1 mr-5" />
                                <Upload
                                    className="mr-5 mb-1"
                                    showUploadList={false}
                                    method={"put"}
                                    name={"file"}
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                    action={`${API_BASE_URL}Service/importByMerchant/${merchantId}`}
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
                                            if (file.response && file.response.codeNumber !== HTTP_STATUS_CODES.OK) {
                                                const err = JSON.stringify(file.response.message);
                                                Message.error({ text: err });
                                            }
                                            if (file.response && file.response.codeNumber === HTTP_STATUS_CODES.OK) {
                                                setLoading(true);
                                                Message.success({ text: file.response.Message });
                                            }
                                            setIsLoading(false);
                                        }
                                    }}
                                >
                                    <Button
                                        moreClass="w-full h-10 mb-1 mr-5"
                                        btnType={"ok"}
                                        title="Import"
                                        onClick={() => {}}
                                    />
                                </Upload>

                                <Button
                                    btnType="ok"
                                    title="New service"
                                    onClick={() => {
                                        setOpenEdit(true);
                                        setService(undefined);
                                    }}
                                    moreClass="h-10 mb-1"
                                />
                            </div>
                        </div>
                        <Table
                            rowKey="serviceId"
                            data={data}
                            columns={ServicesColumn({ handleArchive, handleEdit, handleRestore, handleDelete })}
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
            )}
            {openEdit && (
                <EditForm
                    categories={categories}
                    merchantId={merchantId}
                    service={service}
                    extras={extras}
                    onSuccess={handleSuccess}
                    onClose={onCloseEdit}
                />
            )}
        </Spin>
    );
};

export default Service;
