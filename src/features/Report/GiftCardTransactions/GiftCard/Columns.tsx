import type { ColumnsType } from "antd/es/table";
import { formatMoney } from "utils";
import IGiftCardSoldDetail from "interfaces/IGiftCardSoldDetail";
import moment from "moment";

const Columns = () => {
    const columns: ColumnsType<IGiftCardSoldDetail> = [
        {
            title: "Serial",
            sorter: true,
            dataIndex: "serialNumber",
        },
        {
            title: "Date/Time",
            sorter: true,
            dataIndex: "dateTime",
            render: (text, item) => {
                return item && item.dateTime ? moment(item.dateTime).format("MM/DD/YYYY hh:mm A") : "";
            },
        },
        {
            title: "Merchant",
            sorter: true,
            dataIndex: "merchant",
        },
        {
            title: "Methods",
            sorter: true,
            dataIndex: "methods",
        },
        {
            title: "Value",
            sorter: true,
            dataIndex: "value",
            render: (text) => <p>{formatMoney(text)}</p>,
        },
        {
            title: "Total Amount",
            sorter: true,
            dataIndex: "totalAmount",
            render: (text, item) => {
                return <p>{formatMoney(item?.totalAmount)}</p>;
            },
        },
    ];

    return columns;
};

export default Columns;
