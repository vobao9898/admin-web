import { Table as AntTable } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import Pagination from "components/Pagination/Pagination";
import { SorterResult } from "antd/es/table/interface";
import type { ResizeCallbackData } from "react-resizable";
import { Resizable } from "react-resizable";
import { Empty } from "antd";

import "./index.css";

interface IProps<T> {
    columns: ColumnsType<T>;
    data: T[];
    rowKey?: string;
    pageCount?: number;
    page: number;
    rowPerPage: number;
    count: number;
    loading?: boolean;
    renderSummary?: (data: readonly T[]) => React.ReactNode;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
    onChange?: (sorter: SorterResult<T> | SorterResult<T>[]) => void;
    onRowClick?: (record: T) => void;
    handleRowClassName?: (record: T) => string;
}

const ResizableTitle = (
    props: React.HTMLAttributes<any> & {
        onResize: (e: React.SyntheticEvent<Element>, data: ResizeCallbackData) => void;
        width: number;
    }
) => {
    const { onResize, width, ...restProps } = props;

    if (!width) {
        return <th {...restProps} />;
    }

    return (
        <Resizable
            width={width}
            height={0}
            handle={
                <span
                    className="react-resizable-handle"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                />
            }
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    );
};

const Table = <T extends object>({
    columns,
    data,
    rowKey,
    pageCount,
    count,
    page,
    rowPerPage,
    loading = false,
    onPageChange,
    onPerPageChange,
    onChange,
    onRowClick,
    renderSummary,
    handleRowClassName,
}: IProps<T>) => {
    const handleChange: TableProps<T>["onChange"] = (pagination, filters, sorter, extra) => {
        if (onChange) {
            onChange(sorter);
        }
    };

    const handlePageChange = (page: number) => {
        if (onPageChange) onPageChange(page);
    };

    const handlePerPageChange = (perPage: number) => {
        if (onPerPageChange) onPerPageChange(perPage);
    };

    return (
        <div>
            <AntTable<T>
                rowKey={rowKey}
                onRow={(record) => {
                    return {
                        onClick: (event) => {
                            if (onRowClick) onRowClick(record);
                        },
                    };
                }}
                components={{
                    header: {
                        cell: ResizableTitle,
                    },
                }}
                locale={{
                    emptyText: loading ? <p>Loading...</p> : <Empty />,
                }}
                scroll={{ x: "100%" }}
                bordered
                columns={columns}
                dataSource={data}
                onChange={handleChange}
                pagination={false}
                summary={renderSummary}
                rowClassName={(record: T, index: number) => {
                    return `${index % 2 !== 0 ? "bg-gray-50" : ""} ${
                        handleRowClassName ? handleRowClassName(record) : ""
                    }`;
                }}
            />
            <div className="mt-3">
                {count !== 0 && (
                    <Pagination
                        count={count}
                        pageCount={Math.ceil(count / rowPerPage)}
                        page={page}
                        rowPerPage={rowPerPage}
                        onPageChange={handlePageChange}
                        onRowPerPageChange={handlePerPageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Table;
