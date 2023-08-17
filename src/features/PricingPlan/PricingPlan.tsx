import { useState, useEffect } from "react";
import { useDebounce } from "usehooks-ts";
import { Select, Spin } from "antd";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import SearchInput from "components/SeachInput";
import Table from "components/Table";
import IPricingPlan from "interfaces/IPricingPlan";
import PricingPlanService from "services/PricingPlanService";
import PlanModal from "./PlanModal";
import Page from "components/Page";
import Message from "components/Message";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Pricing plan",
        path: "/",
    },
];

const STATUS_OPTIONS = [
    { value: -1, label: "All" },
    { value: 0, label: "Active" },
    { value: 1, label: "Inactive" },
];

const PAGE_SIZE_DEFAULT = 10;

const PricingPlan = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<IPricingPlan[]>([]);
    const [page] = useState<number>(1);
    const [page_size] = useState<number>(PAGE_SIZE_DEFAULT);
    const [count, setCount] = useState<number>(0);
    const [status, setStatus] = useState<number>(-1);
    const [open, setOpen] = useState<boolean>(false);
    const [pricingPlan, setPricingPlan] = useState<IPricingPlan | null>(null);
    const debouncedValue = useDebounce<string>(keyword, 300);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await PricingPlanService.get(debouncedValue, status);
                setData(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading, status, debouncedValue]);

    useEffect(() => {
        setLoading(true);
    }, [debouncedValue]);

    const handlePlan = async (data: IPricingPlan, status: number) => {
        try {
            const body: Partial<IPricingPlan> = {
                packageName: data.packageName,
                pricing: data.pricing.toString(),
                isDisabled: status ? 0 : 1,
                staffLimit: data.staffLimit,
            };
            await PricingPlanService.update(data.packageId, body);
            Message.success({ text: "Success" });
            setLoading(true);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (item: IPricingPlan) => {
        setPricingPlan(item);
        setOpen(true);
    };

    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKeyword(value);
    };

    const handleClearKeyword = () => {
        setKeyword("");
    };

    const toggleModal = () => {
        setOpen((preVal) => !preVal);
    };

    const handleClose = (isReload: boolean) => {
        setOpen(false);
        setPricingPlan(null);
        if (isReload) setLoading(true);
    };

    const handleChangeStatus = (status: number) => {
        setStatus(status);
        setLoading(true);
    };

    const handleReset = () => {
        setStatus(-1);
        setKeyword("");
        if (!keyword) {
            setLoading(true);
        }
    };

    return (
        <Page title="Pricing Plan">
            <Breadcrumb title="Pricing Plan" breadcrumbs={BREAD_CRUMBS} />
            {open ? <PlanModal onClose={handleClose} pricingPlan={pricingPlan} /> : null}
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                <Spin spinning={loading}>
                    <div className="flex justify-between">
                        <SearchInput
                            value={keyword}
                            placeholder="Search..."
                            onChange={handleChangeKeyword}
                            onClear={handleClearKeyword}
                        />
                        <Button title="New plan" btnType="ok" onClick={toggleModal} />
                    </div>
                    <div className="mt-2.5">
                        <div className="flex items-center mb-5">
                            <div className="flex items-center">
                                <h3 className="mr-2">Status: </h3>
                                <Select
                                    options={STATUS_OPTIONS}
                                    onChange={handleChangeStatus}
                                    value={status}
                                    size="large"
                                    style={{ width: "150px" }}
                                />
                            </div>
                            <Button title="Reset" btnType="ok" moreClass="ml-5" onClick={handleReset} />
                        </div>
                    </div>
                    <Table
                        rowKey="packageId"
                        data={data}
                        columns={Columns({ handleEdit, handlePlan })}
                        count={count}
                        page={page - 1}
                        rowPerPage={page_size}
                        loading={loading}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default PricingPlan;
