import { Checkbox, Tooltip } from "antd";
import { formatMoney } from "utils";
import type { ColumnsType } from "antd/es/table";
import IGiftCardGeneral from "interfaces/IGiftCardGeneral";
import moment from "moment";

interface IProps {
    onShowInfo: (record: IGiftCardGeneral) => void;
}

const Columns = ({ onShowInfo }: IProps) => {
    const columns: ColumnsType<IGiftCardGeneral> = [
        {
            title: "ID",
            sorter: true,
            dataIndex: "giftCardId",
        },
        {
            title: "Serial",
            sorter: true,
            dataIndex: "serialNumber",
        },
        {
            title: "Created On",
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
            title: "Is Active",
            dataIndex: "isActive",
            align: "center",
            render: (text, _data) => (
                <div className="flex items-center justify-center">
                    <Checkbox checked={text} />
                </div>
            ),
        },
        {
            title: "Actions",
            dataIndex: "",
            align: "center",
            render: (_text, record) => (
                <div className="flex items-center justify-center">
                    <Tooltip title="Info">
                        <button
                            className="embed border border-gray-300 text-xs rounded-lg mr-2 "
                            onClick={() => onShowInfo(record)}
                        >
                            <div className="w-[30px] h-[30px] flex items-center justify-center">
                                <i className="las la-info-circle text-xl" />
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
