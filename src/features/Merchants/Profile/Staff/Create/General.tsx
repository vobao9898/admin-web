import { Modal, Space, Tree } from "antd";
import { API_BASE_URL, MASK_PHONE_NUMER, PHONE_CODES, REGEX_EMAIL } from "contants";
import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { IGeneral } from "./index";
import { getCodeAndPhoneNumber, getOptionsState, testValidPhone, cleanPhoneNumber } from "utils";
import { RHFCheckBox, RHFPhoneInput, RHFSearchTextField, RHFSelect, RHFTextField, RHFUpload } from "components/Form";
import type { DataNode } from "antd/es/tree";
import { Key } from "react";
import HelperText from "components/HelperText";
import Label from "components/Label";
import IState from "interfaces/IState";
import MerchantService from "services/MerchantService";
import StateService from "services/StateService";
import classNames from "classnames";
import Button from "components/Button";

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
    treeData: DataNode[];
    checkedKeys: React.Key[];
    merchantId: number;
    data?: IGeneral;
    state: IState[];
    onSubmitData: (data: IGeneral) => void;
    onCheck: (checkedKeysValue: Key[] | { checked: Key[]; halfChecked: Key[] }) => void;
}

type FormInputs = {
    firstName: string;
    lastName: string;
    displayName: string;
    street: string;
    city: string;
    stateId: number;
    zip: string;
    codePhone: number;
    phone: string;
    email: string;
    pin: string;
    ConfirmPin: string;
    roleName: string;
    isDisabled: number;
    isVisible: boolean;
    imageUrl: string;
    fileId: number;
};

const General: React.FC<IProps> = ({ state, checkedKeys, merchantId, data, treeData, onSubmitData, onCheck }) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [codePhone, phoneNumber] = getCodeAndPhoneNumber(data?.cellphone || "");

    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        setError,
        formState: { errors },
    } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            firstName: data?.firstName || "",
            lastName: data?.lastName || "",
            displayName: data?.displayName || "",
            street: data?.address?.street || "",
            city: data?.address?.city || "",
            stateId: data?.address ? data.address?.state : undefined,
            zip: data?.address ? data.address?.zip : "",
            codePhone: codePhone,
            phone: phoneNumber,
            email: data?.email || "",
            pin: data?.pin || "",
            ConfirmPin: data?.ConfirmPin || "",
            roleName: data?.roles ? data.roles?.nameRole : "Admin",
            isDisabled: data?.isDisabled !== undefined ? data?.isDisabled : 0,
            isVisible: data?.isActive !== undefined ? data?.isActive : true,
            imageUrl: data?.imageUrl || "",
            fileId: data?.fileId || 0,
        },
    });

    const onSubmit = async (data: FormInputs) => {
        try {
            await MerchantService.getPin(merchantId, 0, data.pin);

            const general: IGeneral = {
                firstName: data.firstName,
                lastName: data.lastName,
                displayName: data.displayName,
                email: data.email,
                pin: data.pin,
                ConfirmPin: data.ConfirmPin,
                isActive: data.isVisible,
                isDisabled: data.isDisabled,
                fileId: data.fileId,
                imageUrl: data.imageUrl,
                cellphone: cleanPhoneNumber(`${data.codePhone} ${data.phone}`),
                roles: {
                    nameRole: data.roleName,
                    statusRole: "",
                },
                address: {
                    street: data.street,
                    city: data.city,
                    zip: data.zip,
                    state: data.stateId,
                },
            };
            onSubmitData(general);
        } catch (error) {
            setError("pin", {
                type: "manual",
                message: "Pincode is exists.",
            });
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((preVal) => !preVal);
    };

    const debounceZipCode = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value) {
            const data = await StateService.getSuggestionByZipCode(value);
            if (data && data.stateId) {
                const street = getValues("street");
                Modal.confirm({
                    title: "Are you want to replace?",
                    content: (
                        <div>
                            <div>Address: {street}</div>
                            <div>City: {data?.city}</div>
                            <div>State: {data?.stateName}</div>
                            <div>Zip code: {data?.zipCode}</div>
                        </div>
                    ),
                    onOk() {
                        setValue("city", data.city, {
                            shouldValidate: true,
                        });
                        setValue("stateId", data.stateId, {
                            shouldValidate: true,
                        });
                        setValue("zip", data.zipCode, {
                            shouldValidate: true,
                        });
                    },
                    onCancel() {},
                });
            }
        }
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeZipCode = useCallback(debounceZipCode, []);

    const handleBlur = async (value: string) => {
        try {
            await MerchantService.getPin(merchantId, 0, value);
        } catch (error) {
            setError("pin", {
                type: "manual",
                message: "Pincode is exists.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                <div className="col-span-12">
                    <h3 className="font-bold text-lg text-blue-500">New Staff</h3>
                </div>
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
                        name={"street"}
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
                        options={getOptionsState(state)}
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
                    <Label title="Phone" required={false} />
                    <Space.Compact className="w-full">
                        <RHFSelect<FormInputs>
                            control={control}
                            name={"codePhone"}
                            options={PHONE_CODES}
                            showError={false}
                            showSearch={false}
                            className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                            labelRequired={false}
                        />
                        <RHFPhoneInput<FormInputs>
                            rules={{
                                validate: {
                                    phoneValid: (value) => {
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
                            labelRequired={false}
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
                    <RHFSearchTextField<FormInputs>
                        rules={{
                            required: "This is a required field!",
                            pattern: {
                                value: new RegExp("(?=.{4,})^[0-9]+$"),
                                message: "Please enter only number and at least 4 characters!",
                            },
                        }}
                        handleOnBlur={handleBlur}
                        control={control}
                        name={"pin"}
                        maxLength={4}
                        placeholder="Enter pin code"
                        label="Pin"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                            <i
                                onClick={toggleShowPassword}
                                className={classNames(
                                    "cursor-pointer text-lg las absolute top-1.5 right-3 z-10",
                                    {
                                        "la-eye-slash": !showPassword,
                                    },
                                    {
                                        "la-eye": showPassword,
                                    }
                                )}
                            />
                        }
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
                            validate: {
                                matchPinCode: (value) => {
                                    const pinCode = getValues("pin");
                                    return value === pinCode || "Pin do not match";
                                },
                            },
                        }}
                        control={control}
                        name={"ConfirmPin"}
                        placeholder="Enter confirm pin"
                        label="Confirm Pin"
                        type={showPassword ? "text" : "password"}
                        endAdornment={
                            <i
                                onClick={toggleShowPassword}
                                className={classNames(
                                    "cursor-pointer text-lg las absolute top-1.5 right-3 z-10",
                                    {
                                        "la-eye-slash": !showPassword,
                                    },
                                    {
                                        "la-eye": showPassword,
                                    }
                                )}
                            />
                        }
                        maxLength={4}
                    />
                </div>
                <div className="col-span-12">
                    <div className="flex space-x-1">
                        <RHFCheckBox<FormInputs> control={control} name={"isVisible"} />
                        <span className="text-sm leading-non">Visible on App</span>
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
                        control={control}
                        name={`imageUrl`}
                        accept="image/*"
                        action={`${API_BASE_URL}File`}
                        label="Image"
                        labelRequired={false}
                        onUploaded={function (fileId: number, path: string): void {
                            setValue(`fileId`, fileId, {
                                shouldValidate: true,
                            });
                            setValue(`imageUrl`, path, {
                                shouldValidate: true,
                            });
                        }}
                    />
                </div>
                <div className="col-span-12">
                    <h3 className="font-bold text-lg text-blue-500">
                        Services (Assign services this staff can be perform)
                    </h3>
                </div>
                <div className="col-span-12">
                    <Tree checkedKeys={checkedKeys} checkable treeData={treeData} onCheck={onCheck} />
                </div>
                <div className="col-span-12">
                    <Button type="submit" title="Next" btnType="ok" />
                </div>
            </div>
        </form>
    );
};

export default General;
