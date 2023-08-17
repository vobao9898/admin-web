import classNames from "classnames";
import IArrayOldData from "interfaces/IArrayOldData";
import React from "react";
import { ReactComponent as PdfIcon } from "assets/images/pdf-icon.svg";
import { maskPhone, getCodeAndPhoneNumber, isPdfFile } from "utils";

interface IProps {
    logs: IArrayOldData[];
}

//TODO: API Missing stateIssuedName

const Logs: React.FC<IProps> = ({ logs }) => {
    const renderPrincipalRow = (item: IArrayOldData, index: number) => {
        const [codeHomePhone, homePhoneNumber] = getCodeAndPhoneNumber(item?.homePhone);
        const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(item?.mobilePhone);

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

        return (
            <div
                className={classNames(
                    "grid grid-cols-12 gap-6 px-5 py-5",
                    { "border-t border-blue-500": index !== 0 },
                    { "bg-[#f9fafb]": index % 2 === 0 },
                    { "bg-[#ffffff]": index % 2 !== 0 }
                )}
                key={index}
            >
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
                    <div className="text-sm">{`${item?.address || " "}, ${item?.city || " "}, ${
                        item?.stateIssuedName || " "
                    }, ${item?.zip || " "}`}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">State Issued</div>
                    <div className="text-sm">{item?.stateName}</div>
                </div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">Driver License Number</div>
                    <div className="text-sm">{item?.driverNumber}</div>
                </div>
                <div className="col-span-4"></div>
                <div className="sm:col-span-6 lg:col-span-4 col-span-12">
                    <div className="text-sm font-semibold mb-2">
                        {isPdfFile(item?.ImageUrl) ? "Driver License Pdf" : "Driver License Picture"}
                    </div>
                    <div className="text-sm">
                        {isPdfFile(item?.ImageUrl) ? renderPdf(item?.ImageUrl) : <img src={item?.ImageUrl} alt="" />}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {logs &&
                logs.map((item, index) => {
                    return renderPrincipalRow(item, index);
                })}
        </div>
    );
};

export default Logs;
