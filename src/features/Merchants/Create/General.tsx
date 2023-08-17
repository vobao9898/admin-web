import { Modal, Space, Spin } from "antd";
import Button from "components/Button/Button";
import {
    RHFCheckBox,
    RHFFederalTax,
    RHFPhoneInput,
    RHFSearchTextField,
    RHFSelect,
    RHFTextField,
} from "components/Form";
import HelperText from "components/HelperText";
import Label from "components/Label";
import {
    MERCHANT_TYPE_OPTIONS,
    PHONE_CODES,
    REGEX_EMAIL,
    MASK_PHONE_NUMER,
    MASK_FEDERAL_TAX_ID,
    REGEX_FEDERAL_TAX_ID,
} from "contants";
import { GeneralInfo } from "dtos/ICreateMerchant";
import IState from "interfaces/IState";
import debounce from "lodash/debounce";
import React from "react";
import { useForm } from "react-hook-form";
import StateService from "services/StateService";
import { getOptionsState, testValidPhone } from "utils";

interface IProps {
    state: IState[];
    general?: GeneralInfo;
    onSubmitGeneral: (general: GeneralInfo) => void;
}

type FormInputs = {
    businessName: string;
    doingBusiness: string;
    type: number;
    tax: string;
    address: string;
    city: string;
    state: number;
    zip: string;
    sameAs: boolean;
    dbaAddress: string;
    dbaCity: string;
    dbaState: number;
    dbaZip: string;
    email: string;
    businessCodePhone: number;
    businessPhone: string;
    contactCodePhone: number;
    contactPhone: string;
    firstName: string;
    lastName: string;
    position: string;
};

const General: React.FC<IProps> = ({ general, state, onSubmitGeneral }) => {
    const {
        control,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            businessName: general?.businessName || "",
            doingBusiness: general?.doingBusiness || "",
            type: general?.type || 0,
            tax: general?.tax || "",
            address: general?.businessAddress?.address || "",
            city: general?.businessAddress?.city || "",
            state: general?.businessAddress?.state || undefined,
            zip: general?.businessAddress?.zip || "",
            sameAs: general?.sameAs || false,
            dbaAddress: general?.dbaAddress.address || "",
            dbaCity: general?.dbaAddress.city || "",
            dbaState: general?.dbaAddress.state || undefined,
            dbaZip: general?.dbaAddress.zip || "",
            email: general?.email || "",
            businessCodePhone: general?.businessCodePhone || 1,
            businessPhone: general?.businessPhoneNumber || "",
            contactCodePhone: general?.contactCodePhone || 1,
            contactPhone: general?.contactPhoneNumber || "",
            firstName: general?.firstName || "",
            lastName: general?.lastName || "",
            position: general?.position || "",
        },
    });

    const handleChangeSameAs = (checked: boolean) => {
        if (checked) {
            const { address, city, state, zip } = getValues();
            setValue("dbaAddress", address, { shouldValidate: true });
            setValue("dbaCity", city, { shouldValidate: true });
            setValue("dbaState", state, { shouldValidate: true });
            setValue("dbaZip", zip, { shouldValidate: true });
        }
    };

    const onSubmit = (data: FormInputs) => {
        const general: GeneralInfo = {
            businessName: data.businessName,
            doingBusiness: data.doingBusiness,
            tax: data.tax,
            businessAddress: {
                address: data.address,
                city: data.city,
                state: data.state,
                zip: data.zip,
            },
            dbaAddress: {
                address: data.dbaAddress,
                city: data.dbaCity,
                state: data.dbaState,
                zip: data.dbaZip,
            },
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            position: data.position,
            type: data.type,
            sameAs: data.sameAs,
            businessCodePhone: data.businessCodePhone,
            businessPhoneNumber: data.businessPhone,
            contactCodePhone: data.contactCodePhone,
            contactPhoneNumber: data.contactPhone,
        };
        onSubmitGeneral(general);
    };

    const debounceZipCode = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value) {
            const data = await StateService.getSuggestionByZipCode(value);
            if (data && data.stateId) {
                const bussinesAddress = getValues("address");
                const sameAs = getValues("sameAs");
                Modal.confirm({
                    title: "Are you want to replace?",
                    content: (
                        <div>
                            <div>Business Address: {bussinesAddress}</div>
                            <div>City: {data?.city}</div>
                            <div>State: {data?.stateName}</div>
                            <div>Zip code: {data?.zipCode}</div>
                        </div>
                    ),
                    onOk() {
                        setValue("city", data.city, { shouldValidate: true });
                        setValue("state", data.stateId, { shouldValidate: true });
                        setValue("zip", data.zipCode, { shouldValidate: true });
                        if (sameAs) {
                            setValue("dbaAddress", bussinesAddress, { shouldValidate: true });
                            setValue("dbaCity", data.city, { shouldValidate: true });
                            setValue("dbaState", data.stateId, { shouldValidate: true });
                            setValue("dbaZip", data.zipCode, { shouldValidate: true });
                        }
                    },
                    onCancel() {},
                });
            }
        }
    }, 500);

    // TODO: Remove eslint comment
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeZipCode = React.useCallback(debounceZipCode, []);

    const debounceDBAZipCode = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value) {
            const data = await StateService.getSuggestionByZipCode(value);
            if (data && data.stateId) {
                const dBAAddress = getValues("dbaAddress");
                Modal.confirm({
                    title: "Are you want to replace?",
                    content: (
                        <div>
                            <div>DBA Address: {dBAAddress}</div>
                            <div>City: {data?.city}</div>
                            <div>State: {data?.stateName}</div>
                            <div>Zip code: {data?.zipCode}</div>
                        </div>
                    ),
                    onOk() {
                        setValue("dbaCity", data.city, { shouldValidate: true });
                        setValue("dbaState", data.stateId, { shouldValidate: true });
                        setValue("dbaZip", data.zipCode, { shouldValidate: true });
                    },
                    onCancel() {},
                });
            }
        }
    }, 500);

    // TODO: Remove eslint comment
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeDBAZipCode = React.useCallback(debounceDBAZipCode, []);

    return (
        <Spin spinning={isSubmitting}>
            <div className="font-bold text-lg mb-4 text-blue-500">General Information</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"businessName"}
                            placeholder="Enter legal business name"
                            label="Legal Business Name"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"doingBusiness"}
                            placeholder="Enter doing business as"
                            label="Doing Business As"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <RHFSelect<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            className="w-full"
                            options={MERCHANT_TYPE_OPTIONS}
                            control={control}
                            name={"type"}
                            placeholder="Merchant type"
                            label="Merchant type"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                        <RHFFederalTax<FormInputs>
                            rules={{
                                required: "This is a required field!",
                                pattern: {
                                    value: REGEX_FEDERAL_TAX_ID,
                                    message: "Invalid Federal Tax ID",
                                },
                            }}
                            mask={MASK_FEDERAL_TAX_ID}
                            control={control}
                            name={"tax"}
                            placeholder="Enter federal tax id"
                            label="Federal Tax ID"
                        />
                    </div>
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"address"}
                            placeholder="Enter business address (no p.o. boxes)"
                            label="Business Address (no P.O. Boxes)"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"city"}
                            placeholder="Enter city"
                            label="City"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFSelect<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            className="w-full"
                            options={getOptionsState(state)}
                            control={control}
                            name={"state"}
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
                            handleOnChange={handleChangeZipCode}
                            control={control}
                            name={"zip"}
                            placeholder="Enter Zip code (timezone will collect based on this filed)"
                            label="Zip code"
                        />
                    </div>
                    <div className="col-span-12">
                        <div className="flex space-x-1">
                            <RHFCheckBox<FormInputs>
                                control={control}
                                name={"sameAs"}
                                onHandleChange={handleChangeSameAs}
                            />
                            <span>Same as Business Address</span>
                        </div>
                    </div>
                    <div className="col-span-12">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"dbaAddress"}
                            placeholder="Enter dba address"
                            label="DBA Address"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"dbaCity"}
                            placeholder="Enter city"
                            label="City"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFSelect<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            className="w-full"
                            options={getOptionsState(state)}
                            control={control}
                            name={"dbaState"}
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
                            handleOnChange={handleChangeDBAZipCode}
                            control={control}
                            name={"dbaZip"}
                            placeholder="Enter Zip code"
                            label="Zip code"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
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
                            placeholder="Enter email contact"
                            label="Email Contact"
                        />
                    </div>
                    <div className="col-span-12" />
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <Label title="Business Phone Number" required />
                        <Space.Compact className="w-full">
                            <RHFSelect<FormInputs>
                                control={control}
                                name={"businessCodePhone"}
                                options={PHONE_CODES}
                                showError={false}
                                showSearch={false}
                                className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                            />
                            <RHFPhoneInput<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    validate: {
                                        businessPhoneValid: (value) => {
                                            const codePhone = getValues("businessCodePhone");
                                            return !testValidPhone(codePhone, value as string)
                                                ? "Invalid business phone"
                                                : true;
                                        },
                                    },
                                }}
                                mask={MASK_PHONE_NUMER}
                                control={control}
                                name={"businessPhone"}
                                placeholder="Enter business phone number"
                                showError={false}
                            />
                        </Space.Compact>
                        <HelperText message={errors.businessPhone?.message || ""} />
                    </div>
                    <div className="col-span-12" />
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <Label title="Contact Phone Number" required />
                        <Space.Compact className="w-full">
                            <RHFSelect<FormInputs>
                                control={control}
                                name={"contactCodePhone"}
                                options={PHONE_CODES}
                                showError={false}
                                showSearch={false}
                                className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                            />
                            <RHFPhoneInput<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    validate: {
                                        contactPhoneValid: (value) => {
                                            const codePhone = getValues("contactCodePhone");
                                            return !testValidPhone(codePhone, value as string)
                                                ? "Invalid contact phone"
                                                : true;
                                        },
                                    },
                                }}
                                mask={MASK_PHONE_NUMER}
                                control={control}
                                name={"contactPhone"}
                                placeholder="Enter contact phone number"
                                showError={false}
                            />
                        </Space.Compact>
                        <HelperText message={errors.contactPhone?.message || ""} />
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
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"lastName"}
                            placeholder="Enter last name"
                            label="Last Name"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                        <RHFTextField<FormInputs>
                            rules={{
                                required: "This is a required field!",
                            }}
                            control={control}
                            name={"position"}
                            placeholder="Enter title/position"
                            label="Title/Position"
                        />
                    </div>
                    <div className="col-span-12" />
                    <div className="col-span-12">
                        <Button type="submit" title="Next" btnType="ok" />
                    </div>
                </div>
            </form>
        </Spin>
    );
};

export default General;
