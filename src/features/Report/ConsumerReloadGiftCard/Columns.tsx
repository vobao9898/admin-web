import { formatMoney } from "utils";
import type { ColumnsType } from "antd/es/table";
import IConsumerReloadGiftCard from "interfaces/IConsumerReloadGiftCard";
import moment from "moment";

const Columns = () => {
    const columns: ColumnsType<IConsumerReloadGiftCard> = [
        {
            title: "Date/Time",
            dataIndex: "createDate",
            render: (text) => {
                return moment(text).format("MM/DD/YYYY hh:mm A");
            },
        },
        {
            title: "Sender",
            dataIndex: "senderUserName",
        },
        {
            title: "Receiver",
            dataIndex: "receiveUserName",
        },
        {
            title: "Type",
            dataIndex: "type",
            render: (text) => "Gift Card",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: (text) => <p className="capitalize">{text}</p>,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            render: (text) => <p>{formatMoney(text)}</p>,
        },
    ];

    return columns;
};

export default Columns;
