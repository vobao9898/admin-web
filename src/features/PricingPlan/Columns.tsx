import { Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditIcon from "assets/svg/edit.js";
import ArchiveIcon from "assets/svg/archive";
import RestoreIcon from "assets/svg/restore";
import IPricingPlan from "interfaces/IPricingPlan";

interface IProps {
    handlePlan: (data: IPricingPlan, id: number) => void;
    handleEdit: (data: IPricingPlan) => void;
}

const Columns = ({ handleEdit, handlePlan }: IProps) => {
    const columns: ColumnsType<IPricingPlan> = [
        {
            title: "ID",
            dataIndex: "packageId",
            render(_value, record, _index) {
                return `#${record.packageId}`;
            },
        },
        {
            title: "Title",
            dataIndex: "packageName",
            render(_value, record, _index) {
                return `Pricing Package ${record.packageId}`;
            },
        },
        {
            title: "Subtitle",
            dataIndex: "packageName",
        },
        {
            title: "Pricing",
            dataIndex: "pricing",
            render(_value, record, _index) {
                return `$${record.pricing}`;
            },
        },
        {
            title: "Status",
            dataIndex: "isDisabled",
            render(_value, record, _index) {
                return record.isDisabled === 0 ? "Active" : "Inactive";
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            render(_value, record, _index) {
                return (
                    <>
                        <Tooltip title={record.isDisabled ? "Restore" : "Archive"}>
                            <Popconfirm
                                placement="left"
                                title={
                                    <div className="ml-1">
                                        <strong>
                                            {record.isDisabled
                                                ? "Restore this Pricing Plan?"
                                                : "Archive this Pricing Plan?"}
                                        </strong>
                                        <div>
                                            {record.isDisabled
                                                ? "This Pricing Plan will appear on the app as well as the related lists."
                                                : "This Pricing Plan will not appear on the app. You can restore this Pricing Plan by clicking the Restore button."}
                                        </div>
                                    </div>
                                }
                                icon={<i className="las la-question-circle text-2xl text-yellow-500" />}
                                okText="Ok"
                                onConfirm={() => handlePlan(record, record.isDisabled)}
                                cancelText="Cancel"
                            >
                                <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                                    {record.isDisabled ? <RestoreIcon /> : <ArchiveIcon />}
                                </button>
                            </Popconfirm>
                        </Tooltip>
                        <Tooltip title="Edit">
                            <button
                                onClick={() => handleEdit(record)}
                                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                            >
                                <EditIcon />
                            </button>
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    return columns;
};

export default Columns;
