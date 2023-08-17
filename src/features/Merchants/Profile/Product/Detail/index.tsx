import { Spin } from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import Table from "components/Table";
import IProductVersion from "interfaces/IProductVersion";
import MerchantService from "services/MerchantService";
import IProduct from "interfaces/IProduct";
import Button from "components/Button";
import product_default from "assets/images/product_default.png";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    product: IProduct;
    setIsDetail: (value: boolean) => void;
}

const columns: ColumnsType<IProductVersion> = [
    {
        title: "Versions",
        dataIndex: "label",
    },
    {
        title: "Barcode",
        dataIndex: "barCode",
    },
    {
        title: "Description",
        dataIndex: "description",
    },
    {
        title: "Cost price",
        dataIndex: "costPrice",
    },
    {
        title: "Price",
        dataIndex: "price",
    },
    {
        title: "Qty",
        dataIndex: "quantity",
    },
    {
        title: "Temp qty",
        dataIndex: "tempQuantity",
    },
    {
        title: "Image",
        dataIndex: "imageUrl",
        render: (text) =>
            text && (
                <div className="w-10 h-10 p-1">
                    <img className="w-full h-full object-cover" src={text} alt="img" />
                </div>
            ),
    },
];

const ProductDetail: React.FC<IProps> = ({ product, setIsDetail }) => {
    const [data, setData] = useState<IProductVersion[]>([]);
    const [page] = useState<number>(1);
    const [page_size] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const fetchData = async (id: number) => {
            try {
                const res = await MerchantService.productGetById(id, page, page_size);
                setData(res?.quantities);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setIsDetail(false);
            }
        };
        if (loading && product) fetchData(product.productId);
    }, [loading, page, page_size, product, setIsDetail]);

    return (
        <div>
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex items-center justify-between">
                        <h4 className="w-4/5 text-xl font-semibold text-black">{product?.name}</h4>
                        <Button title={"BACK"} onClick={() => setIsDetail(false)} />
                    </div>
                    <div className=" my-5">
                        <h4 className="text-xl font-semibold text-blue-500 mb-2">General Details</h4>
                        <div className="flex">
                            <div className="mr-5 w-40 h-40 flex-shrink-0 flex">
                                <img
                                    className="w-full h-full object-cover"
                                    src={product?.imageUrl || product_default}
                                    alt="img"
                                />
                            </div>
                            <div>
                                <div className="flex items-center mb-1">
                                    <p className="mr-5 w-40 text-xs font-bold">Category</p>
                                    <p>{product.categoryName}</p>
                                </div>
                                <div className="flex items-center mb-1">
                                    <p className="mr-5 w-40 text-xs font-bold">SKU</p>
                                    <p>{product.sku}</p>
                                </div>
                                <div className="flex items-center mb-1">
                                    <p className="mr-5 w-40 text-xs font-bold">Barcode</p>
                                    <p>{product.barCode}</p>
                                </div>
                                <div className="flex items-center mb-1">
                                    <p className="mr-5 w-40 text-xs font-bold">Price</p>
                                    <p>{product.price}</p>
                                </div>
                                <div className="flex items-center mb-1">
                                    <p className="mr-5 w-40 text-xs font-bold">Price</p>
                                    <p>{product.priceRange}</p>
                                </div>
                                <div className="flex items-center mb-1">
                                    <p className="mr-5 w-40 text-xs font-bold">Total items in stock</p>
                                    <p>{product.quantity}</p>
                                </div>
                                <div className="flex items-center mb-1">
                                    <p className="mr-5 w-40 text-xs font-bold">Total items need to order</p>
                                    <p>{product.needToOrder}</p>
                                </div>
                                <div className="flex items-center mb-1">
                                    <p className="mr-5 w-40 text-xs font-bold">Description</p>
                                    <p>{product.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 className="text-xl font-semibold text-blue-500 mb-2">Product Versions</h4>
                    <Table
                        rowKey="id"
                        data={data}
                        columns={columns}
                        count={count}
                        loading={loading}
                        page={page - 1}
                        rowPerPage={page_size}
                    />
                </Spin>
            </div>
        </div>
    );
};

export default ProductDetail;
