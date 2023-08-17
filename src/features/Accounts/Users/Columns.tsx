import { getCodeAndPhoneNumber, maskPhone } from "utils";
import type { ColumnsType } from "antd/es/table";
import Avatar from "components/Avatar/Avatar";
import IUser from "interfaces/IUser";

const Columns = () => {
    const columns: ColumnsType<IUser> = [
        {
            title: "ID",
            dataIndex: "waUserId",
        },
        {
            title: "",
            dataIndex: "avatar",
            width: 60,
            render(_value, record, _index) {
                return <Avatar className="h-7 w-7" src={record.imageUrl} />;
            },
        },
        {
            title: "Full name",
            dataIndex: "fullName",
            render(_value, record, _index) {
                return `${record.firstName} ${record.lastName}`;
            },
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            render(_value, record, _index) {
                const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(record.phone);
                return <span>{maskPhone(codeMobilePhone, mobilePhoneNumber)}</span>;
            },
        },
        {
            title: "Role",
            dataIndex: "roleName",
        },
        {
            title: "Status",
            dataIndex: "isDisabled",
            render(_value, record, _index) {
                return record.isDisabled === 0 ? "Active" : "Inactive";
            },
        },
    ];

    return columns;
};

export default Columns;
