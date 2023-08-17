import { Space, Modal, Spin } from "antd";
import { RHFFederalTax, RHFPhoneInput, RHFSearchTextField, RHFSelect, RHFTextField } from "components/Form";
import { MASK_FEDERAL_TAX_ID, MASK_PHONE_NUMER, PHONE_CODES, REGEX_EMAIL, REGEX_FEDERAL_TAX_ID } from "contants";
import { useForm } from "react-hook-form";
import { getCodeAndPhoneNumber, getOptionsState, testValidPhone } from "utils";
import HelperText from "components/HelperText/HelperText";
import Label from "components/Label";
import Message from "components/Message";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button/Button";
import IMerchant from "interfaces/IMerchant";
import IState from "interfaces/IState";
import RequestManagementService from "services/RequestManagementService";
import StateService from "services/StateService";
import debounce from "lodash/debounce";
import React from "react";

interface IProps {
    pending: IMerchant;
    merchantId: string;
    state: IState[];
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
    legalBusinessName: string;
    doBusinessName: string;
    type: string;
    tax: string;
    address: string;
    city: string;
    state: number;
    zip: string;
    dbaAddress: string;
    dbaCity: string;
    dbaState: number;
    dbaZip: string;
    businessCodePhone: number;
    businessPhone: string;
    emailContact: string;
    firstName: string;
    lastName: string;
    title: string;
    contactCodePhone: number;
    contactPhone: string;
};

const BREAD = [
    {
        name: "Reject Request Detail",
        path: "/request/rejected-request",
    },
    {
        name: "Edit",
        path: "",
    },
];
const EditPending: React.FC<IProps> = ({ pending, merchantId, state, onClose, onSuccess }) => {
    const [businessCodePhone, businessPhone] = getCodeAndPhoneNumber(pending?.general?.phoneBusiness);
    const [contactCodePhone, contactPhone] = getCodeAndPhoneNumber(pending?.general?.phoneContact);

    const {
        control,
        reset,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            legalBusinessName: pending?.general?.legalBusinessName || "",
            doBusinessName: pending?.general?.doBusinessName || "",
            type: pending?.type || undefined,
            tax: pending?.general?.tax || "",
            address: pending?.general?.address || "",
            state: pending?.general?.stateId || undefined,
            city: pending?.general?.city || "",
            zip: pending?.general.zip || "",
            dbaAddress: pending?.general?.dbaAddress?.Address || "",
            dbaCity: pending?.general?.dbaAddress?.City || "",
            dbaState: pending?.general?.dbaAddress?.State || undefined,
            dbaZip: pending?.general?.dbaAddress?.Zip || undefined,
            businessCodePhone: businessCodePhone,
            businessPhone: businessPhone,
            contactCodePhone: contactCodePhone,
            contactPhone: contactPhone,
            emailContact: pending?.general?.emailContact || "",
            firstName: pending?.general?.firstName || "",
            lastName: pending?.general?.lastName || "",
            title: pending?.general?.title || "",
        },
    });

    const onSubmit = async (data: FormInputs) => {
        const contactPhone = `${data.contactCodePhone} ${data.contactPhone}`;
        const businessPhone = `${data.businessCodePhone} ${data.businessPhone}`;

        const payload = {
            edit: false,
            emailContact: data.emailContact,
            legalBusinessName: data.legalBusinessName,
            tax: data.tax,
            address: data.address,
            city: data.city,
            stateId: data.state,
            zip: data.zip,
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.title,
            doBusinessName: data.doBusinessName,
            loading: true,
            phoneBusiness: businessPhone.replace(/[^\d]/g, ""),
            phoneContact: contactPhone.replace(/[^\d]/g, ""),
            dbaAddress: {
                Address: data.dbaAddress,
                City: data.dbaCity,
                State: data.dbaState,
                Zip: data.dbaZip,
            },
            ID: pending.general.generalId,
            merchantId: merchantId,
            path: "/app/merchants/rejected/profile",
        };
        if (merchantId && pending?.general?.generalId) {
            try {
                const message = await RequestManagementService.editReject(payload, pending.general.generalId);
                Message.success({ text: message });
                onSuccess();
            } catch (error) {
                reset(data);
            }
        }
    };

    const debounceZipCode = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value) {
            const data = await StateService.getSuggestionByZipCode(value);
            if (data && data.stateId) {
                const bussinesAddress = getValues("address");
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
                    },
                    onCancel() {},
                });
            }
        }
    }, 500);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeDBAZipCode = React.useCallback(debounceDBAZipCode, []);

    return (
        <div>
            <Spin spinning={isSubmitting}>
                <Breadcrumb title="Edit" breadcrumbs={BREAD} />
                <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
                    <div className="mt-4 px-4 border-b border-blue-500 h-[60px] flex items-center">
                        <p className="font-semibold text-lg text-black">ID-{pending?.merchantId}</p>
                    </div>
                    <div className="px-4 pt-4">
                        <form>
                            <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                                <div className="col-span-12 pb-3 mt-3">
                                    <h4 className="font-semibold text-blue-500 text-xl">General Information</h4>
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        control={control}
                                        name={"legalBusinessName"}
                                        placeholder="Enter legal business name"
                                        label="Legal business name"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        control={control}
                                        name={"doBusinessName"}
                                        placeholder="Enter doing business as (dba)"
                                        label="Doing Business As (DBA)"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFSelect<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        className="w-full"
                                        control={control}
                                        name={"type"}
                                        options={[
                                            { label: "Salon POS", value: "SalonPOS" },
                                            { label: "Retailer", value: "Retailer" },
                                            { label: "Table Management", value: "Restaurant" },
                                        ]}
                                        placeholder="Type"
                                        label="Merchant type"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
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
                                        placeholder="Enter Business Address (no P.O. Boxes)"
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
                                        placeholder="Enter City"
                                        label="City"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFSelect<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        className="w-full"
                                        control={control}
                                        name={"state"}
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
                                        handleOnChange={handleChangeZipCode}
                                        control={control}
                                        name={"zip"}
                                        placeholder="Enter Zip code (timezone will collect based on this filed)"
                                        label="Zip code"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        control={control}
                                        name={"dbaAddress"}
                                        placeholder="Enter DBA Address"
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
                                        placeholder="Enter City"
                                        label="City"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFSelect<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        className="w-full"
                                        control={control}
                                        name={"dbaState"}
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
                                        handleOnChange={handleChangeDBAZipCode}
                                        control={control}
                                        name={"dbaZip"}
                                        placeholder="Enter Zip code"
                                        label="Zip code"
                                    />
                                </div>
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
                                            placeholder="Enter business Phone Number"
                                            showError={false}
                                        />
                                    </Space.Compact>
                                    <HelperText message={errors.businessPhone?.message || ""} />
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
                                        name={"emailContact"}
                                        placeholder="Enter Contact Email Address"
                                        label="Contact Email Address"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        control={control}
                                        name={"firstName"}
                                        placeholder="Enter First Name"
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
                                        placeholder="Enter Last Name"
                                        label="Last Name"
                                    />
                                </div>
                                <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                    <RHFTextField<FormInputs>
                                        rules={{
                                            required: "This is a required field!",
                                        }}
                                        control={control}
                                        name={"title"}
                                        placeholder="Enter Title/Position"
                                        label="Title/Position"
                                    />
                                </div>
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
                                            placeholder="Enter Contact Phone Number"
                                            showError={false}
                                        />
                                    </Space.Compact>
                                    <HelperText message={errors.contactPhone?.message || ""} />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="flex px-4 mt-5">
                        <Button title="CANCEL" btnType="cancel" onClick={onClose} moreClass="mr-5" />
                        <Button title="SAVE" btnType="ok" type="submit" onClick={handleSubmit(onSubmit)} />
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default EditPending;
