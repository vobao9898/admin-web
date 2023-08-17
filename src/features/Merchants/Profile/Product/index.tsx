import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { SorterResult } from "antd/es/table/interface";
import Table from "components/Table";
import IProduct from "interfaces/IProduct";
import MerchantService from "services/MerchantService";
import SearchInput from "components/SeachInput/SearchInput";
import Button from "components/Button";
import ProductDetail from "./Detail";
import Message from "components/Message";
import ModalForm from "./Component/ModalForm";
import Columns from "./Columns";
import ICategory from "interfaces/ICategory";
import IMerchant from "interfaces/IMerchant";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    merchantId: number;
    merchant: IMerchant;
}

interface ISort {
    sortValue: string;
    sortType: "asc" | "desc" | undefined;
}

const Product: React.FC<IProps> = ({ merchantId, merchant }) => {
    const [data, setData] = useState<IProduct[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [sort, setSort] = useState<ISort | null>(null);
    const [isDetail, setIsDetail] = useState<boolean>(false);
    const [product, setProduct] = useState<IProduct>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        const fetchCategories = async (merchantId: number) => {
            try {
                const isSubCategory = merchant?.type === "Retailer" ? 1 : undefined;
                const { data } = await MerchantService.getCategories({
                    id: merchantId,
                    page: 0,
                    row: 0,
                    status: 0,
                    type: "product",
                    isGetBrief: true,
                    isSubCategory: isSubCategory,
                });
                setCategories(data);
            } catch (error) {
                console.log(error);
            }
        };
        if (merchantId) fetchCategories(merchantId);
    }, [merchant?.type, merchantId]);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data, count } = await MerchantService.getProduct(
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

    const handleEdit = (data?: IProduct) => {
        setOpenModal(true);
        setProduct(data);
    };

    const handleArchiveProduct = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.archiveProduct(id);
            Message.success({ text: message });
            setIsLoading(false);
            setLoading(true);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleRestoreProduct = async (id: number) => {
        try {
            setIsLoading(true);
            const message = await MerchantService.restoreProduct(id);
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

    const handleChangeTable = (sorter: SorterResult<IProduct> | SorterResult<IProduct>[]) => {
        const field = (sorter as SorterResult<IProduct>)?.field;
        const order = (sorter as SorterResult<IProduct>)?.order;

        if (field && typeof field === "string") {
            setSort({
                sortType: order === "ascend" ? "asc" : order === "descend" ? "desc" : undefined,
                sortValue: field,
            });
            setLoading(true);
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

    const handleDetail = (data: IProduct) => {
        setIsDetail(true);
        setProduct(data);
    };

    const onCloseEdit = () => {
        setOpenModal(false);
    };

    const handleSuccess = () => {
        setOpenModal(false);
        setLoading(true);
    };

    return (
        <Spin spinning={isLoading}>
            <ModalForm
                merchantId={merchantId}
                open={openModal}
                product={product}
                categories={categories}
                onClose={onCloseEdit}
                onSuccess={handleSuccess}
            />
            {!isDetail && (
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
                            <Button
                                btnType="ok"
                                title="New product"
                                onClick={() => {
                                    handleEdit(undefined);
                                }}
                                moreClass="h-10"
                            />
                        </div>
                        <Table
                            rowKey="productId"
                            data={data}
                            columns={Columns({ handleArchiveProduct, handleEdit, handleRestoreProduct, handleDetail })}
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
            {isDetail && product && (
                <ProductDetail product={product} setIsDetail={(value) => setIsDetail(value)}></ProductDetail>
            )}
        </Spin>
    );
};

export default Product;
