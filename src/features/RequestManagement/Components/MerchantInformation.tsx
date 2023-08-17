import IMerchant from "interfaces/IMerchant";
import React from "react";
import moment from "moment";
import { ReactComponent as PdfIcon } from "assets/images/pdf-icon.svg";
import { maskPhone, isPdfFile, getCodeAndPhoneNumber } from "utils";

interface IProps {
    pending: IMerchant;
}

const MerchantInformation: React.FC<IProps> = ({ pending }) => {
    const business = [
        {
            question: "Have you ever accepted Credit/Debit cards before?",
            list: [
                { label: "No", value: false },
                { label: "Yes (if yes, who was your previous company)", value: true },
            ],
        },
        {
            question: "Has a processor ever terminated your Merchant account?",
            list: [
                { label: "No", value: false },
                { label: "Yes (if yes, what was program and when)", value: true },
            ],
        },
        {
            question: "Will product(s) or service(s) be sold outside of US?",
            list: [
                { label: "No", value: false },
                { label: "Yes (if yes, date filed)", value: true },
            ],
        },
        {
            question: "Has Merchant been previously identified by Visa/Mastercard Risk Programs?",
            list: [
                { label: "No", value: false },
                { label: "Yes (if yes, who was the processor)", value: true },
            ],
        },
        {
            question:
                "Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?",
            list: [
                { label: "No", value: false },
                { label: "Yes (if yes, who was the processor)", value: true },
            ],
        },
    ];

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

    const [codePhoneContact, phoneContact] = getCodeAndPhoneNumber(pending.general.phoneContact);
    const [codePhoneBusiness, phoneBusiness] = getCodeAndPhoneNumber(pending.general.phoneBusiness);

    return (
        <div className="px-4">
            <h4 className="my-5 font-bold text-blue-500 text-xl">General Information</h4>
            <div className="w-full flex flex-wrap">
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Legal Business Name</p>
                        <p>{pending?.general.legalBusinessName}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Doing Business As (DBA)</p>
                        <p>{pending?.general.doBusinessName}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Merchant type</p>
                        <p>{pending?.type === "Restaurant" ? "Table Management" : pending?.type}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Federal Tax ID</p>
                        <p>{pending?.general.tax}</p>
                    </div>
                </div>
                <div className="w-full mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Business Address (no P.O. Boxes)</p>
                        <p>{pending?.general.address}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">City</p>
                        <p>{pending?.general.city}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">State</p>
                        <p>{pending?.state?.name}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Zip Code</p>
                        <p>{pending?.zip}</p>
                    </div>
                </div>
                <div className="w-full mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">DBA Address</p>
                        <p>{pending?.general.dbaAddress?.Address}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">City</p>
                        <p>{pending?.general.dbaAddress?.City}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">State</p>
                        <p>{pending?.general.dbaAddress?.StateName}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Zip Code</p>
                        <p>{pending?.general.dbaAddress?.Zip}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Business Phone Number</p>
                        <p>{maskPhone(codePhoneBusiness, phoneBusiness)}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Contact Email Address</p>
                        <p>{pending?.general.emailContact}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Contact Name</p>
                        <p>{pending?.general.firstName + " " + pending?.general?.lastName}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Title/Position</p>
                        <p>{pending?.general.title}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Contact Phone Number</p>
                        <p>{maskPhone(codePhoneContact, phoneContact)}</p>
                    </div>
                </div>
            </div>
            <h4 className="my-5 font-bold text-blue-500 text-xl">Business Information</h4>
            <div className="w-full mt-5 flex flex-wrap">
                {business.map((item, index) => {
                    let value = false;
                    pending?.business.map((busi) => {
                        if (busi.question === item.question) value = busi.answer;
                        return busi;
                    });
                    return (
                        <div className="w-full xl:w-1/2 mb-7 pr-5" key={index}>
                            <div>
                                <p className="mb-2 font-medium text-sm text-black">{item.question}</p>
                                <div className="flex items-center">
                                    <input className="min-w-3 min-h-3" type="radio" readOnly checked={!value} />
                                    <label className="ml-2 mr-4 ">{item.list[0].label}</label>
                                    <input className="min-w-3 min-h-3" type="radio" readOnly checked={value} />
                                    <label className="ml-2 ">{item.list[1].label}</label>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <h4 className="my-5 font-bold text-blue-500 text-xl">Bank Information</h4>
            <div className="w-full mt-5 flex flex-wrap">
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Account Holder Name</p>
                        <p>{pending?.businessBank?.accountHolderName}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Bank Name</p>
                        <p>{pending?.businessBank?.name}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Routing Number</p>
                        <p>{pending?.businessBank?.routingNumber}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Account Number(DDA)</p>
                        <p>{pending?.businessBank?.accountNumber}</p>
                    </div>
                </div>
                <div className="w-1/2 lg:w-full mb-7 pr-5">
                    <div>
                        <p className="mb-2 font-medium text-sm text-black">Void Check</p>
                        <div className="w-48 rounded-md overflow-hidden">
                            {pending && isPdfFile(pending?.businessBank?.imageUrl) ? (
                                renderPdf(pending?.businessBank?.imageUrl)
                            ) : (
                                <img
                                    className="w-full object-cover"
                                    src={pending?.businessBank?.imageUrl}
                                    alt="void check"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <h4 className="my-5 font-bold text-blue-500 text-xl">Principal Information</h4>
            {pending?.principals.map((item, index) => {
                const minusString = item.ssn.replace("-", "");
                const addString = minusString + "______";
                const ssn = "***-**-" + addString.slice(0, 4);
                const [codeHomePhone, homePhone] = getCodeAndPhoneNumber(item.homePhone);
                const [codeMobilePhone, mobilePhone] = getCodeAndPhoneNumber(item.mobilePhone);

                return (
                    <div key={index}>
                        <h2 className="text-lg font-semibold text-blue-500">Principal {index + 1}</h2>
                        <div className="w-full mt-5 flex flex-wrap">
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Name</p>
                                    <p>{item?.firstName + " " + item?.lastName}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Title/Position</p>
                                    <p>{item.title}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Ownership(%)</p>
                                    <p>{item.ownerShip}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Home Phone</p>
                                    <p>{maskPhone(codeHomePhone, homePhone)}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Mobile Phone</p>
                                    <p>{maskPhone(codeMobilePhone, mobilePhone)}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Address</p>
                                    <p>{`${item?.address}, ${item?.city}, ${item?.state?.name}, ${item?.zip}`}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Date of Birth (mm/dd/yyyy)</p>
                                    <p>{moment(item.birthDate).format("L")}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Email Address</p>
                                    <p>{item.email}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Driver License Number</p>
                                    <p>{item.driverNumber}</p>
                                </div>
                            </div>
                            <div className="w-1/2 lg:w-1/3 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">State Issued</p>
                                    <p>{item.stateIssuedName}</p>
                                </div>
                            </div>
                            <div className="w-1/2 mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Social Security Number (SSN)</p>
                                    <p>{ssn}</p>
                                </div>
                            </div>
                            <div className="w-full mb-7 pr-5">
                                <div>
                                    <p className="mb-2 font-medium text-sm text-black">Driver License Picture</p>
                                    <div className="w-48 rounded-md overflow-hidden">
                                        {isPdfFile(item.imageUrl) ? (
                                            renderPdf(item.imageUrl)
                                        ) : (
                                            <img className="w-full object-cover" src={item.imageUrl} alt="void check" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MerchantInformation;
