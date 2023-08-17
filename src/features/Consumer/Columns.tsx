import type { ColumnsType } from "antd/es/table";
import IConsumer from "interfaces/IConsumer";
import moment from "moment";
import { formatMoney, getCodeAndPhoneNumber, maskPhone } from "utils";

const Columns = () => {
    const columns: ColumnsType<IConsumer> = [
        {
            title: "NailSoft ID",
            dataIndex: "accountId",
            sorter: true,
        },
        {
            title: "First Name",
            sorter: true,
            dataIndex: "firstName",
        },
        {
            title: "Last Name",
            sorter: true,
            dataIndex: "lastName",
        },
        {
            title: "Phone Number",
            sorter: true,
            dataIndex: "phone",
            render(value, record, index) {
                const [codePhone, phoneNumber] = getCodeAndPhoneNumber(record?.phone);
                return <span>{maskPhone(codePhone, phoneNumber)}</span>;
            },
        },
        {
            title: "Email",
            sorter: true,
            dataIndex: "email",
        },
        {
            title: "Blance",
            sorter: true,
            dataIndex: "credit",
            render(value, record, index) {
                return <span>{formatMoney(record.credit)}</span>;
            },
        },
        {
            title: "Money Spent/Daily",
            sorter: true,
            dataIndex: "totalAmount",
            render(value, record, index) {
                return <span>{formatMoney(record.totalAmount)}</span>;
            },
        },
        {
            title: "Verify",
            sorter: true,
            dataIndex: "isVerified",
            render(value, record, index) {
                return record && record.isVerified === 1 && <i className="las la-check-circle la-2x" />;
            },
        },
        {
            title: "Last Active",
            sorter: true,
            dataIndex: "lastActivity",
            render(value, record, index) {
                return record && record.lastActivity && moment(record.lastActivity).format("MM/DD/YYYY h:mm:ss A");
            },
        },
    ];

    return columns;
};

export default Columns;
