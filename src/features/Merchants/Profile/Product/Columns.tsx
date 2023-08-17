import { Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import ArchiveIcon from "assets/svg/archive.js";
import EditIcon from "assets/svg/edit.js";
import RestoreIcon from "assets/svg/restore";
import IProduct from "interfaces/IProduct";

interface IProps {
    handleRestoreProduct: (id: number) => void;
    handleArchiveProduct: (id: number) => void;
    handleDetail: (data: IProduct) => void;
    handleEdit: (data: IProduct) => void;
}

const Columns = ({ handleArchiveProduct, handleEdit, handleRestoreProduct, handleDetail }: IProps) => {
    const columns: ColumnsType<IProduct> = [
        {
            title: "Product Name",
            dataIndex: "name",
            sorter: true,
            onCell: (data) => ({
                onClick: async () => {
                    handleDetail(data);
                },
            }),
        },
        {
            title: "Image",
            dataIndex: "fileId",
            render: (text, item) => item?.imageUrl && <img src={item?.imageUrl} className="w-10" alt="" />,
            onCell: (data) => ({
                onClick: async () => {
                    handleDetail(data);
                },
            }),
        },
        {
            title: "Categories",
            dataIndex: "categoryId",
            sorter: true,
            render: (text, item) => item?.categoryName,
            onCell: (data) => ({
                onClick: async () => {
                    handleDetail(data);
                },
            }),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            sorter: true,
            onCell: (data) => ({
                onClick: async () => {
                    handleDetail(data);
                },
            }),
        },
        {
            title: "Price",
            dataIndex: "price",
            sorter: true,
            render: (text, item) => "$" + text,
            onCell: (data) => ({
                onClick: async () => {
                    handleDetail(data);
                },
            }),
        },
        {
            title: "Status",
            dataIndex: "isDisabled",
            sorter: true,
            render: (text, item) => (item?.isDisabled ? "Inactive" : "Active"),
            onCell: (data) => ({
                onClick: async () => {
                    handleDetail(data);
                },
            }),
        },
        {
            title: "Actions",
            dataIndex: "",
            width: 120,
            render: (text, data) => (
                <>
                    {data?.isDisabled ? (
                        <Tooltip title={"Restore"}>
                            <Popconfirm
                                placement="left"
                                title={
                                    <div>
                                        <strong>Restore this Product?</strong>
                                        <div>This product will appear on the app as well as the related lists.</div>
                                    </div>
                                }
                                icon={
                                    <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                                }
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    handleRestoreProduct(data?.productId);
                                }}
                                okText={"Ok"}
                                cancelText={"Cancel"}
                            >
                                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                    <RestoreIcon />
                                </button>
                            </Popconfirm>
                        </Tooltip>
                    ) : null}
                    {!data?.isDisabled ? (
                        <Tooltip title={"Archive"} zIndex={1000000}>
                            <Popconfirm
                                placement="left"
                                title={
                                    <div>
                                        <strong>Archive this Product?</strong>
                                        <div>
                                            This product will not appear on the app. You can restore this product by
                                            clicking the Restore button.
                                        </div>
                                    </div>
                                }
                                icon={
                                    <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                                }
                                onConfirm={(e) => {
                                    e?.stopPropagation();
                                    handleArchiveProduct(data?.productId);
                                }}
                                okText={"Ok"}
                                cancelText={"Cancel"}
                            >
                                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                    <ArchiveIcon />
                                </button>
                            </Popconfirm>
                        </Tooltip>
                    ) : null}
                    <Tooltip title={"Edit"}>
                        <button
                            className="embed border border-gray-300 text-xs rounded-lg mr-2"
                            onClick={() => {
                                handleEdit(data);
                            }}
                        >
                            <EditIcon />
                        </button>
                    </Tooltip>
                </>
            ),
        },
    ];

    return columns;
};

export default Columns;
