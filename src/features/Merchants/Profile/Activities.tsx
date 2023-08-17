import { Spin } from "antd";
import { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import Table from "components/Table";
import IActivities from "interfaces/IActivities";
import MerchantService from "services/MerchantService";
import moment from "moment";

const PAGE_SIZE_DEFAULT = 10;

interface IProps {
    merchantId: number;
}

const columns: ColumnsType<IActivities> = [
    {
        title: "Date/Time",
        dataIndex: "createDate",
        render(value) {
            return moment(value).format("MM/DD/YYYY hh:mm A");
        },
    },
    {
        title: "Activity",
        dataIndex: "action",
    },
];

const Activities: React.FC<IProps> = ({ merchantId }) => {
    const [data, setData] = useState<IActivities[]>([]);
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const { data, count } = await MerchantService.getActivities(merchantId, page, page_size);
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading && merchantId) fetchData(merchantId);
    }, [loading, page, page_size, merchantId]);

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    return (
        <div className="p-4 bg-gray-50 shadow rounded-xl">
            <Spin spinning={loading}>
                <Table
                    rowKey="merchantActivityId"
                    data={data}
                    columns={columns}
                    count={count}
                    loading={loading}
                    page={page - 1}
                    rowPerPage={page_size}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </Spin>
        </div>
    );
};

export default Activities;
