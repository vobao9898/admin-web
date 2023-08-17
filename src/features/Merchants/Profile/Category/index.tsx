import { Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { SorterResult } from "antd/es/table/interface";
import { API_BASE_URL, HTTP_STATUS_CODES, KEY_TOKEN } from "contants";
import Table from "components/Table";
import ICategory from "interfaces/ICategory";
import MerchantService from "services/MerchantService";
import SearchInput from "components/SeachInput/SearchInput";
import Button from "components/Button";
import Message from "components/Message";
import ModalSuccess from "components/Modal/ModalSuccess";
import IMerchant from "interfaces/IMerchant";
import ModalForm from "./Components/ModalForm";
import Columns from "./Columns";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    merchantId: number;
    merchant: IMerchant;
}

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

const Categories: React.FC<IProps> = ({ merchantId, merchant }) => {
    const token = localStorage.getItem(KEY_TOKEN);
    const [data, setData] = useState<ICategory[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingCate, setLoadingCate] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [isExport, setIsExport] = useState<boolean>(false);
    const [linkExport, setLinkExport] = useState<string>("");
    const [isImport, setIsImport] = useState<boolean>(false);
    const [modalEdit, setModalEdit] = useState<boolean>(false);
    const [category, setCategory] = useState<ICategory>();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data } = await MerchantService.getCategories({
                    id: merchantId,
                    page: 0,
                    row: 0,
                    type: "product",
                    isGetBrief: true,
                    status: 0,
                    isSubCategory: 0,
                });
                setCategories(data);
                setLoadingCate(false);
            } catch (error) {
                setLoadingCate(false);
            }
        };
        if (merchantId && loadingCate) fetchData(merchantId);
    }, [merchantId, loadingCate]);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data, count } = await MerchantService.getCategory(
                    merchantId,
                    page,
                    page_size,
                    undefined,
                    undefined,
                    sort?.sortValue,
                    sort?.sortType,
                    undefined,
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
            const message = await MerchantService.deleteCategory(id);
            Message.success({ text: message });
            setLoading(true);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    const handleEdit = (data: ICategory | undefined) => {
        setModalEdit(true);
        setCategory(data);
    };

    const handleArchive = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.archiveCategory(id);
            Message.success({ text: message });
            setLoading(true);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleRestore = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.restoreCategory(id);
            Message.success({ text: message });
            setLoading(true);
            setIsLoading(false);
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

    const handleChangeTable = (sorter: SorterResult<ICategory> | SorterResult<ICategory>[]) => {
        const field = (sorter as SorterResult<ICategory>)?.field;
        const order = (sorter as SorterResult<ICategory>)?.order;

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
                const data = await MerchantService.getExportCategory(merchantId);
                setIsExport(true);
                setLinkExport(data);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const onClose = () => {
        setIsExport(false);
        setIsImport(false);
    };

    const onCloseEdit = () => {
        setModalEdit(false);
    };

    const handleSuccess = () => {
        setModalEdit(false);
        setLoading(true);
        setLoadingCate(true);
    };

    return (
        <Spin spinning={isLoading}>
            <ModalForm
                merchant={merchant}
                merchantId={merchantId}
                open={modalEdit}
                category={category}
                categories={categories}
                onClose={onCloseEdit}
                onSuccess={handleSuccess}
            />
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <ModalSuccess isExport={isExport} linkExport={linkExport} onClose={onClose} isError={isImport} />
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
                            {(merchant.type === "Retailer" && merchant.isWareHouse === true) ||
                            merchant.type === "SalonPos" ? (
                                <>
                                    <Button
                                        btnType="ok"
                                        title="Export"
                                        onClick={handleExport}
                                        moreClass="h-10 mb-1 mr-5"
                                    />
                                    <Upload
                                        className="mr-5 mb-1"
                                        showUploadList={false}
                                        method={"put"}
                                        name={"file"}
                                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        action={`${API_BASE_URL}Category/import/${merchantId}`}
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
                                                if (
                                                    file.response &&
                                                    file.response.codeNumber !== HTTP_STATUS_CODES.OK
                                                ) {
                                                    Message.error({ text: file.response.message });
                                                }
                                                if (
                                                    file.response &&
                                                    file.response.codeNumber === HTTP_STATUS_CODES.OK
                                                ) {
                                                    if (file.response.data) {
                                                        setIsImport(true);
                                                        setIsExport(true);
                                                        setLinkExport(file.response.data.path);
                                                    } else {
                                                        Message.success({ text: file.response.message });
                                                        setLoading(true);
                                                    }
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
                                        title="New Category"
                                        onClick={() => {
                                            handleEdit(undefined);
                                        }}
                                        moreClass="h-10 mb-1"
                                    />
                                </>
                            ) : null}
                        </div>
                    </div>
                    <Table
                        rowKey="categoryId"
                        data={data}
                        columns={Columns({ handleArchive, handleEdit, handleRestore, handleDelete, merchant })}
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
        </Spin>
    );
};

export default Categories;
