import { Tooltip } from "antd";
import { formatMoney } from "utils";
import type { ColumnsType } from "antd/es/table";
import IGiftCard from "interfaces/IGiftCard";
import moment from "moment";

interface IProps {
    handleExport: (id: number) => void;
}

const Columns = ({ handleExport }: IProps) => {
    const columns: ColumnsType<IGiftCard> = [
        {
            title: "Gift Card Label",
            sorter: true,
            dataIndex: "name",
        },
        {
            title: "Date Created",
            sorter: true,
            dataIndex: "createdDate",
            render: (text, _data) => moment(text).format("MM/DD/YYYY"),
        },
        {
            title: "Value",
            sorter: true,
            dataIndex: "amount",
            render: (text, _data) => formatMoney(text),
        },
        {
            title: "Qty",
            sorter: true,
            dataIndex: "quantity",
        },
        {
            title: "Actions",
            align: "center",
            dataIndex: "",
            render: (_text, _data) => (
                <div className="flex items-center justify-center">
                    <Tooltip title="Export">
                        <button
                            className="embed border border-gray-300 text-xs rounded-lg mr-2 "
                            onClick={(e) => {
                                e.stopPropagation();
                                handleExport(_data.giftCardGeneralId);
                            }}
                        >
                            <div className="w-7.5 h-7.5 flex items-center justify-center">
                                <i className="las la-file-export text-xl" />
                            </div>
                        </button>
                    </Tooltip>
                </div>
            ),
        },
    ];

    return columns;
};

export default Columns;
