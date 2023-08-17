import { Popover, Switch } from "antd";
import type { ColumnsType } from "antd/es/table";
import IMarketPlace from "interfaces/IMarketPlace";

const Columns = () => {
    const columns: ColumnsType<IMarketPlace> = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "URL",
            dataIndex: "link",
            render(value, record, index) {
                return (
                    <p className="text-blue-500 hover:">
                        {value && value.length < 50 ? (
                            value
                        ) : (
                            <span>
                                {value.substr(0, 40)}
                                <Popover trigger="hover" overlayClassName="table-tooltip" content={value}>
                                    <i className="las la-lg la-info-circle link-click" />
                                </Popover>
                            </span>
                        )}
                    </p>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "isDisabled",
            render(value, record, index) {
                return record.isDisabled === 0 ? "Active" : "Inactive";
            },
        },
        {
            title: "On Top",
            dataIndex: "onTop",
            render(value, record, index) {
                return <Switch defaultChecked={record.onTop} />;
            },
        },
        {
            title: "Image",
            dataIndex: "fileURL",
            render(value, record, index) {
                return (
                    <div
                        className="w-20 h-20 bg-center bg-no-repeat bg-cover"
                        style={{ backgroundImage: `url("${record.fileURL}")` }}
                    />
                );
            },
        },
    ];

    return columns;
};

export default Columns;
