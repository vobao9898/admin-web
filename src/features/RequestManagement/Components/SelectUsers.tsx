import React, { useEffect, useState } from "react";
import { Select } from "antd";
import UserService from "services/UserService";

interface IProps {
    value: number;
    changeStatus: (value: number) => void;
}

const DEFAULT_OPTIONS = [{ value: 0, label: "All" }];

const SelectUsers: React.FC<IProps> = ({ value, changeStatus }) => {
    const [page, setPage] = useState<number>(1);
    const [pageSize] = useState<number>(100);
    const [loading, setLoading] = useState<boolean>(true);
    const [count, setCount] = useState<number>(0);
    const [users, setUsers] = useState(DEFAULT_OPTIONS);

    useEffect(() => {
        const fetchData = async (page: number, page_size: number) => {
            try {
                const { data, count } = await UserService.get(page, page_size);
                if (data && data.length > 0) {
                    const newUsers = data.map((item) => {
                        return { value: item?.waUserId, label: `${item?.firstName} ${item?.lastName}` };
                    });
                    setUsers((preVal) => preVal.concat(newUsers));
                }
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) {
            fetchData(page, pageSize);
        }
    }, [page, pageSize, loading]);

    const handleScroll = async (event: React.UIEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const distance = target.scrollHeight - target.scrollTop - target.offsetHeight;
        if (distance === 0 && !loading && users.length - 1 < count) {
            setPage((page) => page + 1);
            setLoading(true);
            target.scrollTo(0, target.scrollHeight);
        }
    };

    return (
        <Select
            size="large"
            showSearch
            optionFilterProp="label"
            style={{ width: "150px" }}
            value={value}
            loading={loading}
            onPopupScroll={handleScroll}
            getPopupContainer={(trigger) => trigger.parentNode}
            onChange={changeStatus}
            filterOption={(input, option) =>
                (option?.label ?? "").toString().toLowerCase().includes(input.toLowerCase())
            }
            options={users}
        >
            {loading && <Select.Option>Loading...</Select.Option>}
        </Select>
    );
};

export default SelectUsers;
