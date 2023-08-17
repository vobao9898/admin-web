import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { convertSSN, maskPhone, isPdfFile } from "utils";
import { ReactComponent as PdfIcon } from "assets/images/pdf-icon.svg";
import Button from "components/Button/Button";
import IPrincipal from "interfaces/IPrincipal";
import moment from "moment";
import UpdateModal from "./UpdateModal";

interface IProps {
    id: string;
    principal: IPrincipal;
    state: any;
    handleChange: () => void;
}

const Information: React.FC<IProps> = ({ principal, state, handleChange }) => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const toggleModal = () => {
        setOpenModal((preVal) => !preVal);
    };

    const handleUpdateSuccess = () => {
        setOpenModal(false);
        handleChange();
    };

    const renderPdf = (url: string) => {
        return (
            <div className="relative flex flex-col p-2 rounded-md border border-gray-300 w-[120px] h-[120px]">
                <div className="flex items-center justify-center flex-grow w-full">
                    <PdfIcon
                        className="cursor-pointer"
                        onClick={() => {
                            window.open(url, "_blank");
                        }}
                    />
                </div>
            </div>
        );
    };

    const renderInformation = (currentPrincipal: IPrincipal) => {
        if (!currentPrincipal) return null;

        const {
            firstName,
            lastName,
            title,
            email,
            stateIssuedName,
            address,
            ownerShip,
            birthDate,
            driverNumber,
            ssn,
            imageUrl,
            city,
            zip,
        } = currentPrincipal;

        return (
            <>
                <div className="font-bold text-lg mb-4 text-blue-500">Principal Information</div>
                <div className="grid grid-cols-12 gap-6 mb-4">
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Name</div>
                        <div className="text-sm">{`${firstName} ${lastName}`}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Title/Position</div>
                        <div className="text-sm">{title}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Ownership</div>
                        <div className="text-sm">{ownerShip}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Home Phone</div>
                        <div className="text-sm">{maskPhone(principal.codeHomePhone, principal.homePhone)}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Mobile Phone</div>
                        <div className="text-sm"> {maskPhone(principal.codeMobilePhone, principal.mobilePhone)}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Address</div>
                        <div className="text-sm">{`${address || " "}, ${city || " "}, ${stateIssuedName || " "}, ${
                            zip || " "
                        }`}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Social Security Number</div>
                        <div className="text-sm">{convertSSN(ssn)}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Date of Birth</div>
                        <div className="text-sm">{birthDate && moment(birthDate).format("MM/DD/YYYY")}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Email Address</div>
                        <div className="text-sm">{email}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">Driver License Number</div>
                        <div className="text-sm">{driverNumber}</div>
                    </div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">State Issued</div>
                        <div className="text-sm">{stateIssuedName}</div>
                    </div>
                    <div className="col-span-4"></div>
                    <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                        <div className="text-sm font-semibold mb-2">
                            {isPdfFile(imageUrl) ? "Driver License Pdf" : "Driver License Picture"}
                        </div>
                        {isPdfFile(imageUrl) ? renderPdf(imageUrl) : <img src={imageUrl} alt="Driver License" />}
                    </div>
                </div>
                <Button btnType="ok" title="Edit" onClick={toggleModal} moreClass="mr-2" />
                <Button btnType="cancel" title="Back" onClick={() => navigate("/principal")} />
            </>
        );
    };

    return (
        <div>
            {openModal ? (
                <UpdateModal
                    principal={principal}
                    state={state}
                    onClose={toggleModal}
                    onSuccess={handleUpdateSuccess}
                />
            ) : null}
            {principal && renderInformation(principal)}
        </div>
    );
};

export default Information;
