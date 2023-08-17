import { Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import MerchantService from "services/MerchantService";
import IStaff from "interfaces/IStaff";
import General from "./General";
import WorkingTime from "./WorkingTime";
import Salary from "./Salary";
import License from "./License";
import Services from "./Services";
import ICategory from "interfaces/ICategory";
import IService from "interfaces/IService";

interface IProps {
    id: number;
    merchantId: number;
    closeDetail: () => void;
}

const StaffDetail: React.FC<IProps> = ({ id, merchantId, closeDetail }) => {
    const [staff, setStaff] = useState<IStaff>();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [toggleState, setToggleState] = useState<string>("General");

    useEffect(() => {
        setToggleState("General");
    }, []);

    useEffect(() => {
        const fetchCategories = async (merchantId: number) => {
            try {
                const { data } = await MerchantService.getCategory(merchantId, 0, 0);
                setCategories(data);
            } catch (err) {
                console.log(err);
            }
        };
        const fetchServices = async (merchantId: number) => {
            try {
                const { data } = await MerchantService.getService(merchantId, 0, 0);
                setServices(data);
            } catch (err) {
                console.log(err);
            }
        };
        const fetchData = async (merchantId: number) => {
            try {
                await Promise.all([fetchCategories(merchantId), fetchServices(merchantId)]);
            } catch (error) {
                console.log(error);
            }
        };
        if (merchantId) {
            fetchData(merchantId);
        }
    }, [merchantId]);

    useEffect(() => {
        const fetchData = async (id: number, merchantId: number) => {
            try {
                const data = await MerchantService.getStaffById(id, merchantId);
                setStaff(data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };
        if (id && loading && merchantId) fetchData(id, merchantId);
    }, [id, loading, merchantId]);

    const handleChange = () => {
        setLoading(true);
    };

    const TABS = [
        {
            key: "General",
            content: (staff: IStaff) => (
                <General staff={staff} closeDetail={closeDetail} handleChange={handleChange} merchantId={merchantId} />
            ),
        },
        {
            key: "Working-Time",
            content: (staff: IStaff) => (
                <WorkingTime staff={staff} closeDetail={closeDetail} handleChange={handleChange} />
            ),
        },
        {
            key: "Salary",
            content: (staff: IStaff) => <Salary staff={staff} closeDetail={closeDetail} handleChange={handleChange} />,
        },
        {
            key: "License",
            content: (staff: IStaff) => <License staff={staff} closeDetail={closeDetail} handleChange={handleChange} />,
        },
        {
            key: "Services",
            content: (staff: IStaff) => {
                return (
                    <Services
                        staff={staff}
                        closeDetail={closeDetail}
                        handleChange={handleChange}
                        categories={categories}
                        services={services}
                    />
                );
            },
        },
    ];

    const handleChangeState = (key: string) => {
        setToggleState(key);
    };

    return (
        <Spin spinning={loading}>
            <div className="bg-white p-4 rounded-xl">
                <Tabs activeKey={toggleState} onChange={handleChangeState}>
                    {TABS.map((item) => (
                        <Tabs.TabPane tab={item?.key} key={item.key}>
                            {staff ? item?.content(staff) : null}
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </div>
        </Spin>
    );
};

export default StaffDetail;
