import { Dropdown, Menu, Popconfirm, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import EditIcon from "assets/svg/edit.js";
import Avatar from "components/Avatar/Avatar";
import IAdminUser from "interfaces/IAdminUser";
import IDepartment from "interfaces/IDepartment";
import { Fragment } from "react";
import ArchiveIcon from "assets/svg/archive.js";
import RestoreIcon from "assets/svg/restore.js";

interface IProps {
    handleRestoreDepartment: (id: number) => void;
    handleArchiveDepartment: (id: number) => void;
    handleEdit: (value: IDepartment) => void;
}

const Columns = ({ handleArchiveDepartment, handleRestoreDepartment, handleEdit }: IProps) => {
    const showMembers = (text: IAdminUser[], item: IDepartment) => {
        if (text && text.length) {
            return text.map((items: any, index: number) => {
                if (index < 5) {
                    return (
                        <div key={items.waUserId} className="p-1 flex min-w-[28px] min-h-[28px] justify-center">
                            <Avatar src={items.imageUrl} className="rounded-full object-cover object-center h-7 w-7" />
                        </div>
                    );
                }
                return null;
            });
        }
        return null;
    };

    const showMember = (text: IAdminUser[], item: IDepartment) => {
        if (text.length > 5) {
            const menu = (
                <Menu style={{ overflowY: "scroll", maxHeight: "250px", padding: "20px" }}>
                    {text.map((item, index) => {
                        if (index > 4) {
                            return (
                                <Menu.Item key={item?.waUserId + "waUserId"}>
                                    <div className="col-span-6 flex">
                                        <Avatar className="h-8 w-8" src={item?.imageUrl}></Avatar>
                                        <div className="ml-2 text-lg flex items-center">{`${item?.firstName} ${item?.lastName}`}</div>
                                    </div>
                                </Menu.Item>
                            );
                        }
                        return null;
                    })}
                </Menu>
            );
            return (
                <div className="flex min-w-[28px] min-h-[28px] justify-center" style={{ cursor: "pointer" }}>
                    <Dropdown overlay={menu}>
                        <div className="flex items-center text-4.5 text-[#3b82f6]">{`+${text.length - 5}`}</div>
                    </Dropdown>
                </div>
            );
        } else {
            return null;
        }
    };

    const columns: ColumnsType<IDepartment> = [
        {
            title: "Department name",
            dataIndex: "departmentName",
        },
        {
            title: "Members",
            dataIndex: "members",
            render: (text, item) => (
                <div className="flex flex-wrap">
                    {showMembers(text, item)}
                    {showMember(text, item)}
                </div>
            ),
        },
        {
            title: "No. of members",
            dataIndex: "noOfMembers",
        },
        {
            title: "Active",
            dataIndex: "isDisabled",
            render: (text, item) => (item?.isDisabled ? "Inactive" : "Active"),
        },
        {
            title: "Actions",
            dataIndex: "Actions",
            render: (text, data: IDepartment) => (
                <Fragment>
                    {data?.isDisabled ? (
                        <Tooltip title={"Restore"}>
                            <Popconfirm
                                placement="left"
                                title={
                                    <div>
                                        <strong>Restore this Department?</strong>
                                        <div>This Department will appear on the app as well as the related lists.</div>
                                    </div>
                                }
                                onConfirm={() => handleRestoreDepartment(data.departmentId)}
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
                        <Tooltip title={"Archive"}>
                            <Popconfirm
                                placement="left"
                                title={
                                    <div>
                                        <strong>Archive this Department?</strong>
                                        <div>
                                            This Department will not appear on the app. You can restore this product by
                                            clicking the Restore button.
                                        </div>
                                    </div>
                                }
                                icon={
                                    <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                                }
                                onConfirm={() => handleArchiveDepartment(data?.departmentId)}
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
                            onClick={(e) => {
                                handleEdit(data);
                            }}
                        >
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
