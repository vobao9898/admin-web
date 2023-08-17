import React, { useEffect, useState } from "react";
import { Checkbox } from "antd";
import { maskPhone, getCodeAndPhoneNumber } from "utils";
import Button from "components/Button";
import IStaff from "interfaces/IStaff";
import Avatar from "components/Avatar/Avatar";
import GeneralEdit from "../Edit/GeneralEdit";
import StateService from "services/StateService";
import IState from "interfaces/IState";

interface IProps {
    staff: IStaff;
    merchantId: number;
    closeDetail: () => void;
    handleChange: () => void;
}

const General: React.FC<IProps> = ({ staff, merchantId, closeDetail, handleChange }) => {
    const [showPin, setShowPin] = useState<boolean>(false);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [state, setState] = useState<IState[]>([]);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const data = await StateService.get();
                setState(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchState();
    }, [staff]);

    const toggleModal = () => {
        setOpenModal((preVal) => !preVal);
    };

    const handleSuccess = () => {
        setOpenModal(false);
        handleChange();
    };

    const [codePhone, phoneNumber] = getCodeAndPhoneNumber(staff?.phone);

    return (
        <div>
            <GeneralEdit
                state={state}
                open={openModal}
                onClose={toggleModal}
                staff={staff}
                onSuccess={handleSuccess}
                merchantId={merchantId}
            />
            <h4 className="font-semibold text-xl text-blue-500 mb-5">General Information</h4>
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-4">
                    <p className="font-semibold">First Name</p>
                    <p>{staff?.firstName}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">Last Name</p>
                    <p>{staff?.lastName}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">Display Name</p>
                    <p>{staff?.displayName}</p>
                </div>
                <div className="col-span-12">
                    <p className="font-semibold">Address</p>
                    <p>{staff?.address}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">City</p>
                    <p>{staff?.city}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">State</p>
                    <p>{staff?.stateName}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">Zip Code</p>
                    <p>{staff?.zip}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">Cell Phone</p>
                    <p>{phoneNumber ? maskPhone(codePhone, phoneNumber) : ""}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">Contact Email</p>
                    <p>{staff?.email}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">Create PIN</p>
                    <div className="text-sm flex items-center justify-between">
                        <div>{showPin ? staff && staff?.pin : "****"}</div>
                        <div onClick={() => setShowPin((preVal) => !preVal)}>
                            {showPin ? <i className="las la-eye-slash" /> : <i className="las la-eye cursor-pointer" />}
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
                    <Checkbox checked={staff?.isActive}>Visible on App</Checkbox>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">Roles</p>
                    <p>{staff?.roleName}</p>
                </div>
                <div className="col-span-4">
                    <p className="font-semibold">Status</p>
                    <p>{staff?.isDisabled === 0 ? "Active" : "Inactive"}</p>
                </div>
                <div className="col-span-4">
                    <p className="mb-2 font-semibold">Avatar</p>
                    {/* 2214 is fileId image fail in Database */}
                    <div>{staff?.fileId !== 2214 && <Avatar src={staff?.imageUrl} />}</div>
                </div>
            </div>
            <div className="flex items-center mt-5 gap-x-2">
                <Button title="EDIT" btnType="ok" onClick={toggleModal} />
                <Button title="BACK" btnType="cancel" onClick={closeDetail} />
            </div>
        </div>
    );
};

export default General;
