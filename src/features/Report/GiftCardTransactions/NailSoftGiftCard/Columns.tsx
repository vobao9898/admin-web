import { formatMoney } from "utils";
import type { ColumnsType } from "antd/es/table";
import IGiftCardSoldDetail from "interfaces/IGiftCardSoldDetail";
import moment from "moment";

const Columns = () => {
    const columns: ColumnsType<IGiftCardSoldDetail> = [
        {
            title: "User name",
            dataIndex: "userName",
            sorter: true,
        },
        {
            title: "Phone number",
            dataIndex: "phone",
            sorter: true,
        },
        {
            title: "Card number",
            dataIndex: "cardNumber",
            sorter: true,
        },
        {
            title: "Date/Time",
            dataIndex: "dateTime",
            sorter: true,
            render: (text, item) => {
                return item && item.dateTime ? moment(item.dateTime).format("MM/DD/YYYY hh:mm A") : "";
            },
        },
        {
            title: "Merchant",
            dataIndex: "merchant",
            sorter: true,
        },
        {
            title: "Methods",
            dataIndex: "methods",
            sorter: true,
        },
        {
            title: "Value",
            dataIndex: "value",
            sorter: true,
            render(value, record, index) {
                return <p>{formatMoney(record.value)}</p>;
            },
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            sorter: true,
            render: (text, item) => {
                return <p>{formatMoney(item?.totalAmount)}</p>;
            },
        },
    ];

    return columns;
};

export default Columns;
