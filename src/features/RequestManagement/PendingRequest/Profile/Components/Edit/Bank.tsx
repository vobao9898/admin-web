import React from "react";
import { RHFTextField, RHFUpload } from "components/Form";
import { Control, UseFormSetValue } from "react-hook-form";
import { FormInputs } from "./index";
import { API_BASE_URL } from "contants";

interface IProps {
    control: Control<FormInputs, any>;
    setValue: UseFormSetValue<FormInputs>;
}

const Bank: React.FC<IProps> = ({ control, setValue }) => {
    return (
        <>
            <div className="col-span-12 pb-3 mt-3">
                <h4 className="font-semibold text-blue-500 text-xl">Bank Information</h4>
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <RHFTextField<FormInputs>
                    rules={{
                        required: "This is a required field!",
                    }}
                    control={control}
                    name={"accountHolderName"}
                    placeholder="Enter Account Holder Name"
                    label="Account Holder Name"
                />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <RHFTextField<FormInputs>
                    rules={{
                        required: "This is a required field!",
                    }}
                    control={control}
                    name={"name"}
                    placeholder="Enter Bank Name"
                    label="Bank Name"
                />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <RHFTextField<FormInputs>
                    rules={{
                        required: "This is a required field!",
                        pattern: {
                            value: new RegExp("^[0-9]+$"),
                            message: "Please enter only number!",
                        },
                    }}
                    control={control}
                    name={"routingNumber"}
                    placeholder="Enter Routing Number (ABA)"
                    label="Routing Number (ABA)"
                />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <RHFTextField<FormInputs>
                    rules={{
                        required: "This is a required field!",
                        pattern: {
                            value: new RegExp("^[0-9]+$"),
                            message: "Please enter only number!",
                        },
                    }}
                    control={control}
                    name={"accountNumber"}
                    placeholder="Enter Account Number (DDA)"
                    label="Account Number (DDA)"
                />
            </div>
            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                <RHFUpload<FormInputs>
                    control={control}
                    name="imageUrl"
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
        </>
    );
};

export default Bank;
