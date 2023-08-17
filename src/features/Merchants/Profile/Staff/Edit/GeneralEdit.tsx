import { Modal, Space } from "antd";
import { useForm } from "react-hook-form";
import { RHFCheckBox, RHFPhoneInput, RHFSearchTextField, RHFSelect, RHFTextField, RHFUpload } from "components/Form";
import { cleanPhoneNumber, cleanSSN, getCodeAndPhoneNumber, getOptionsState, testValidPhone } from "utils";
import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL, PHONE_CODES, REGEX_EMAIL, MASK_PHONE_NUMER } from "contants";
import IStaff from "interfaces/IStaff";
import IState from "interfaces/IState";
import Label from "components/Label";
import HelperText from "components/HelperText";
import classNames from "classnames";
import MerchantService from "services/MerchantService";
import Message from "components/Message";
import debounce from "lodash/debounce";
import StateService from "services/StateService";
import ModalButton from "components/ModalButton";

const ROLE_OPTIONS = [
    { value: "Admin", label: "Admin" },
    { value: "Staff", label: "Staff" },
    { value: "Manager", label: "Manager" },
];

const STATUS_OPTIONS = [
    { value: 0, label: "Active" },
    { value: 1, label: "Inactive" },
];

interface IProps {
    staff: IStaff;
    open: boolean;
    merchantId: number;
    state?: IState[];
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
    firstName: string;
    lastName: string;
    displayName: string;
    address: string;
    city: string;
    stateId: number;
    zip: string;
    codePhone: number;
    phone: string;
    email: string;
    pin: string;
    roleName: string;
    isDisabled: number;
    isActive: boolean;
    imageUrl: string;
    fileId: number;
};

const GeneralEdit: React.FC<IProps> = ({ staff, merchantId, open, state, onClose, onSuccess }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [codePhone, phoneNumber] = getCodeAndPhoneNumber(staff.phone);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            firstName: staff.firstName,
            lastName: staff.lastName,
            displayName: staff.displayName,
            address: staff.address,
            city: staff.city,
            stateId: staff.stateId ? staff.stateId : undefined,
            zip: staff.zip,
            codePhone: codePhone,
            phone: phoneNumber,
            email: staff.email,
            pin: staff.pin,
            roleName: staff.roleName,
            isDisabled: staff.isDisabled,
            isActive: staff.isActive,
            imageUrl: staff.imageUrl,
            fileId: staff.fileId,
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                firstName: staff.firstName,
                lastName: staff.lastName,
                displayName: staff.displayName,
                address: staff.address,
                city: staff.city,
                stateId: staff.stateId ? staff.stateId : undefined,
                zip: staff.zip,
                codePhone: codePhone,
                phone: phoneNumber,
                email: staff.email,
                pin: staff.pin,
                roleName: staff.roleName,
                isDisabled: staff.isDisabled,
                isActive: staff.isActive,
                imageUrl: staff.imageUrl,
                fileId: staff.fileId,
            });
        }
    }, [reset, open, staff, codePhone, phoneNumber]);

    const onSubmit = async (data: FormInputs) => {
        if (staff) {
            const phone = cleanPhoneNumber(`${data.codePhone} ${data.phone}`);
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                displayName: data.displayName,
                address: {
                    street: data.address,
                    city: data.city,
                    zip: data.zip,
                    state: data.stateId,
                    stateId: data.stateId,
                },
                cellphone: phone !== "1" && phone !== "84" ? phone : "",
                email: data.email,
                pin: data.pin,
                isActive: data.isActive,
                roles: {
                    nameRole: data.roleName,
                    statusRole: "",
                },
                isDisabled: data.isDisabled,
                fileId: data.fileId,
                driverLicense: staff.driverLicense,
                socialSecurityNumber: cleanSSN(staff.socialSecurityNumber),
                professionalLicense: staff.professionalLicense,
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
                await MerchantService.getPin(merchantId, staff?.staffId, data.pin);
                const message = await MerchantService.editGeneralStaff(payload, staff?.staffId);
                Message.success({ text: message });
                onSuccess();
            } catch (error) {
                reset(data);
                if (typeof error === "string") {
                    Message.error({ text: error });
                }
            }
        }
    };

    const afterClose = () => {
        reset();
    };

    const toggleShowPassword = () => {
        setShowPassword((preVal) => !preVal);
    };
    const debounceZipCode = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value) {
            const data = await StateService.getSuggestionByZipCode(value);
            if (data && data.stateId) {
                const address = getValues("address");
                Modal.confirm({
                    title: "Are you want to replace?",
                    content: (
                        <div>
                            <div>Address: {address}</div>
                            <div>City: {data?.city}</div>
                            <div>State: {data?.stateName}</div>
                            <div>Zip code: {data?.zipCode}</div>
                        </div>
                    ),
                    onOk() {
                        setValue("city", data.city, { shouldValidate: true });
                        setValue("stateId", data.stateId, { shouldValidate: true });
                        setValue("zip", data.zipCode, { shouldValidate: true });
                    },
                    onCancel() {},
                });
            }
        }
    }, 500);

    const handleChangeZipCode = useCallback(debounceZipCode, [debounceZipCode]);

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
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"firstName"}
                            placeholder="Enter first name"
                            label="First Name"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"lastName"}
                            placeholder="Enter last name"
                            label="Last Name"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"displayName"}
                            placeholder="Enter display name"
                            label="Display Name"
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"address"}
                            placeholder="Enter address"
                            label="Address"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            control={control}
                            name={"city"}
                            placeholder="Enter city"
                            label="City"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFSelect<FormInputs>
                            className="w-full"
                            control={control}
                            name={"stateId"}
                            options={state ? getOptionsState(state) : []}
                            placeholder="State"
                            label="State"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFSearchTextField<FormInputs>
                            rules={{
                                pattern: {
                                    value: new RegExp("^[0-9]+$"),
                                    message: "Please enter only number!",
                                },
                            }}
                            handleOnChange={handleChangeZipCode}
                            control={control}
                            name={"zip"}
                            placeholder="Enter Zip code"
                            label="Zip code"
                            labelRequired={false}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <Label title="Phone" required />
                        <Space.Compact className="w-full">
                            <RHFSelect<FormInputs>
                                control={control}
                                name={"codePhone"}
                                options={PHONE_CODES}
                                showError={false}
                                showSearch={false}
                                className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                            />
                            <RHFPhoneInput<FormInputs>
                                rules={{
                                    validate: {
                                        checkPhoneValid: (value) => {
                                            if (value === undefined || value === "" || value === null) {
                                                return true;
                                            } else {
                                                const codePhone = getValues("codePhone");
                                                return !testValidPhone(codePhone, value as string)
                                                    ? "Invalid phone number"
                                                    : true;
                                            }
                                        },
                                    },
                                }}
                                mask={MASK_PHONE_NUMER}
                                control={control}
                                name={"phone"}
                                placeholder="Enter phone number"
                                showError={false}
                            />
                        </Space.Compact>
                        <HelperText message={errors.phone?.message || ""} />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                                pattern: {
                                    value: REGEX_EMAIL,
                                    message: "Please enter a valid email address!",
                                },
                            }}
                            control={control}
                            name={"email"}
                            placeholder="Enter contact email"
                            label="Contact Email"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                                pattern: {
                                    value: new RegExp("(?=.{4,})^[0-9]+$"),
                                    message: "Please enter only number and at least 4 characters!",
                                },
                            }}
                            control={control}
                            name={"pin"}
                            placeholder="Enter pin code"
                            label="Pin"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                                <i
                                    onClick={toggleShowPassword}
                                    className={classNames(
                                        "cursor-pointer text-lg las absolute top-1.5 right-3 z-10",
                                        { "la-eye-slash": !showPassword },
                                        { "la-eye": showPassword }
                                    )}
                                />
                            }
                            maxLength={4}
                        />
                    </div>
                    <div className="col-span-12">
                        <div className="flex space-x-1">
                            <RHFCheckBox<FormInputs> control={control} name={"isActive"} />
                            <span>Visible on App</span>
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <RHFSelect<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            className="w-full"
                            control={control}
                            name={"roleName"}
                            options={ROLE_OPTIONS}
                            placeholder="Role"
                            label="Role"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <RHFSelect<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            className="w-full"
                            control={control}
                            name={"isDisabled"}
                            options={STATUS_OPTIONS}
                            placeholder="Status"
                            label="Status"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFUpload<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={`imageUrl`}
                            accept="image/*"
                            action={`${API_BASE_URL}File`}
                            label="Image"
                            onUploaded={function (fileId: number, path: string): void {
                                setValue(`fileId`, fileId, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                                setValue(`imageUrl`, path, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                });
                            }}
                            labelRequired={false}
                        />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default GeneralEdit;
