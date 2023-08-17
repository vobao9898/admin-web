import { Space, Modal } from "antd";
import {
    RHFCustomSSNInput,
    RHFDatePicker,
    RHFPhoneInput,
    RHFSearchTextField,
    RHFSelect,
    RHFTextField,
    RHFUpload,
} from "components/Form";
import { API_BASE_URL, MASK_PHONE_NUMER, MASK_SOCIAL_SECURITY_NUMBER, PHONE_CODES, REGEX_EMAIL } from "contants";
import { IPrincipal as IPrincipalDTO } from "features/Merchants/Create/Principal";
import { Control, FieldArrayWithId, FieldErrors, UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { getCodeAndPhoneNumber, getOptionsState, testValidPhone, testValidSSN } from "utils";
import { FormInputs } from "./index";
import HelperText from "components/HelperText/HelperText";
import Label from "components/Label/Label";
import IState from "interfaces/IState";
import React from "react";
import PrincipalService from "services/PrincipalService";
import StateService from "services/StateService";
import debounce from "lodash/debounce";

interface IProps {
    control: Control<FormInputs, any>;
    fields: FieldArrayWithId<FormInputs, "principals", "id">[];
    errors: FieldErrors<FormInputs>;
    state: IState[];
    getValues: UseFormGetValues<FormInputs>;
    setValue: UseFormSetValue<FormInputs>;
    addMorePrincipal: () => void;
    remove: (index: number) => void;
}

const Principals: React.FC<IProps> = ({
    control,
    fields,
    errors,
    state,
    getValues,
    setValue,
    addMorePrincipal,
    remove,
}) => {
    const isDisableField = (values: IPrincipalDTO[], i: number) => {
        return Boolean(values && values[i] && values[i].principalId);
    };

    const handleBlur = async (index: number, value: string, type: "email" | "ssn") => {
        if (
            value &&
            ((type === "email" && REGEX_EMAIL.test(value.trim())) || (type === "ssn" && testValidSSN(value)))
        ) {
            let keyword = value;

            if (type === "ssn") {
                keyword = value.replaceAll("-", "");
            }

            const principal = await PrincipalService.getPrincipalByKey(type, keyword);

            if (principal) {
                const newPricinpals = getValues("principals");
                if (newPricinpals && newPricinpals[index]) {
                    const [codeHomePhone, homePhoneNumber] = getCodeAndPhoneNumber(principal.homePhone);
                    const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(principal.mobilePhone);

                    const newPrincipal: IPrincipalDTO = {
                        principalId: principal.principalId,
                        firstName: principal.firstName,
                        lastName: principal.lastName,
                        title: principal.title,
                        ownerShip: principal.ownerShip.toString(),
                        codeHomePhone: codeHomePhone,
                        codeMobilePhone: codeMobilePhone,
                        homePhone: homePhoneNumber,
                        mobilePhone: mobilePhoneNumber,
                        email: principal.email,
                        address: principal.address,
                        city: principal.city,
                        state: principal.stateId,
                        zip: principal.zip,
                        yearAtThisAddress: principal.yearAddress,
                        ssn: principal.ssn.replace(/[^\d]/g, ""),
                        birthDate: new Date(principal.birthDate),
                        driverNumber: principal.driverNumber,
                        stateIssued: principal.stateIssued,
                        fileUrl: principal.imageUrl,
                        fileId: principal.fileId,
                    };

                    setValue(`principals.${index}`, newPrincipal, { shouldValidate: true });
                }
            }
        }
    };

    const debounceZipCode = debounce(async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = event.target;
        if (value) {
            const data = await StateService.getSuggestionByZipCode(value);
            const address = getValues(`principals.${index}.address`);
            if (data && data.stateId) {
                Modal.confirm({
                    title: "Are you want to replace?",
                    content: (
                        <div>
                            <div>Business Address: {address}</div>
                            <div>City: {data?.city}</div>
                            <div>State: {data?.stateName}</div>
                            <div>Zip code: {data?.zipCode}</div>
                        </div>
                    ),
                    onOk() {
                        setValue(`principals.${index}.city`, data.city, { shouldValidate: true });
                        setValue(`principals.${index}.state`, data.stateId, { shouldValidate: true });
                        setValue(`principals.${index}.zip`, data.zipCode, { shouldValidate: true });
                    },
                    onCancel() {},
                });
            }
        }
    }, 500);

    // TODO: Remove eslint comment
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeZipCode = React.useCallback(debounceZipCode, []);

    return (
        <div className="flex flex-col gap-y-4 mt-5">
            {fields.map((item, index) => {
                const disable = isDisableField(getValues("principals"), index);
                return (
                    <div key={item.id} className="grid gap-x-5 gap-y-2 grid-cols-12">
                        <div className="col-span-12">
                            <h4 className="font-semibold text-blue-500 text-xl">{`Principal ${index + 1}`}</h4>
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={`principals.${index}.firstName`}
                                placeholder="Enter first name"
                                label="First Name"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={`principals.${index}.lastName`}
                                placeholder="Enter last name"
                                label="Last Name"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={`principals.${index}.title`}
                                placeholder="Enter title/position"
                                label="Title/Position"
                                disabled={disable}
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
                                name={`principals.${index}.ownerShip`}
                                placeholder="Enter ownership"
                                label="Ownership"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-12 lg:col-span-12" />
                        <div className="col-span-12 sm:col-span-12 lg:col-span-12">
                            <Label title="Home Phone" required />
                            <Space.Compact className="w-full">
                                <RHFSelect<FormInputs>
                                    control={control}
                                    name={`principals.${index}.codeHomePhone`}
                                    options={PHONE_CODES}
                                    showError={false}
                                    showSearch={false}
                                    className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                                    disabled={disable}
                                />
                                <RHFPhoneInput<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                        validate: {
                                            homePhoneValid: (value) => {
                                                const codePhone = getValues(`principals.${index}.codeHomePhone`);
                                                return !testValidPhone(codePhone, value as string)
                                                    ? "Invalid home phone"
                                                    : true;
                                            },
                                        },
                                    }}
                                    mask={MASK_PHONE_NUMER}
                                    control={control}
                                    name={`principals.${index}.homePhone`}
                                    placeholder="Enter phone number"
                                    showError={false}
                                    disabled={disable}
                                />
                            </Space.Compact>
                            <HelperText message={errors.principals?.[index]?.homePhone?.message || ""} />
                        </div>
                        <div className="col-span-12 sm:col-span-12 lg:col-span-12">
                            <Label title="Mobile Phone" required />
                            <Space.Compact className="w-full">
                                <RHFSelect<FormInputs>
                                    control={control}
                                    name={`principals.${index}.codeMobilePhone`}
                                    options={PHONE_CODES}
                                    showError={false}
                                    showSearch={false}
                                    className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                                    disabled={disable}
                                />
                                <RHFPhoneInput<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                        validate: {
                                            mobilePhoneValid: (value) => {
                                                const codePhone = getValues(`principals.${index}.codeMobilePhone`);
                                                return !testValidPhone(codePhone, value as string)
                                                    ? "Invalid mobile phone"
                                                    : true;
                                            },
                                        },
                                    }}
                                    mask={MASK_PHONE_NUMER}
                                    control={control}
                                    name={`principals.${index}.mobilePhone`}
                                    placeholder="Enter mobile phone"
                                    showError={false}
                                    disabled={disable}
                                />
                            </Space.Compact>
                            <HelperText message={errors.principals?.[index]?.mobilePhone?.message || ""} />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFSearchTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: REGEX_EMAIL,
                                        message: "Please enter a valid email address!",
                                    },
                                }}
                                handleOnBlur={(value) => handleBlur(index, value, "email")}
                                control={control}
                                name={`principals.${index}.email`}
                                placeholder="Enter emaill address"
                                label="Email Address"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={`principals.${index}.address`}
                                placeholder="Enter address"
                                label="Address"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={`principals.${index}.city`}
                                placeholder="Enter city"
                                label="City"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFSelect<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                className="w-full"
                                control={control}
                                name={`principals.${index}.state`}
                                options={getOptionsState(state)}
                                placeholder="State"
                                label="State"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFSearchTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: new RegExp("^[0-9]+$"),
                                        message: "Please enter only number!",
                                    },
                                }}
                                handleOnChange={(event) => handleChangeZipCode(event, index)}
                                control={control}
                                name={`principals.${index}.zip`}
                                placeholder="Enter zip code"
                                label="Zip Code"
                                disabled={disable}
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
                                name={`principals.${index}.yearAtThisAddress`}
                                placeholder="Enter year at this address"
                                label="Year at this Address"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFCustomSSNInput<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    validate: {
                                        validSSN: (value) => {
                                            return !testValidSSN(value as string)
                                                ? "Invalid social security number!"
                                                : true;
                                        },
                                    },
                                }}
                                handleOnBlur={(value) => handleBlur(index, value, "ssn")}
                                disabled={disable}
                                mask={MASK_SOCIAL_SECURITY_NUMBER}
                                control={control}
                                name={`principals.${index}.ssn`}
                                placeholder="Enter social security number"
                                label="Social Security Number"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFDatePicker<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                className="w-full"
                                control={control}
                                name={`principals.${index}.birthDate`}
                                placeholder="Select date"
                                label="Date of birth"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-12 lg:col-span-12" />
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: /^[A-Za-z0-9]*$/,
                                        message: "Driver License Number Invalid!",
                                    },
                                }}
                                control={control}
                                name={`principals.${index}.driverNumber`}
                                placeholder="Enter driver license number"
                                label="Driver License Number"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFSelect<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                className="w-full"
                                control={control}
                                name={`principals.${index}.stateIssued`}
                                options={getOptionsState(state)}
                                placeholder="State Issued"
                                label="State Issued"
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFUpload<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={`principals.${index}.fileUrl`}
                                accept="image/*,.pdf"
                                allowPdf
                                action={`${API_BASE_URL}File?allowOtherFile=true`}
                                label="Driver License Picture"
                                onUploaded={function (fileId: number, path: string): void {
                                    setValue(`principals.${index}.fileId`, fileId, {
                                        shouldValidate: true,
                                    });
                                    setValue(`principals.${index}.fileUrl`, path, {
                                        shouldValidate: true,
                                    });
                                }}
                                disabled={disable}
                            />
                        </div>
                        <div className="col-span-12 mt-5">
                            <div className="flex justify-between items-center">
                                <div>
                                    {index ? (
                                        <i
                                            onClick={() => remove(index)}
                                            className="las la-trash-alt text-red-500 hover:text-red-400 cursor-pointer text-3xl"
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    onClick={addMorePrincipal}
                    className="rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-400 py-0.5 px-3 my-2"
                >
                    <i className="las la-plus mr-1 text-lg"></i>
                    <span className="relative -top-0.5">ADD PRINCIPAL</span>
                </button>
            </div>
        </div>
    );
};

export default Principals;
