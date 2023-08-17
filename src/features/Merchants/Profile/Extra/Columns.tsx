import { Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import ArchiveIcon from "assets/svg/archive.js";
import EditIcon from "assets/svg/edit.js";
import RemoveIcon from "assets/svg/remove.js";
import RestoreIcon from "assets/svg/restore";
import IExtra from "interfaces/IExtra";

interface IProps {
    handleRestore: (id: number) => void;
    handleArchive: (id: number) => void;
    handleDelete: (id: number) => void;
    handleEdit: (data: IExtra) => void;
}

const Columns = ({ handleArchive, handleEdit, handleRestore, handleDelete }: IProps) => {
    const columns: ColumnsType<IExtra> = [
        {
            title: "Extra Name",
            dataIndex: "name",
            sorter: true,
        },
        {
            title: "Price",
            dataIndex: "price",
            render: (text, item) => "$ " + text,
            sorter: true,
        },
        {
            title: "Duration",
            dataIndex: "duration",
            render: (text, item) => text + " Mins",
            sorter: true,
        },
        {
            title: "Status",
            dataIndex: "isDisabled",
            render: (text, item) => (item?.isDisabled ? "Inactive" : "Active"),
            sorter: true,
        },
        {
            title: "Image",
            dataIndex: "fileId",
            render: (text, item) =>
                text ? <img src={item?.imageUrl} className="w-10" key={item?.extraId} alt="" /> : null,
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
                                    <strong>{data?.isDisabled ? "Restore this Extra?" : "Archive this Extra?"}</strong>
                                    <div>
                                        {data?.isDisabled
                                            ? "This extra will appear on the app as well as the related lists."
                                            : " This extra will not appear on the app. You can restore this extra by clicking the Restore button."}
                                    </div>
                                </div>
                            }
                            icon={
                                <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                            }
                            onConfirm={() => {
                                if (data?.isDisabled) {
                                    handleRestore(data?.extraId);
                                } else {
                                    handleArchive(data?.extraId);
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
                            onConfirm={() => handleDelete(data?.extraId)}
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
