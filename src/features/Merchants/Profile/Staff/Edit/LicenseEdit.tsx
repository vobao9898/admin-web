import { Modal } from "antd";
import { RHFCustomSSNInput, RHFTextField } from "components/Form";
import { useForm } from "react-hook-form";
import { testValidSSN, cleanSSN } from "utils";
import { MASK_SOCIAL_SECURITY_NUMBER } from "contants";
import { useEffect } from "react";
import Message from "components/Message";
import ModalButton from "components/ModalButton";
import IStaff from "interfaces/IStaff";
import MerchantService from "services/MerchantService";

interface IProps {
    staff: IStaff;
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
    driverLicense: string;
    professionalLicense: string;
    socialSecurityNumber: string;
};

const LicenseEdit: React.FC<IProps> = ({ staff, open, onClose, onSuccess }) => {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            socialSecurityNumber: staff.ssn,
            professionalLicense: staff.professionalLicense,
            driverLicense: staff.driverLicense,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                socialSecurityNumber: staff.ssn,
                professionalLicense: staff.professionalLicense,
                driverLicense: staff.driverLicense,
            });
        }
    }, [reset, open, staff]);

    const onSubmit = async (data: FormInputs) => {
        if (staff) {
            const payload = {
                firstName: staff.firstName,
                lastName: staff.lastName,
                displayName: staff.displayName,
                address: {
                    street: staff.address,
                    city: staff.city,
                    zip: staff.zip,
                    state: staff.stateId,
                    stateId: staff.stateId,
                },
                cellphone: staff.phone,
                email: staff.email,
                pin: staff.pin,
                isActive: staff.isActive,
                roles: {
                    nameRole: staff.roleName,
                    statusRole: "",
                },
                isDisabled: staff.isDisabled,
                fileId: staff.fileId,
                driverLicense: data.driverLicense,
                socialSecurityNumber: cleanSSN(data.socialSecurityNumber),
                professionalLicense: data.professionalLicense,
                workingTime: staff.workingTimes,
                salary: {
                    commission: {
                        isCheck: staff?.salaries?.commission?.isCheck,
                        value:
                            staff?.salaries?.commission?.value && staff?.salaries?.commission?.value?.length
                                ? staff?.salaries?.commission?.value
                                : [{ from: 0, to: 0, salaryPercent: 0, commission: 0 }],
                    },
                    perHour: staff?.salaries.perHour,
                },
                productSalary: staff?.productSalaries,
                cashPercent: staff?.cashPercent,
                tipFee: staff?.tipFees,
                categories: staff?.categories,
            };
            try {
                const message = await MerchantService.editGeneralStaff(payload, staff?.staffId);
                Message.success({ text: message });
                onSuccess();
            } catch (error) {
                reset(data);
            }
        }
    };

    const afterClose = () => {
        reset();
    };

    return (
        <Modal
            centered={true}
            width={900}
            maskClosable={false}
            destroyOnClose={true}
            open={open}
            title={<p className="font-bold text-lg">{"Edit"}</p>}
            afterClose={afterClose}
            onCancel={onClose}
            footer={
                <div className="flex justify-end gap-x-2">
                    <ModalButton
                        disabled={isSubmitting}
                        title="Cancel"
                        type={"button"}
                        btnType="cancel"
                        onClick={onClose}
                    />
                    <ModalButton
                        loading={isSubmitting}
                        disabled={isSubmitting || !isDirty}
                        title="Save"
                        type={"submit"}
                        btnType="save"
                        onClick={handleSubmit(onSubmit)}
                    />
                </div>
            }
        >
            <form>
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
                                        return !testValidSSN(value as string)
                                            ? "Invalid social security number!"
                                            : true;
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
                </div>
            </form>
        </Modal>
    );
};

export default LicenseEdit;
