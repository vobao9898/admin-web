import { Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import Button from "components/Button";
import ICategory from "interfaces/ICategory";
import IService from "interfaces/IService";
import IStaff from "interfaces/IStaff";
import React, { useState } from "react";
import ServicesEdit from "../Edit/ServicesEdit";

interface IProps {
    staff: IStaff;
    categories: ICategory[];
    services: IService[];
    closeDetail: () => void;
    handleChange: () => void;
}

const Services: React.FC<IProps> = ({ staff, categories, services, closeDetail, handleChange }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const getSelectedKeys = (staff: IStaff) => {
        const categories = staff.categories.filter((x) => x.selected === true);
        const keys: (string | number)[] = [];
        categories.forEach((cate) => {
            keys.push(cate.categoryId);
            cate.staffServices.forEach((service) => {
                if (service.selected) {
                    keys.push(`${cate.categoryId}-${service.serviceId}`);
                }
            });
        });
        return keys;
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

    const toggleModal = () => {
        setOpenModal((preVal) => !preVal);
    };

    const handleSuccess = () => {
        setOpenModal(false);
        handleChange();
    };

    const treeData: DataNode[] = [
        {
            title: "Select All",
            key: "all",
            children: generalTree(categories, services),
        },
    ];

    return (
        <div>
            {staff && (
                <ServicesEdit
                    staff={staff}
                    open={openModal}
                    onClose={toggleModal}
                    onSuccess={handleSuccess}
                    treeData={treeData}
                    defaultKeys={getSelectedKeys(staff)}
                />
            )}
            <h4 className="font-semibold text-xl text-blue-500 my-5">Services</h4>
            <p>Assign services this staff can be perform</p>
            {staff && (
                <Tree
                    defaultExpandedKeys={getSelectedKeys(staff)}
                    checkedKeys={getSelectedKeys(staff)}
                    checkable
                    treeData={treeData}
                />
            )}
            <div className="flex items-center mt-5 gap-x-2">
                <Button title="EDIT" btnType="ok" onClick={toggleModal} />
                <Button title="BACK" btnType="cancel" onClick={closeDetail} />
            </div>
        </div>
    );
};

export default Services;
