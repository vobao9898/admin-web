import type { ColumnsType } from "antd/es/table";
import ILogs from "interfaces/ILogs";
import moment from "moment";

const Columns = () => {
    const columns: ColumnsType<ILogs> = [
        {
            title: "Server Time",
            dataIndex: "createdDate",
            render: (content, record) => {
                const date = new Date(content);
                return moment(date + " UTC").format("MM/DD/YYYY hh:mm A");
            },
        },
        {
            title: "Merchant Request Status",
            dataIndex: "status",
            render: (content, record) => {
                if (record?.isApproved === 1) return "Approved";
                else if (record?.isRejected === 1) {
                    return (
                        <>
                            Rejected
                            <div>
                                <strong>Reason: </strong> {record?.reasonReject}
                            </div>
                        </>
                    );
                } else return "Handling";
            },
        },
        {
            title: "Merchant Request From",
            dataIndex: "merchant",
            render: (content) => {
                return content?.email;
            },
        },
        {
            title: "User",
            dataIndex: "adminUser",
            render: (content) => {
                return `${content?.firstName} ${content?.lastName}`;
            },
        },
    ];

    return columns;
};

export default Columns;
