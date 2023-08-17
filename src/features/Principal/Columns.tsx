import type { ColumnsType } from "antd/es/table";
import IPrincipal from "interfaces/IPrincipal";
import { getCodeAndPhoneNumber, maskPhone } from "utils";

const Columns = () => {
    const columns: ColumnsType<IPrincipal> = [
        {
            title: "Name",
            dataIndex: "firstName",
            sorter: true,
            render(value, record, index) {
                return <p>{`${record.firstName} ${record.lastName}`}</p>;
            },
        },
        {
            title: "Title/Position",
            sorter: true,
            dataIndex: "title",
        },
        {
            title: "Mobile Phone",
            sorter: true,
            dataIndex: "mobilePhone",
            render(value, record, index) {
                const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(record.mobilePhone);
                return <span>{maskPhone(codeMobilePhone, mobilePhoneNumber)}</span>;
            },
        },
        {
            title: "Email",
            sorter: true,
            dataIndex: "email",
        },
        {
            title: "Address",
            sorter: true,
            dataIndex: "address",
        },
        {
            title: "Merchants",
            sorter: true,
            dataIndex: "merchants",
        },
    ];
    

    return columns;
};

export default Columns;
