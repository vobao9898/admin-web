import { useForm } from "react-hook-form";
import { RHFCustomSSNInput, RHFTextField } from "components/Form";
import { testValidSSN } from "utils";
import { ILicense } from "./index";
import { MASK_SOCIAL_SECURITY_NUMBER } from "contants";
import Button from "components/Button";
interface IProps {
    data?: ILicense;
    onSubmitData: (data: ILicense) => void;
}

type FormInputs = {
    driverLicense: string;
    professionalLicense: string;
    socialSecurityNumber: string;
};

const License: React.FC<IProps> = ({ onSubmitData, data }) => {
    const { control, handleSubmit } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            socialSecurityNumber: data?.socialSecurityNumber || "",
            professionalLicense: data?.professionalLicense || "",
            driverLicense: data?.driverLicense || "",
        },
    });

    const onSubmit = (data: FormInputs) => {
        const license: ILicense = {
            driverLicense: data.driverLicense,
            professionalLicense: data.professionalLicense,
            socialSecurityNumber: data.socialSecurityNumber,
        };
        onSubmitData(license);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <RHFTextField<FormInputs>
                        rules={{
                            pattern: {
                                value: /^[A-Za-z0-9]*$/,
                                message: "Driver License Number Invalid!",
                            },
                        }}
                        control={control}
                        name={`driverLicense`}
                        placeholder="Enter driver license number"
                        label="Driver License Number"
                        labelRequired={false}
                    />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <RHFCustomSSNInput<FormInputs>
                        rules={{
                            validate: {
                                ssnValid: (value) => {
                                    if (!value) return true;
                                    return !testValidSSN(value as string) ? "Invalid social security number!" : true;
                                },
                            },
                        }}
                        mask={MASK_SOCIAL_SECURITY_NUMBER}
                        control={control}
                        name={`socialSecurityNumber`}
                        placeholder="Enter social security number"
                        label="Social Security Number"
                        labelRequired={false}
                    />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                    <RHFTextField<FormInputs>
                        control={control}
                        name={`professionalLicense`}
                        placeholder="Enter professional license"
                        label="Professional License"
                        labelRequired={false}
                    />
                </div>
                <div className="col-span-12 flex justify-between">
                    <Button title="Submit" type="submit" btnType="ok" />
                </div>
            </div>
        </form>
    );
};

export default License;
