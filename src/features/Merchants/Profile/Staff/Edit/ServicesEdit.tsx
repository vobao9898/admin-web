import { Modal, Tree } from "antd";
import { Key, useState } from "react";
import { cleanSSN } from "utils";
import type { DataNode } from "antd/es/tree";
import ModalButton from "components/ModalButton";
import IStaff, { StaffService } from "interfaces/IStaff";
import cloneDeep from "lodash/cloneDeep";
import MerchantService from "services/MerchantService";
import Message from "components/Message";

interface IProps {
    staff: IStaff;
    open: boolean;
    treeData: DataNode[];
    defaultKeys: React.Key[];
    onClose: () => void;
    onSuccess: () => void;
}

const ServicesEdit: React.FC<IProps> = ({ staff, defaultKeys, treeData, open, onClose, onSuccess }) => {
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(defaultKeys);
    const [loading, setLoading] = useState<boolean>(false);

    const onCheck = (checkedKeysValue: Key[] | { checked: Key[]; halfChecked: Key[] }) => {
        if ((checkedKeysValue as Key[]).length !== undefined) {
            setCheckedKeys(checkedKeysValue as Key[]);
        }
    };

    const getSelectedCategories = (staff: IStaff) => {
        const categories = cloneDeep(staff.categories);
        const data = categories.map((cate) => {
            const staffServices = getStaffServices(cate.categoryId, cate.staffServices);
            return {
                categoryId: cate.categoryId,
                id: cate.id,
                name: cate.name,
                selected:
                    checkedKeys.findIndex((x) => x === cate.categoryId) !== -1
                        ? true
                        : staffServices.findIndex((x) => x.selected === true) !== -1
                        ? true
                        : false,
                staffServices: staffServices,
            };
        });
        return data;
    };

    const getStaffServices = (categoryId: number, staffServices: StaffService[]) => {
        const data = staffServices.map((item) => {
            return {
                id: item.id,
                categoryId: categoryId,
                name: item.name,
                serviceId: item.serviceId,
                selected: checkedKeys.findIndex((x) => x === `${categoryId}-${item.serviceId}`) !== -1 ? true : false,
            };
        });
        return data;
    };

    const onSubmit = async () => {
        if (staff) {
            const payload = {
                firstName: staff.firstName,
                lastName: staff.lastName,
                displayName: staff.displayName,
                address: {
                    street: staff.address,
                    city: staff.city,
                    zip: staff.zip,
                    state: staff.stateId,
                    stateId: staff.stateId,
                },
                cellphone: staff.phone,
                email: staff.email,
                pin: staff.pin,
                isActive: staff.isActive,
                roles: {
                    nameRole: staff.roleName,
                    statusRole: "",
                },
                isDisabled: staff.isDisabled,
                fileId: staff.fileId,
                driverLicense: staff.driverLicense,
                socialSecurityNumber: cleanSSN(staff.socialSecurityNumber),
                professionalLicense: staff.professionalLicense,
                workingTime: staff.workingTimes,
                salary: {
                    commission: {
                        isCheck: staff?.salaries?.commission?.isCheck,
                        value:
                            staff?.salaries?.commission?.value && staff?.salaries?.commission?.value?.length
                                ? staff?.salaries?.commission?.value
                                : [{ from: 0, to: 0, salaryPercent: 0, commission: 0 }],
                    },
                    perHour: staff?.salaries.perHour,
                },
                productSalary: staff?.productSalaries,
                cashPercent: staff?.cashPercent,
                tipFee: staff?.tipFees,
                categories: getSelectedCategories(staff),
            };
            try {
                setLoading(true);
                const message = await MerchantService.editGeneralStaff(payload, staff?.staffId);
                Message.success({ text: message });
                onSuccess();
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        }
    };

    return (
        <Modal
            centered={true}
            width={900}
            maskClosable={false}
            destroyOnClose={true}
            open={open}
            title={<p className="font-bold text-lg">{"Edit"}</p>}
            onCancel={onClose}
            footer={
                <div className="flex justify-end gap-x-2">
                    <ModalButton disabled={loading} title="Cancel" type={"button"} btnType="cancel" onClick={onClose} />
                    <ModalButton
                        loading={loading}
                        disabled={loading}
                        title="Save"
                        type={"submit"}
                        btnType="save"
                        onClick={onSubmit}
                    />
                </div>
            }
        >
            <div>
                {treeData && (
                    <Tree
                        defaultExpandedKeys={defaultKeys}
                        defaultCheckedKeys={defaultKeys}
                        checkedKeys={checkedKeys}
                        checkable
                        treeData={treeData}
                        onCheck={onCheck}
                    />
                )}
            </div>
        </Modal>
    );
};

export default ServicesEdit;
