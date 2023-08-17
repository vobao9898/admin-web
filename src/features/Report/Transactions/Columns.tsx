import moment from "moment";
import type { ColumnsType } from "antd/es/table";
import ITransaction from "interfaces/ITransaction";
import classNames from "classnames";
import RefundIcon from "assets/images/refund-icon.png";

interface IProps {
    loading: boolean;
    handleRefund: (id: number) => void;
}

const Columns = ({ loading, handleRefund }: IProps) => {
    const checkCanRefund = (item: any) => {
        if (item && item.isRefund === false && item.status === "Success" && item.title === "Add money to NailSoft") {
            return true;
        }
        return false;
    };

    const columns: ColumnsType<ITransaction> = [
        {
            title: "Date/Time",
            dataIndex: "createDate",
            sorter: true,
            render: (text) => {
                return moment(text).format("MM/DD/YYYY hh:mm A");
            },
        },
        {
            title: "ID",
            dataIndex: "paymentTransactionId",
            sorter: true,
        },
        {
            title: "Invoice Number",
            dataIndex: "invoiceNumber",
        },
        {
            title: "Method",
            dataIndex: "title",
            sorter: true,
        },
        {
            title: "Original Account",
            dataIndex: "name_on_card",
            render: (text, item: ITransaction) => (
                <div className="w-36">
                    <p>{item.paymentData?.name_on_card}</p>
                </div>
            ),
        },
        {
            title: "Card/Last 4 Digit",
            dataIndex: "card_type",
            width: 200,
            render: (text, item: ITransaction) => {
                if (!item?.paymentData?.card_type) {
                    return "";
                }
                return (
                    <div className="min-w-[200px]">
                        <p>{item?.paymentData?.card_type}</p>
                        <p>**** **** **** {item?.paymentData?.card_number}</p>
                    </div>
                );
            },
        },
        {
            title: "Merchant Account",
            dataIndex: "merchantAccount",
            render: (text, item: ITransaction) => item?.receiver?.name,
        },
        {
            title: "Amount",
            dataIndex: "amount",
            sorter: true,
        },
        {
            title: "IP",
            dataIndex: "ip",
            sorter: true,
        },
        {
            title: "Status",
            dataIndex: "status",
            sorter: true,
            render: (text) => <p className="capitalize">{text}</p>,
        },
        {
            title: "Refund",
            dataIndex: "refund",
            width: 120,
            render: (text, item: ITransaction) => {
                if (!item) return "";

                if (!(item && item.paymentTransactionId)) {
                    return "";
                }

                return (
                    <button
                        onClick={() => {
                            handleRefund(item.paymentTransactionId);
                        }}
                        disabled={loading || checkCanRefund(item) === false}
                        className={classNames(
                            "min-w-[100px] flex flex-row items-center px-4 py-0.5 flex-shrink-0 text-sm font-medium rounded-md border duration-150 text-white bg-blue-500 border-blue-500",
                            {
                                "opacity-50 cursor-not-allowed": checkCanRefund(item) === false,
                            }
                        )}
                    >
                        <img width={"auto"} height={12} className="w-auto h-3 mr-1.5" src={RefundIcon} alt="" />
                        <span className="text-3 leading-5">Refund</span>
                    </button>
                );
            },
        },
    ];

    return columns;
};

export default Columns;
