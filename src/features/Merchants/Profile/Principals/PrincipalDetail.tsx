import Button from "components/Button";
import IPrincipal from "interfaces/IPrincipal";
import moment from "moment";
import React, { useState } from "react";
import { convertSSN, getCodeAndPhoneNumber, maskPhone, isPdfFile } from "utils";
import { ReactComponent as PdfIcon } from "assets/images/pdf-icon.svg";
import ChangePrincipal from "./ChangePrincipal";

interface IProps {
    onBack: () => void;
    onSuccess: () => void;
    principal: IPrincipal;
    merchantId: number;
}

const PrincipalDetail: React.FC<IProps> = ({ principal, merchantId, onBack, onSuccess }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleBack = () => {
        onBack();
    };

    const toggleOpenModal = () => {
        setOpenModal((preVal) => !preVal);
    };

    const handleSuccess = () => {
        setOpenModal(false);
        onSuccess();
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

    const [codeHomePhone, homePhoneNumber] = getCodeAndPhoneNumber(principal.homePhone);
    const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(principal.mobilePhone);

    return (
        <div>
            {openModal ? (
                <ChangePrincipal
                    merchantId={merchantId}
                    principalId={principal.principalId}
                    handleClose={toggleOpenModal}
                    onSuccess={handleSuccess}
                />
            ) : null}
            <div className="font-bold text-lg mb-4 text-blue-500">Principal Information</div>
            <div className="grid grid-cols-12 gap-6 mb-4">
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Name</div>
                    <div className="text-sm">{`${principal.firstName} ${principal.lastName}`}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Title/Position</div>
                    <div className="text-sm">{principal.title}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Ownership</div>
                    <div className="text-sm">{principal.ownerShip}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Home Phone</div>
                    <div className="text-sm">{maskPhone(codeHomePhone, homePhoneNumber)}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Mobile Phone</div>
                    <div className="text-sm">{maskPhone(codeMobilePhone, mobilePhoneNumber)}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Address</div>
                    <div className="text-sm">{`${principal?.address || " "}, ${principal?.city || " "}, ${
                        principal?.stateIssuedName || " "
                    }, ${principal?.zip || " "}`}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Social Security Number</div>
                    <div className="text-sm">{convertSSN(principal.ssn)}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Date of Birth</div>
                    <div className="text-sm">{moment(principal.birthDate).format("MM/DD/YYYY")}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Email Address</div>
                    <div className="text-sm">{principal.email}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Driver License Number</div>
                    <div className="text-sm">{principal.driverNumber}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">State Issued</div>
                    <div className="text-sm">{principal.stateIssuedName}</div>
                </div>
                <div className="col-span-4"></div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">
                        {isPdfFile(principal?.imageUrl) ? "Driver License Pdf" : "Driver License Picture"}
                    </div>
                    <div className="text-sm max-w-[320px] max-h-[320px]">
                        {isPdfFile(principal?.imageUrl) ? (
                            renderPdf(principal?.imageUrl)
                        ) : (
                            <img src={principal?.imageUrl} alt="" />
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-x-2">
                <Button onClick={toggleOpenModal} btnType="ok" title="Edit" />
                <Button onClick={handleBack} title="Back" />
            </div>
        </div>
    );
};

export default PrincipalDetail;
