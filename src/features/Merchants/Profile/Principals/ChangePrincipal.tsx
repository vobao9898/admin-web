import React, { useState } from "react";
import { Modal, Spin, Radio, RadioChangeEvent } from "antd";
import { ReactComponent as PdfIcon } from "assets/images/pdf-icon.svg";
import { convertSSN, isPdfFile } from "utils";
import { getCodeAndPhoneNumber, maskPhone } from "utils";
import ModalButton from "components/ModalButton";
import IPrincipal from "interfaces/IPrincipal";
import moment from "moment";
import SearchInput from "components/SeachInput";
import PrincipalService from "services/PrincipalService";
import MerchantService from "services/MerchantService";
import Message from "components/Message/Message";

interface IProps {
    merchantId: number;
    principalId: number;
    handleClose: () => void;
    onSuccess: () => void;
}

const ChangePrincipal: React.FC<IProps> = ({ merchantId, principalId, handleClose, onSuccess }) => {
    const [principals, setPricinpals] = useState<IPrincipal[]>([]);
    const [isSearched, setSearched] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>();
    const [keyword, setKeyword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (event: React.FormEvent) => {
        try {
            event.preventDefault();
            if (keyword) {
                const result = await PrincipalService.briefPrincipal(808, keyword);
                setPricinpals(result);
                setSearched(true);
                setSelectedId(undefined);
            } else {
                handleClear();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onChangePrincipal = async () => {
        try {
            if (selectedId) {
                setLoading(true);
                await MerchantService.changePrincipal(merchantId, selectedId, principalId);
                Message.success({ text: "Success" });
                onSuccess();
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    const handleChange = (event: RadioChangeEvent) => {
        const { value } = event.target;
        setSelectedId(value);
    };

    const handleChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setKeyword(value);
    };

    const handleClear = () => {
        setKeyword("");
        setPricinpals([]);
        setSelectedId(undefined);
        setSearched(false);
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

    const renderPrincipal = (principal: IPrincipal) => {
        const [codeHomePhone, homePhone] = getCodeAndPhoneNumber(principal.homePhone);
        const [codeMobilePhone, mobilePhone] = getCodeAndPhoneNumber(principal.mobilePhone);
        return (
            <div key={principal.principalId}>
                <div className="grid gap-x-5 grid-cols-12">
                    <div className="col-span-12 sm:col-span-12 lg:col-span-12">
                        <div className="mb-5 flex space-x-2 items-center flex-row">
                            <div>
                                <Radio value={principal.principalId}>
                                    <span className="font-bold text-lg text-blue-500">
                                        Principal Information {principal.principalId}
                                    </span>
                                </Radio>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Name</div>
                            <div className="text-sm">{`${principal.firstName} ${principal.lastName}`}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Title/Position</div>
                            <div className="text-sm">{principal.title}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Ownership</div>
                            <div className="text-sm">{principal.ownerShip}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Home Phone</div>
                            <div className="text-sm">{maskPhone(codeHomePhone, homePhone)}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Mobile Phone</div>
                            <div className="text-sm">{maskPhone(codeMobilePhone, mobilePhone)}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Address</div>
                            <div className="text-sm">{`${principal?.address || " "}, ${principal?.city || " "}, ${
                                principal?.stateIssuedName || " "
                            }, ${principal?.zip || " "}`}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Social Security Number</div>
                            <div className="text-sm">{convertSSN(principal?.ssn)}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Date of Birth</div>
                            <div className="text-sm">
                                {principal && moment(principal?.birthDate).format("MM/DD/YYYY")}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Email Address</div>
                            <div className="text-sm">{principal.email}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Driver License Number</div>
                            <div className="text-sm">{principal?.driverNumber}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">State Issued</div>
                            <div className="text-sm">{principal?.stateIssuedName}</div>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3" />
                    <div className="col-span-12 sm:col-span-3 lg:col-span-3">
                        <div className="mb-10">
                            <div className="text-sm font-semibold">Driver License Picture</div>
                            <div className="text-sm">
                                {isPdfFile(principal?.imageUrl) ? (
                                    renderPdf(principal?.imageUrl)
                                ) : (
                                    <img src={principal && principal?.imageUrl} alt="" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Spin spinning={false}>
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={true}
                width={1200}
                title={<p className="font-bold text-lg">Change Pricipal</p>}
                onCancel={handleClose}
                footer={
                    <div className="flex space-x-2 justify-end">
                        <ModalButton
                            disabled={loading}
                            title="Cancel"
                            type={"button"}
                            btnType="cancel"
                            onClick={handleClose}
                        />
                        <ModalButton
                            title="Save"
                            onClick={onChangePrincipal}
                            disabled={!Boolean(selectedId) || loading}
                            btnType="save"
                        />
                    </div>
                }
            >
                <form onSubmit={onSubmit}>
                    <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                        <div className="col-span-12">
                            <SearchInput
                                value={keyword}
                                onChange={handleChangeKeyword}
                                onClear={handleClear}
                                className="!w-full"
                                placeholder="Search email, social security number"
                            />
                        </div>
                    </div>
                </form>
                <div>
                    {principals && principals.length ? (
                        <div className="mt-4">
                            <Radio.Group value={selectedId} onChange={handleChange}>
                                {principals.map((item) => {
                                    return renderPrincipal(item);
                                })}
                            </Radio.Group>
                        </div>
                    ) : isSearched ? (
                        <div className="mt-4">
                            <span className="font-bold">Sorry, we couldn't find any results!</span>
                        </div>
                    ) : null}
                </div>
            </Modal>
        </Spin>
    );
};

export default ChangePrincipal;
