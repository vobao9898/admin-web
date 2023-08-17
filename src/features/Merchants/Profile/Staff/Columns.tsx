import { Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import ArchiveIcon from "assets/svg/archive.js";
import EditIcon from "assets/svg/edit.js";
import RestoreIcon from "assets/svg/restore";
import IStaff from "interfaces/IStaff";
import { Fragment } from "react";
import { getCodeAndPhoneNumber, maskPhone } from "utils";

interface IProps {
    handleRestore: (id: number) => void;
    handleArchive: (id: number) => void;
}

const Columns = ({ handleArchive, handleRestore }: IProps) => {
    const columns: ColumnsType<IStaff> = [
        {
            title: "Staff ID",
            dataIndex: "staffId",
            sorter: true,
        },
        {
            title: "Name",
            dataIndex: "name",
            sorter: true,
            render: (text, item) => item?.firstName + " " + (item?.lastName || ""),
        },
        {
            title: "Display Name",
            dataIndex: "displayName",
            sorter: true,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            sorter: true,
            render(value, record, index) {
                const [codePhone, phoneNumber] = getCodeAndPhoneNumber(record.phone);
                return <span>{phoneNumber ? maskPhone(codePhone, phoneNumber) : ""}</span>;
            },
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: true,
        },
        {
            title: "Role",
            dataIndex: "roleName",
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
                <Fragment>
                    <Tooltip title={"Restore"}>
                        <Popconfirm
                            placement="left"
                            title={
                                <div>
                                    <strong>{data?.isDisabled ? "Restore this staff?" : "Archive this staff?"}</strong>
                                    <div>
                                        {data?.isDisabled
                                            ? "This staff will appear on the app as well as the related lists."
                                            : "This staff will not appear on the app. You can restore this staff by clicking the Restore button."}
                                    </div>
                                </div>
                            }
                            icon={
                                <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                            }
                            onConfirm={(event) => {
                                event?.stopPropagation();
                                if (data?.isDisabled) {
                                    handleRestore(data?.staffId);
                                } else {
                                    handleArchive(data?.staffId);
                                }
                            }}
                            okText={"Ok"}
                            cancelText={"Cancel"}
                            onCancel={(event) => {
                                event?.stopPropagation();
                            }}
                        >
                            <button
                                onClick={(event) => {
                                    event?.stopPropagation();
                                }}
                                className="embed border border-gray-300 text-xs rounded-lg mr-2"
                            >
                                {data?.isDisabled ? <RestoreIcon /> : <ArchiveIcon />}
                            </button>
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title={"Edit"}>
                        <button className="embed border border-gray-300 text-xs rounded-lg mr-2">
                            <EditIcon />
                        </button>
                    </Tooltip>
                </Fragment>
            ),
        },
    ];

    return columns;
};

export default Columns;
