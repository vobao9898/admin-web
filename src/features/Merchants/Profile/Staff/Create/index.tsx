import { Spin } from "antd";
import { useEffect, useState, Key } from "react";
import { IStep } from "components/Wizard";
import type { DataNode } from "antd/es/tree";
import Wizard from "components/Wizard";
import Button from "components/Button";
import General from "./General";
import IState from "interfaces/IState";
import StateService from "services/StateService";
import WorkingTime from "./WorkingTime";
import ICategory from "interfaces/ICategory";
import IService from "interfaces/IService";
import MerchantService from "services/MerchantService";
import Salary from "./Salary";
import License from "./License";
import Message from "components/Message";

interface IProps {
    merchantId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export interface IGeneral {
    firstName: string;
    lastName: string;
    displayName: string;
    address: {
        street: string;
        city: string;
        state: number;
        zip: string;
    };
    email: string;
    pin: string;
    ConfirmPin: string;
    isActive: boolean;
    isDisabled: number;
    cellphone: string;
    fileId: number;
    imageUrl: string;
    roles: {
        nameRole: string;
        statusRole: "";
    };
    gender?: string;
}

export interface IWorkingTimes {
    Monday: {
        isCheck: boolean;
        timeStart: string;
        timeEnd: string;
    };
    Tuesday: {
        isCheck: boolean;
        timeStart: string;
        timeEnd: string;
    };
    Wednesday: {
        isCheck: boolean;
        timeStart: string;
        timeEnd: string;
    };
    Thursday: {
        isCheck: boolean;
        timeStart: string;
        timeEnd: string;
    };
    Friday: {
        isCheck: boolean;
        timeStart: string;
        timeEnd: string;
    };
    Saturday: {
        isCheck: boolean;
        timeStart: string;
        timeEnd: string;
    };
    Sunday: {
        isCheck: boolean;
        timeStart: string;
        timeEnd: string;
    };
}

interface ISalaryCommission {
    from: string;
    to: string;
    commission: string;
    salaryPercent: string;
}

export interface ISalary {
    salary: {
        perHour: {
            isCheck: boolean;
            value: string;
        };
        commission: {
            isCheck: boolean;
            value: ISalaryCommission[];
        };
    };
    productSalary: {
        commission: {
            value: string;
            isCheck: boolean;
        };
    };
    tipFee: {
        percent: {
            value: string;
            isCheck: boolean;
        };
        fixedAmount: {
            value: string;
            isCheck: boolean;
        };
    };
    cashPercent: string;
}

export interface ILicense {
    socialSecurityNumber: string;
    professionalLicense: string;
    driverLicense: string;
}

const StaffCreate: React.FC<IProps> = ({ onClose, onSuccess, merchantId }) => {
    const [current, setCurrent] = useState(0);
    const [state, setState] = useState<IState[]>([]);

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [services, setServices] = useState<IService[]>([]);

    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(["all"]);

    const [general, setGeneral] = useState<IGeneral>();
    const [workingTimes, setWorkingTimes] = useState<IWorkingTimes>();
    const [salary, setSalary] = useState<ISalary>();
    const [license, setLicense] = useState<ILicense>();

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingData, setLoadingData] = useState<boolean>(false);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const data = await StateService.get();
                setState(data);
            } catch (error) {
                console.log(error);
            }
        };
        const fetchDataCategories = async (merchantId: number) => {
            try {
                const { data } = await MerchantService.getCategory(merchantId, 0, 0);
                setCategories(data);
            } catch (err) {
                console.log(err);
            }
        };
        const fetchDataService = async (merchantId: number) => {
            try {
                const { data } = await MerchantService.getService(merchantId, 0, 0);
                setServices(data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchData = async () => {
            try {
                setLoadingData(true);
                await Promise.all([fetchDataCategories(merchantId), fetchDataService(merchantId), fetchState()]);
                setLoadingData(false);
            } catch (error) {
                console.log(error);
                setLoadingData(false);
            }
        };

        fetchData();
    }, [merchantId]);

    const handlePrev = () => {
        setCurrent(current - 1);
    };

    const getServicesOfCategory = (categoryId: number, services: IService[]): { title: string; key: string }[] => {
        const _services = services.filter((item) => item?.categoryId === categoryId && item.isDisabled === 0);
        const data = _services.map((item) => {
            return {
                title: item.name,
                key: categoryId + "-" + item?.serviceId,
            };
        });
        return data;
    };

    const generalTree = (categories: ICategory[], services: IService[]) => {
        const _categories = categories.filter((item) => item.categoryType === "Service" && item.isDisabled === 0);
        const data = _categories.map((item) => {
            return {
                title: item?.name,
                key: item?.categoryId,
                children: getServicesOfCategory(item.categoryId, services),
            };
        });
        return data;
    };

    const onCheck = (checkedKeysValue: Key[] | { checked: Key[]; halfChecked: Key[] }) => {
        if ((checkedKeysValue as Key[]).length !== undefined) {
            setCheckedKeys(checkedKeysValue as Key[]);
        }
    };

    const getSelectedCategories = (categories: ICategory[], services: IService[]) => {
        const _categories = categories.filter((item) => item.categoryType === "Service" && item.isDisabled === 0);
        const _isCheckAll = checkedKeys.findIndex((x) => x === "all") !== -1 ? true : false;
        const data = _categories.map((item) => {
            const staffServices = getStaffServices(item.categoryId, services, _isCheckAll);

            return {
                categoryId: item.categoryId,
                name: item.name,
                selected: _isCheckAll
                    ? true
                    : checkedKeys.findIndex((x) => x === item.categoryId) !== -1
                    ? true
                    : staffServices.findIndex((x) => x.selected === true) !== -1
                    ? true
                    : false,
                id: 0,
                staffId: 0,
                staffServices: staffServices,
            };
        });
        return data;
    };

    const getStaffServices = (categoryId: number, services: IService[], isCheckAll: boolean) => {
        const _services = services.filter((item) => item?.categoryId === categoryId && item.isDisabled === 0);
        const data = _services.map((item) => {
            return {
                categoryId: categoryId,
                name: item.name,
                serviceId: item.serviceId,
                selected: isCheckAll
                    ? true
                    : checkedKeys.findIndex((x) => x === `${categoryId}-${item.serviceId}`) !== -1
                    ? true
                    : false,
                id: 0,
                staffCategoryId: 0,
                staffId: 0,
            };
        });
        return data;
    };

    const handleSubmitStep = (value: any) => {
        if (current === 0) {
            setGeneral(value);
            setCurrent(1);
        } else if (current === 1) {
            setWorkingTimes(value);
            setCurrent(2);
        } else if (current === 2) {
            setSalary(value);
            setCurrent(3);
        } else if (current === 3) {
            setLicense(value);
            onSubmit(value);
        }
    };

    const onSubmit = async (license: ILicense) => {
        if (general && workingTimes && salary) {
            const payload = {
                ConfirmPin: general.ConfirmPin,
                address: general.address,
                birthdate: "0001-01-01T00:00:00",
                cashPercent: salary.cashPercent,
                categories: getSelectedCategories(categories, services),
                cellphone: general.cellphone !== "1" && general.cellphone !== "84" ? general.cellphone : "",
                colorCode: "",
                displayName: general.displayName,
                driverLicense: license.driverLicense,
                email: general.email,
                fileId: general.fileId,
                firstName: general.firstName,
                lastName: general.lastName,
                gender: null,
                isActive: general.isActive,
                isDisabled: general.isDisabled,
                merchantId: merchantId,
                permission: [
                    {
                        id: 0,
                        staffId: 0,
                        roleId: 0,
                        key: "",
                        label: "",
                        isChecked: true,
                        isDisabled: 0,
                        createdDate: "",
                        createdBy: 0,
                        modifiedDate: "",
                        modifiedBy: 0,
                    },
                ],
                pin: general.pin,
                productSalary: salary.productSalary,
                professionalLicense: license.professionalLicense,
                roles: general.roles,
                salary: {
                    commission: {
                        isCheck: salary.salary.commission.isCheck,
                        value:
                            salary.salary.commission.value && salary.salary.commission.value.length
                                ? salary.salary.commission.value
                                : [{ from: 0, to: 0, salaryPercent: 0, commission: 0 }],
                    },
                    perHour: salary.salary.perHour,
                },
                socialSecurityNumber: license.socialSecurityNumber.replace(/[^\d]/g, ""),
                status: true,
                tipFee: salary.tipFee,
                workingTime: workingTimes,
            };

            try {
                setLoading(true);
                const message = await MerchantService.addNewStaff(payload);
                Message.success({ text: message });
                onSuccess();
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
    };

    const treeData: DataNode[] = [
        {
            title: "Select All",
            key: "all",
            children: generalTree(categories, services),
        },
    ];

    const steps: IStep[] = [
        {
            title: "General Information",
            content: (
                <General
                    state={state}
                    data={general}
                    treeData={treeData}
                    checkedKeys={checkedKeys}
                    merchantId={merchantId}
                    onCheck={onCheck}
                    onSubmitData={handleSubmitStep}
                />
            ),
        },
        {
            title: "Working Time",
            content: <WorkingTime onSubmitData={handleSubmitStep} workingTimes={workingTimes} />,
        },
        {
            title: "Salary",
            content: <Salary onSubmitData={handleSubmitStep} data={salary} />,
        },
        {
            title: "License",
            content: <License onSubmitData={handleSubmitStep} data={license} />,
        },
    ];

    return (
        <Spin spinning={loading || loadingData}>
            <div className="mb-4 text-lg w-full rounded-xl px-4 py-3 bg-white">
                <div className={`w-full flex flex-wrap items-center demo my-5 text-white`}>
                    <Wizard steps={steps} current={current} />
                </div>
                <div className="relative px-4">
                    {steps[current].content}
                    <div className="absolute right-4 bottom-0">
                        <>
                            {current > 0 && current !== 4 && <Button title="Previous" onClick={handlePrev} />}
                            {current !== 4 && (
                                <Button title="Cancel" btnType="cancel" moreClass="ml-2" onClick={onClose} />
                            )}
                        </>
                    </div>
                </div>
            </div>
        </Spin>
    );
};

export default StaffCreate;
