import React from "react";
import HelperText from "components/HelperText";
import Button from "components/Button";
import Label from "components/Label";
import IState from "interfaces/IState";
import PrincipalService from "services/PrincipalService";
import StateService from "services/StateService";
import debounce from "lodash/debounce";
import { Space, Spin, Modal } from "antd";
import {
    RHFDatePicker,
    RHFPhoneInput,
    RHFSelect,
    RHFTextField,
    RHFUpload,
    RHFSearchTextField,
    RHFCustomSSNInput,
} from "components/Form";
import { API_BASE_URL, MASK_PHONE_NUMER, MASK_SOCIAL_SECURITY_NUMBER, PHONE_CODES, REGEX_EMAIL } from "contants";
import { useFieldArray, useForm } from "react-hook-form";
import { getOptionsState, testValidPhone, getCodeAndPhoneNumber, testValidSSN } from "utils";
import { DEFAUL_PRINCIPAL } from "./index";

export interface IPrincipal {
    principalId: number;
    firstName: string;
    lastName: string;
    title: string;
    ownerShip: string;
    codeHomePhone: number;
    codeMobilePhone: number;
    homePhone: string;
    mobilePhone: string;
    email: string;
    address: string;
    city: string;
    state: number;
    zip: string;
    yearAtThisAddress: string;
    ssn: string;
    birthDate: Date;
    driverNumber: string;
    stateIssued: number;
    fileUrl: string;
    fileId: number;
}

interface IProps {
    principals: IPrincipal[];
    state: IState[];
    onSubmitPrincipals: (pricinpals: IPrincipal[]) => void;
}

type FormInputs = {
    principals: IPrincipal[];
};

const Principal: React.FC<IProps> = ({ principals, state, onSubmitPrincipals }) => {
    const {
        control,
        setValue,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            principals: principals,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "principals",
    });

    const onSubmit = (data: FormInputs) => {
        onSubmitPrincipals(data.principals);
    };

    const addMorePrincipal = () => {
        append(DEFAUL_PRINCIPAL);
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

                    const newPrincipal: IPrincipal = {
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
                        ssn: principal.ssn,
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
            if (data && data.stateId) {
                Modal.confirm({
                    title: "Are you want to replace?",
                    content: (
                        <div>
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

    const isDisableField = (values: IPrincipal[], i: number) => {
        return Boolean(values && values[i] && values[i].principalId);
    };

    return (
        <Spin spinning={isSubmitting}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                    {fields.map((item, index) => {
                        const disable = isDisableField(getValues("principals"), index);
                        return (
                            <div key={item.id} className="grid gap-x-5 gap-y-2 grid-cols-12">
                                <div className="col-span-12">
                                    <h4 className="text-xl font-bold mb-2">{`Principal ${index + 1}`}</h4>
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.firstName`}
                                        placeholder="Enter first name"
                                        label="First Name"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.lastName`}
                                        placeholder="Enter last name"
                                        label="Last Name"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.title`}
                                        placeholder="Enter title/position"
                                        label="Title/Position"
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
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.ownerShip`}
                                        placeholder="Enter ownership"
                                        label="Ownership"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-12 lg:col-span-12" />
                                <div className="col-span-12 sm:col-span-12 lg:col-span-12">
                                    <Label title="Home Phone" required />
                                    <Space.Compact className="w-full">
                                        <RHFSelect<FormInputs>
                                            disabled={disable}
                                            control={control}
                                            name={`principals.${index}.codeHomePhone`}
                                            options={PHONE_CODES}
                                            showError={false}
                                            showSearch={false}
                                            className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                                        />
                                        <RHFPhoneInput<FormInputs>
                                            rules={{
                                                required: "This is a required field!",
                                                validate: {
                                                    homePhoneValid: (value) => {
                                                        const codePhone = getValues(
                                                            `principals.${index}.codeHomePhone`
                                                        );
                                                        return !testValidPhone(codePhone, value as string)
                                                            ? "Invalid home phone"
                                                            : true;
                                                    },
                                                },
                                            }}
                                            disabled={disable}
                                            mask={MASK_PHONE_NUMER}
                                            control={control}
                                            name={`principals.${index}.homePhone`}
                                            placeholder="Enter phone number"
                                            showError={false}
                                        />
                                    </Space.Compact>
                                    <HelperText message={errors.principals?.[index]?.homePhone?.message || ""} />
                                </div>
                                <div className="col-span-12 sm:col-span-12 lg:col-span-12">
                                    <Label title="Mobile Phone" required />
                                    <Space.Compact className="w-full">
                                        <RHFSelect<FormInputs>
                                            control={control}
                                            disabled={disable}
                                            name={`principals.${index}.codeMobilePhone`}
                                            options={PHONE_CODES}
                                            showError={false}
                                            showSearch={false}
                                            className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                                        />
                                        <RHFPhoneInput<FormInputs>
                                            rules={{
                                                required: "This is a required field!",
                                                validate: {
                                                    mobilePhoneValid: (value) => {
                                                        const codePhone = getValues(
                                                            `principals.${index}.codeHomePhone`
                                                        );
                                                        return !testValidPhone(codePhone, value as string)
                                                            ? "Invalid mobile phone"
                                                            : true;
                                                    },
                                                },
                                            }}
                                            disabled={disable}
                                            mask={MASK_PHONE_NUMER}
                                            control={control}
                                            name={`principals.${index}.mobilePhone`}
                                            placeholder="Enter mobile phone"
                                            showError={false}
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
                                        disabled={disable}
                                        handleOnBlur={(value) => handleBlur(index, value, "email")}
                                        control={control}
                                        name={`principals.${index}.email`}
                                        placeholder="Enter emaill address"
                                        label="Email Address"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.address`}
                                        placeholder="Enter address"
                                        label="Address"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.city`}
                                        placeholder="Enter city"
                                        label="City"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFSelect<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        disabled={disable}
                                        className="w-full"
                                        control={control}
                                        name={`principals.${index}.state`}
                                        options={getOptionsState(state)}
                                        placeholder="State"
                                        label="State"
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
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.zip`}
                                        placeholder="Enter zip code"
                                        label="Zip Code"
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
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.yearAtThisAddress`}
                                        placeholder="Enter year at this address"
                                        label="Year at this Address"
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
                                        disabled={disable}
                                        className="w-full"
                                        control={control}
                                        name={`principals.${index}.birthDate`}
                                        placeholder="Select date"
                                        label="Date of birth"
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
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.driverNumber`}
                                        placeholder="Enter driver license number"
                                        label="Driver License Number"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFSelect<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        disabled={disable}
                                        className="w-full"
                                        control={control}
                                        name={`principals.${index}.stateIssued`}
                                        options={getOptionsState(state)}
                                        placeholder="State Issued"
                                        label="State Issued"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFUpload<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        disabled={disable}
                                        control={control}
                                        name={`principals.${index}.fileUrl`}
                                        accept="image/*,.pdf"
                                        allowPdf
                                        action={`${API_BASE_URL}File?allowOtherFile=true`}
                                        label="Driver License Picture"
                                        onUploaded={function (fileId: number, path: string): void {
                                            setValue(`principals.${index}.fileId`, fileId, { shouldValidate: true });
                                            setValue(`principals.${index}.fileUrl`, path, { shouldValidate: true });
                                        }}
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
                                        <button
                                            type="button"
                                            onClick={addMorePrincipal}
                                            className="rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-400 py-0.5 px-3 my-2 addable-add"
                                        >
                                            <i className="las la-plus mr-1 text-lg"></i>
                                            <span className="relative -top-0.5">ADD PRINCIPAL</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="mt-10 flex gap-x-2">
                    <Button title="Next" type="submit" btnType="ok" />
                </div>
            </form>
        </Spin>
    );
};

export default Principal;
