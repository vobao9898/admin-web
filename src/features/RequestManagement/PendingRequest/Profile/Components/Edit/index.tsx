import { Modal, Space, Spin } from "antd";
import { MASK_FEDERAL_TAX_ID, MASK_PHONE_NUMER, PHONE_CODES, REGEX_EMAIL, REGEX_FEDERAL_TAX_ID } from "contants";
import { DEFAUL_PRINCIPAL } from "features/Merchants/Create";
import { IPrincipal as IPrincipalDTO } from "features/Merchants/Create/Principal";
import { useFieldArray, useForm } from "react-hook-form";
import { getCodeAndPhoneNumber, getOptionsState, testValidPhone } from "utils";
import { RHFFederalTax, RHFPhoneInput, RHFSearchTextField, RHFSelect, RHFTextField } from "components/Form";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button/Button";
import HelperText from "components/HelperText/HelperText";
import Label from "components/Label/Label";
import IMerchant from "interfaces/IMerchant";
import IPrincipal from "interfaces/IPrincipal";
import IState from "interfaces/IState";
import debounce from "lodash/debounce";
import React from "react";
import StateService from "services/StateService";
import Bank from "./Bank";
import Principals from "./Principals";
import moment from "moment";
import RequestManagementService from "services/RequestManagementService";
import Message from "components/Message";

interface IProps {
    pending: IMerchant;
    merchantId: string;
    state: IState[];
    closeEdit: () => void;
    onSuccess: () => void;
}

export type FormInputs = {
    legalBusinessName: string;
    doBusinessName: string;
    type: string;
    tax: string;
    address: string;
    city: string;
    stateId: number;
    zip: string;
    dbaAddress: string;
    dbaCity: string;
    dbaState: number;
    dbaZip: string;
    businessCodePhone: number;
    businessPhone: string;
    contactCodePhone: number;
    contactPhone: string;
    email: string;
    firstName: string;
    lastName: string;
    title: string;
    accountHolderName: string;
    name: string;
    imageUrl: string;
    fileId: number;
    routingNumber: string;
    accountNumber: string;
    principals: IPrincipalDTO[];
};

const BREAD = [
    {
        name: "Pending Request Detail",
        path: "/request/pending-request",
    },
    {
        name: "Edit",
        path: "",
    },
];

const EditPending: React.FC<IProps> = ({ pending, state, closeEdit, onSuccess }) => {
    const [businessCodePhone, businessPhone] = getCodeAndPhoneNumber(pending?.general?.phoneBusiness);
    const [contactCodePhone, contactPhone] = getCodeAndPhoneNumber(pending?.general?.phoneContact);

    const formatPrincipals = (pricinpipals: IPrincipal[]) => {
        if (!pricinpipals) return [];

        const data: IPrincipalDTO[] = pricinpipals.map((item) => {
            const [codeHomePhone, homePhoneNumber] = getCodeAndPhoneNumber(item.homePhone);
            const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(item.mobilePhone);
            return {
                principalId: item.principalId,
                firstName: item.firstName,
                lastName: item.lastName,
                title: item.title,
                ownerShip: item.ownerShip.toString(),
                codeHomePhone: codeHomePhone,
                codeMobilePhone: codeMobilePhone,
                homePhone: homePhoneNumber,
                mobilePhone: mobilePhoneNumber,
                email: item.email,
                address: item.address,
                city: item.city,
                state: item.stateId,
                zip: item.zip,
                yearAtThisAddress: item.yearAddress,
                ssn: item.ssn,
                birthDate: new Date(item.birthDate),
                driverNumber: item.driverNumber,
                stateIssued: item.stateIssued,
                fileUrl: item.imageUrl,
                fileId: item.fileId,
            };
        });
        return data;
    };

    const formatDataBusiness = (pending: IMerchant) => {
        return {
            question1: {
                isAccept: pending.business[0]?.answer,
                desc: pending.business[0]?.answerReply,
                question: pending.business[0]?.question,
            },
            question2: {
                isAccept: pending.business[1]?.answer,
                desc: pending.business[1]?.answerReply,
                question: pending.business[1]?.question,
            },
            question3: {
                isAccept: pending.business[2]?.answer,
                desc: pending.business[2]?.answerReply,
                question: pending.business[2]?.question,
            },
            question4: {
                isAccept: pending.business[3]?.answer,
                desc: pending.business[3]?.answerReply,
                question: pending.business[3]?.question,
            },
            question5: {
                isAccept: pending.business[4]?.answer,
                desc: pending.business[4]?.answerReply,
                question: pending.business[4]?.question,
            },
        };
    };

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        getValues,
        reset,
    } = useForm<FormInputs>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            legalBusinessName: pending?.general?.legalBusinessName || "",
            doBusinessName: pending?.general?.doBusinessName || "",
            type: pending?.type || undefined,
            tax: pending?.general?.tax || "",
            address: pending?.general?.address || "",
            city: pending?.general?.city || undefined,
            stateId: pending?.general?.stateId || undefined,
            zip: pending?.general?.zip || "",
            dbaAddress: pending?.general?.dbaAddress?.Address || "",
            dbaCity: pending?.general?.dbaAddress?.City || "",
            dbaState: pending?.general?.dbaAddress?.State || undefined,
            dbaZip: pending?.general?.dbaAddress?.Zip || "",
            businessCodePhone: businessCodePhone || 1,
            businessPhone: businessPhone || "",
            email: pending?.email || "",
            firstName: pending?.general?.firstName || "",
            lastName: pending?.general?.lastName || "",
            title: pending?.general?.title || "",
            contactCodePhone: contactCodePhone || 1,
            contactPhone: contactPhone || "",
            accountHolderName: pending?.businessBank?.accountHolderName || "",
            name: pending?.businessBank?.name || "",
            routingNumber: pending?.businessBank?.routingNumber || "",
            accountNumber: pending?.businessBank?.accountNumber || "",
            fileId: pending?.businessBank?.fileId || undefined,
            imageUrl: pending?.businessBank?.imageUrl || "",
            principals: formatPrincipals(pending?.principals),
        },
    });

    const formatGeneralInfo = (data: FormInputs) => {
        const contactPhone = `${data.contactCodePhone} ${data.contactPhone}`;
        const businessPhone = `${data.businessCodePhone} ${data.businessPhone}`;
        console.log(data);
        return {
            businessName: data.legalBusinessName,
            doingBusiness: data.doBusinessName,
            tax: data.tax,
            address: data.address,
            city: data.city,
            stateId: data.stateId,
            zip: data.zip,
            businessPhone: businessPhone.replace(/[^\d]/g, ""),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            contactPhone: contactPhone.replace(/[^\d]/g, ""),
            businessHour: {},
            businessAddress: {
                address: data.address,
                city: data.city,
                state: data.stateId,
                zip: data.zip,
            },
            dbaAddress: {
                address: data.dbaAddress,
                city: data.dbaCity,
                state: data.dbaState,
                zip: data.dbaZip,
            },
            position: data.title,
        };
    };

    const formatBankInfo = (data: FormInputs) => {
        return {
            routingNumber: data.routingNumber,
            accountNumber: data.accountNumber,
            fileId: data.fileId,
            bankName: data.name,
            accountHolderName: data.accountHolderName,
        };
    };

    const formatPrincipalInfo = (data: FormInputs) => {
        const newPrincipals = data.principals.map((item) => {
            const homPhone = `${item.codeHomePhone} ${item.homePhone}`;
            const mobilePhone = `${item.codeMobilePhone} ${item.mobilePhone}`;
            return {
                principalId: item.principalId || 0,
                firstName: item.firstName,
                lastName: item.lastName,
                position: item.title,
                ownerShip: item.ownerShip,
                homePhone: homPhone.replace(/[^\d]/g, ""),
                mobilePhone: mobilePhone.replace(/[^\d]/g, ""),
                yearAtThisAddress: item.yearAtThisAddress,
                ssn: item.ssn,
                dateOfBirth: moment(item?.birthDate).format("MM/DD/YYYY"),
                driverLicense: item.driverNumber,
                stateIssued: item.stateIssued,
                fileId: item.fileId,
                addressPrincipal: {
                    address: item.address,
                    city: item.city,
                    state: item.state,
                    zip: item.zip,
                },
                email: item.email,
                address: item.address,
                city: item.city,
                zip: item.zip,
                title: item.title,
                driverNumber: item.driverNumber,
                stateId: item.state,
                yearAddress: item.yearAtThisAddress,
            };
        });
        return newPrincipals;
    };

    const onSubmit = async (data: FormInputs) => {
        const general = formatGeneralInfo(data);
        const bank = formatBankInfo(data);
        const principals = formatPrincipalInfo(data);
        const businessInfo = formatDataBusiness(pending);

        const payload = {
            generalInfo: general,
            businessInfo: businessInfo,
            bankInfo: bank,
            principalInfo: principals,
            currentRate: {
                TransactionsFee: pending.transactionsFee,
                DiscountRate: pending.discountRate,
            },
            packagePricing: "3", //TODO: Why packagePricing is 3
            type: data.type,
            loading: true,
            progress: false,
            progressPrincipal: false,
            isSubmitting: false,
            ID: pending.merchantId,
        };

        try {
            const message = await RequestManagementService.editPending(payload, pending.merchantId);
            Message.success({ text: message });
            onSuccess();
        } catch (error) {
            reset(data);
        }
    };

    const { fields, append, remove } = useFieldArray({
        control,
        name: "principals",
    });

    const addMorePrincipal = () => {
        append(DEFAUL_PRINCIPAL);
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
                        setValue("stateId", data.stateId, { shouldValidate: true });
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
                        <p className="font-semibold text-lg text-black">HP-{pending?.merchantId}</p>
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
                                        label="Legal Business Name"
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
                                        name={"stateId"}
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
                                            placeholder="Enter business phone number"
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
                                        name={"email"}
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
                                <Bank control={control} setValue={setValue} />
                            </div>
                            <div className="flex flex-col gap-y-4 mt-5">
                                <Principals
                                    control={control}
                                    fields={fields}
                                    errors={errors}
                                    state={state}
                                    getValues={getValues}
                                    setValue={setValue}
                                    addMorePrincipal={addMorePrincipal}
                                    remove={remove}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="flex space-x-2 mt-5">
                        <Button title="CANCEL" btnType="cancel" onClick={closeEdit} />
                        <Button title="SAVE" btnType="ok" type="submit" onClick={handleSubmit(onSubmit)} />
                    </div>
                </div>
            </Spin>
        </div>
    );
};

export default EditPending;
