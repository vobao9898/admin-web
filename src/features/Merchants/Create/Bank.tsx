import { RHFTextField, RHFUpload } from "components/Form";
import { useForm } from "react-hook-form";
import { BankInfo } from "dtos/ICreateMerchant";
import { FC } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { API_BASE_URL } from "contants";
import Button from "components/Button";
import * as yup from "yup";

type FormInputs = {
    accountHolderName: string;
    bankName: string;
    routingNumber: string;
    accountNumber: string;
    fileId: number;
    fileUrl: string;
};

const schema = yup.object({
    accountHolderName: yup.string().required("This is a required field!"),
    bankName: yup.string().required("This is a required field!"),
    accountNumber: yup
        .string()
        .required("This is a required field!")
        .matches(new RegExp("^[0-9]+$"), "Please enter only number!"),
    routingNumber: yup
        .string()
        .required("This is a required field!")
        .matches(new RegExp("^[0-9]+$"), "Please enter only number!"),
    fileUrl: yup.string().required("This is a required field!"),
    fileId: yup.number().required("This is a required field!"),
});

interface IProps {
    bank?: BankInfo;
    onSubmitBank: (data: BankInfo) => void;
}

const Bank: FC<IProps> = ({ bank, onSubmitBank }) => {
    const { control, handleSubmit, setValue } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            accountHolderName: bank ? bank.accountHolderName : "",
            bankName: bank ? bank.bankName : "",
            routingNumber: bank ? bank.routingNumber : "",
            accountNumber: bank ? bank.accountNumber : "",
            fileId: bank ? bank.fileId : undefined,
            fileUrl: bank ? bank.fileUrl : "",
        },
    });

    const onSubmit = (data: FormInputs) => {
        const bank: BankInfo = {
            accountHolderName: data.accountHolderName,
            routingNumber: data.routingNumber,
            accountNumber: data.accountNumber,
            bankName: data.bankName,
            fileId: data.fileId,
            fileUrl: data.fileUrl,
        };
        onSubmitBank(bank);
    };

    return (
        <div>
            <div className="font-bold text-lg mb-4 text-blue-500">Bank Information</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"accountHolderName"}
                            placeholder="Enter account holder name"
                            label="Account Holder Name"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"bankName"}
                            placeholder="Enter bank name"
                            label="Bank Name"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"routingNumber"}
                            placeholder="Enter routing number"
                            label="Routing Number"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"accountNumber"}
                            placeholder="Enter account number"
                            label="Account Number"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFUpload<FormInputs>
                            control={control}
                            name="fileUrl"
                            accept="image/*,.pdf"
                            allowPdf
                            action={`${API_BASE_URL}File?allowOtherFile=true`}
                            label="Void Check"
                            onUploaded={function (fileId: number, path: string): void {
                                setValue("fileId", fileId, { shouldValidate: true });
                                setValue("fileUrl", path, { shouldValidate: true });
                            }}
                        />
                    </div>
                    <div className="col-span-12">
                        <Button type="submit" title="Next" btnType="ok" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Bank;
