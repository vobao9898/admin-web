import React from "react";
import { Select } from "antd";
import ReactPaginate from "react-paginate";
import "./index.css";

interface IProps {
    count: number;
    pageCount: number;
    page: number;
    rowPerPage: number;
    onPageChange: (page: number) => void;
    onRowPerPageChange: (perPage: number) => void;
}

const Pagination: React.FC<IProps> = ({ count, pageCount, page, rowPerPage, onPageChange, onRowPerPageChange }) => {
    const handlePageChange = (page: number) => {
        onPageChange(page + 1);
    };

    const getTotalTitle = (count: number, page: number, rowPerPage: number) => {
        const start = page * rowPerPage + 1;
        const end = (page + 1) * rowPerPage;

        if (start > end || count === 0 || start > count) return "";

        if (count < end) {
            return `${start} - ${count} of ${count} items`;
        }
        return `${start} - ${end} of ${count} items`;
    };

    if (count === 0) return null;

    const handleRowPerPageChange = (value: number) => {
        onRowPerPageChange(value);
    };

    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <Select onChange={(value) => handleRowPerPageChange(value)} value={rowPerPage} size="large">
                    <Select.Option value={10}>10 / page</Select.Option>
                    <Select.Option value={20}>20 / page</Select.Option>
                    <Select.Option value={30}>30 / page</Select.Option>
                    <Select.Option value={40}>40 / page</Select.Option>
                </Select>
                <p>{getTotalTitle(count, page, rowPerPage)}</p>
            </div>
            <ReactPaginate
                previousLabel={<i className="las la-angle-left text-sm px-1.5" />}
                nextLabel={<i className="las la-angle-right text-sm px-1.5" />}
                pageCount={pageCount}
                forcePage={page}
                onPageChange={({ selected }) => {
                    handlePageChange(selected);
                }}
                pageClassName="text-center duration-300 transition-all py-1 px-2.5 text-sm font-medium leading-normal text-blue-700 hover:text-blue-500"
                containerClassName={
                    "items-center right flex justify-center border border-gray-100 py-1 px-3 rounded-xl bg-white"
                }
                disabledClassName={"cursor-not-allowed"}
                activeClassName={
                    "pagination__link-active text-center duration-300 transition-all py-1 px-2.5 text-sm font-medium leading-normal bg-blue-500 rounded-full text-white hover:text-white"
                }
            />
        </div>
    );
};

export default Pagination;
