import { Checkbox, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditIcon from "assets/svg/edit.js";
import IGiftCardTemplate from "interfaces/IGiftCardTemplate";

interface IProps {
    archiveHandle: (status: number, id: number) => void;
    handleEdit: (data: IGiftCardTemplate) => void;
}

const Columns = ({ handleEdit, archiveHandle }: IProps) => {
    const columns: ColumnsType<IGiftCardTemplate> = [
        {
            title: "Thumbnail",
            dataIndex: "imageUrl",
            render(value, record, index) {
                return (
                    <div
                        className="w-28 h-16 bg-cover bg-no-repeat bg-center"
                        style={{ backgroundImage: `url("${record.imageUrl}")` }}
                    />
                );
            },
        },
        {
            title: "Name",
            dataIndex: "giftCardTemplateName",
        },
        {
            title: "Group",
            dataIndex: "giftCardType",
        },
        {
            title: "Status",
            dataIndex: "isDisabled",
            render(value, record, index) {
                return record.isDisabled === 0 ? "Active" : "Inactive";
            },
        },
        {
            title: "Visible On App",
            dataIndex: "isConsumer",
            width: 140,
            render(value, record, index) {
                return (
                    <div className="text-center">
                        <Checkbox checked={Boolean(record.isConsumer)}></Checkbox>
                    </div>
                );
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            width: 160,
            render(value, record, index) {
                return (
                    <div className="flex">
                        <Tooltip title={record?.isDisabled === 0 ? "Archive" : "Restore"}>
                            <button
                                className={`${
                                    record?.isDisabled === 0 ? "text-black" : "text-pink-500"
                                } embed border border-gray-300 text-xs rounded-lg mr-2`}
                                onClick={() => archiveHandle(record?.isDisabled, record?.giftCardTemplateId)}
                            >
                                <div className="w-[30px] h-[30px] flex items-center justify-center">
                                    <i className="las la-trash-restore text-xl" />
                                </div>
                            </button>
                        </Tooltip>
                        <Tooltip title={"Edit"}>
                            <button
                                onClick={() => handleEdit(record)}
                                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                            >
                                <EditIcon />
                            </button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

    return columns;
};

export default Columns;
