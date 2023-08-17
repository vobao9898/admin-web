import { Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import ArchiveIcon from "assets/svg/archive.js";
import EditIcon from "assets/svg/edit.js";
import RemoveIcon from "assets/svg/remove.js";
import RestoreIcon from "assets/svg/restore";
import IService from "interfaces/IService";

interface IProps {
    handleRestore: (id: number) => void;
    handleArchive: (id: number) => void;
    handleDelete: (id: number) => void;
    handleEdit: (data: IService) => void;
}

const Columns = ({ handleArchive, handleEdit, handleRestore, handleDelete }: IProps) => {
    const columns: ColumnsType<IService> = [
        {
            title: "Service Name",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Image",
            dataIndex: "Image",
            render: (text, item) => item?.imageUrl && <img src={item?.imageUrl} className="w-6" alt="" />,
        },
        {
            title: "Categories",
            dataIndex: "categoryId",
            sorter: true,
            render: (text, item) => <span>{item.categoryName}</span>,
        },
        {
            title: "Duration",
            dataIndex: "duration",
            sorter: true,
        },
        {
            title: "Price",
            dataIndex: "price",
            sorter: true,
        },
        {
            title: "Status",
            dataIndex: "isDisabled",
            sorter: true,
            render: (text) => (text === 0 ? "Active" : "Inactive"),
        },
        {
            title: "Action",
            dataIndex: "",
            width: 150,
            render: (text, data) => (
                <>
                    <Tooltip title={data?.isDisabled ? "Restore" : "Archive"}>
                        <Popconfirm
                            placement="left"
                            title={
                                <div>
                                    <strong>
                                        {data?.isDisabled ? "Restore this service?" : "Archive this service?"}
                                    </strong>
                                    <div>
                                        {data?.isDisabled
                                            ? "This service will appear on the app as well as the related lists."
                                            : "This service will not appear on the app. You can restore this service by clicking the Restore button."}
                                    </div>
                                </div>
                            }
                            icon={
                                <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                            }
                            onConfirm={() => {
                                if (data?.isDisabled) {
                                    handleRestore(data?.serviceId);
                                } else {
                                    handleArchive(data?.serviceId);
                                }
                            }}
                            okText={"Ok"}
                            cancelText={"Cancel"}
                        >
                            <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                {data?.isDisabled ? <RestoreIcon /> : <ArchiveIcon />}
                            </button>
                        </Popconfirm>
                    </Tooltip>

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
                    <Tooltip title={"Delete"}>
                        <Popconfirm
                            placement="left"
                            title={"Are you sure want delete ?"}
                            icon={
                                <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                            }
                            onConfirm={() => handleDelete(data?.serviceId)}
                            okText={"Ok"}
                            cancelText={"Cancel"}
                        >
                            <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                <RemoveIcon />
                            </button>
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
    ];

    return columns;
};

export default Columns;
