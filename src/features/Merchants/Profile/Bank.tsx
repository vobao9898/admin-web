import React, { useEffect, useState } from "react";
import { RHFTextField, RHFUpload } from "components/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Spin } from "antd";
import { ReactComponent as PdfIcon } from "assets/images/pdf-icon.svg";
import { isPdfFile } from "utils";
import { API_BASE_URL } from "contants";
import IBusinessBank from "interfaces/IBusinessBanks";
import Button from "components/Button";
import MerchantService from "services/MerchantService";
import * as yup from "yup";

type FormInputs = {
    accountHolderName: string;
    name: string;
    routingNumber: string;
    accountNumber: string;
    imageUrl: string;
    fileId: number;
};

const schema = yup.object({
    accountHolderName: yup.string().required("This is a required field!"),
    name: yup.string().required("This is a required field!"),
    accountNumber: yup
        .string()
        .required("This is a required field!")
        .matches(new RegExp("^[0-9]+$"), "Please enter only number!"),
    routingNumber: yup
        .string()
        .required("This is a required field!")
        .matches(new RegExp("^[0-9]+$"), "Please enter only number!"),
    imageUrl: yup.string().required("This is a required field!"),
    fileId: yup.number().required("This is a required field!"),
});

interface IProps {
    bank: IBusinessBank;
    toggleState: string;
    handleChange: () => void;
}

const Bank: React.FC<IProps> = ({ bank, handleChange, toggleState }) => {
    const [edit, setEdit] = useState<boolean>(false);

    useEffect(() => {
        if (toggleState === "Bank") {
            setEdit(false);
        }
    }, [toggleState]);

    const {
        control,
        setValue,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            accountHolderName: bank.accountHolderName,
            accountNumber: bank.accountNumber,
            imageUrl: bank.imageUrl,
            fileId: bank.fileId,
            name: bank.name,
            routingNumber: bank.routingNumber,
        },
    });

    const handleEdit = () => {
        setEdit((preVal) => !preVal);
    };

    const onSubmit = async (data: FormInputs) => {
        try {
            const payload: Partial<IBusinessBank> = {
                routingNumber: data.routingNumber,
                accountNumber: data.accountNumber,
                fileId: data.fileId,
                name: data.name,
                accountHolderName: data.accountHolderName,
                businessBankId: bank.businessBankId,
                imageUrl: data.imageUrl,
            };
            await MerchantService.updateBank(bank.businessBankId, payload);
            setEdit(false);
            handleChange();
        } catch (error) {
            reset(data);
        }
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

    return (
        <Spin spinning={false}>
            <div className="intro-x">
                <div className="font-bold text-lg mb-4 text-blue-500">Bank Information</div>
                {edit ? (
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                                <div className="col-span-12 sm:col-span-4 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        control={control}
                                        name={"accountHolderName"}
                                        placeholder="Enter account holder name"
                                        label="Account Holder Name"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-4 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        control={control}
                                        name={"name"}
                                        placeholder="Enter bank name"
                                        label="Bank Name"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-4 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        control={control}
                                        name={"routingNumber"}
                                        placeholder="Enter routing number"
                                        label="Routing Number"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-4 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        control={control}
                                        name={"accountNumber"}
                                        placeholder="Enter account number"
                                        label="Account Number"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-4 lg:col-span-4">
                                    <RHFUpload<FormInputs>
                                        control={control}
                                        name={`imageUrl`}
                                        accept="image/*,.pdf"
                                        allowPdf
                                        action={`${API_BASE_URL}File?allowOtherFile=true`}
                                        label="Void Check"
                                        onUploaded={function (fileId: number, path: string): void {
                                            setValue("fileId", fileId, { shouldValidate: true });
                                            setValue("imageUrl", path, { shouldValidate: true });
                                        }}
                                    />
                                </div>
                                <div className="col-span-12" />
                                <div className="col-span-12">
                                    <div className="flex gap-x-2">
                                        <Button onClick={handleEdit} disabled={isSubmitting} title="Cancel" />
                                        <Button loading={isSubmitting} type="submit" title="Save" btnType="ok" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="grid grid-cols-12 gap-6 mb-4 intro-x">
                        <div className="sm:col-span-4 col-span-12">
                            <div className="text-sm font-semibold mb-2">Account Holder Name</div>
                            <div className="text-sm">{bank.accountHolderName}</div>
                        </div>
                        <div className="sm:col-span-4 col-span-12">
                            <div className="text-sm font-semibold mb-2">Bank Name</div>
                            <div className="text-sm">{bank.name}</div>
                        </div>
                        <div className="sm:col-span-4 col-span-12">
                            <div className="text-sm font-semibold mb-2">Routing Number</div>
                            <div className="text-sm">{bank.routingNumber}</div>
                        </div>
                        <div className="sm:col-span-12 col-span-12">
                            <div className="text-sm font-semibold mb-2">Account Number</div>
                            <div className="text-sm">{bank.accountNumber}</div>
                        </div>
                        <div className="sm:col-span-4 col-span-12">
                            <div className="text-sm font-semibold mb-2">Void Check</div>
                            <div className="text-sm">
                                {isPdfFile(bank?.imageUrl) ? (
                                    renderPdf(bank?.imageUrl)
                                ) : (
                                    <img src={bank?.imageUrl} alt="" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {!edit && <Button btnType="ok" onClick={handleEdit} title={"Edit"} />}
            </div>
        </Spin>
    );
};

export default Bank;
