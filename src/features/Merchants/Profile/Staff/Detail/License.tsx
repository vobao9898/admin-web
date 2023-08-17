import React, { useState } from "react";
import { convertSSN } from "utils";
import Button from "components/Button";
import IStaff from "interfaces/IStaff";
import LicenseEdit from "../Edit/LicenseEdit";

interface IProps {
    staff: IStaff;
    closeDetail: () => void;
    handleChange: () => void;
}

const License: React.FC<IProps> = ({ staff, closeDetail, handleChange }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const toggleModal = () => {
        setOpenModal((preVal) => !preVal);
    };

    const handleSuccess = () => {
        setOpenModal(false);
        handleChange();
    };

    return (
        <div>
            <LicenseEdit onSuccess={handleSuccess} open={openModal} onClose={toggleModal} staff={staff} />
            <h4 className="text-xl font-semibold text-blue-500 pb-2">Licenses</h4>
            <div className="mb-2">
                <p className="font-semibold">Driver License</p>
                <p>{staff?.driverLicense}</p>
            </div>
            <div className="mb-2">
                <p className="font-semibold">Social Security Number</p>
                <p>{convertSSN(staff?.ssn)}</p>
            </div>
            <div className="mb-2">
                <p className="font-semibold">Professional License</p>
                <p>{staff?.professionalLicense}</p>
            </div>

            <div className="flex items-center mt-5 gap-x-2">
                <Button title="EDIT" btnType="ok" onClick={toggleModal} />
                <Button title="BACK" btnType="cancel" onClick={closeDetail} />
            </div>
        </div>
    );
};

export default License;
