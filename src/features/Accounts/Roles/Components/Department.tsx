import { Spin } from "antd";
import Button from "components/Button";
import Table from "components/Table";
import IDepartment from "interfaces/IDepartment";

interface IProps {
    loading: boolean;
    dataDepartment: IDepartment[];
    columns: any;
    page: number;
    page_size: number;
    handlePageChange: (page: number) => void;
    handlePerPageChange: (perPage: number) => void;
    toggleOpenModal: () => void;
}
const Department: React.FC<IProps> = ({
    loading,
    dataDepartment,
    columns,
    page,
    page_size,
    handlePageChange,
    handlePerPageChange,
    toggleOpenModal,
}) => {
    return (
        <div className="p-4 bg-gray-50 shadow rounded-xl">
            <Spin spinning={loading}>
                <div className="flex justify-between mb-4">
                    <div className="font-bold text-lg text-black">Department</div>
                    <Button onClick={toggleOpenModal} title="Add Department" btnType="ok" />
                </div>
                <Table
                    rowKey="departmentId"
                    data={dataDepartment && dataDepartment}
                    columns={columns}
                    count={0}
                    pageCount={0}
                    page={page - 1}
                    rowPerPage={page_size}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            </Spin>
        </div>
    );
};

export default Department;
