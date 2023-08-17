import React from "react";
import IMerchant from "interfaces/IMerchant";
import ModalButton from "components/ModalButton";
import IState from "interfaces/IState";
import Label from "components/Label";
import HelperText from "components/HelperText";
import MerchantService from "services/MerchantService";
import { useEffect } from "react";
import { Modal, Space, Spin } from "antd";
import { useForm } from "react-hook-form";
import {
    RHFCheckBox,
    RHFPhoneInput,
    RHFSelect,
    RHFTextField,
    RHFSearchTextField,
    RHFFederalTax,
} from "components/Form";
import { getOptionsState, testValidPhone, getCodeAndPhoneNumber } from "utils";
import {
    PHONE_CODES,
    REVIEW_LINK_OPTIONS,
    REGEX_EMAIL,
    MASK_PHONE_NUMER,
    REGEX_LATITUDE,
    REGEX_LONGITUDE,
    MASK_FEDERAL_TAX_ID,
    REGEX_FEDERAL_TAX_ID,
} from "contants";
import debounce from "lodash/debounce";
import Message from "components/Message/Message";
import StateService from "services/StateService";

type FormInputs = {
    legalBusinessName: string;
    doBusinessName: string;
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
    reviewLink: string;
    sendReviewLinkOption: string;
    latitude: string;
    longitude: string;
};

interface IProps {
    merchant: IMerchant;
    state: IState[];
    handleClose: () => void;
    handleSuccess: () => void;
}

const GeneralModal: React.FC<IProps> = ({ merchant, state, handleClose, handleSuccess }) => {
    const [businessCodePhone, businessPhone] = getCodeAndPhoneNumber(merchant.general?.phoneBusiness);
    const [contactCodePhone, contactPhone] = getCodeAndPhoneNumber(merchant.general?.phoneContact);

    const {
        control,
        getValues,
        setValue,
        reset,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            legalBusinessName: merchant.general?.legalBusinessName,
            doBusinessName: merchant.general?.doBusinessName,
            tax: merchant.general?.tax,
            address: merchant.general?.address,
            city: merchant.general?.city,
            state: merchant.general?.stateId,
            zip: merchant.general?.zip,
            dbaAddress: merchant.general?.dbaAddress?.Address,
            dbaState: merchant.general?.dbaAddress?.State,
            dbaCity: merchant.general?.dbaAddress?.City,
            dbaZip: merchant.general?.dbaAddress?.Zip,
            email: merchant.email,
            firstName: merchant.general?.firstName,
            lastName: merchant.general?.lastName,
            position: merchant.general?.title,
            reviewLink: merchant.general?.reviewLink || "",
            sendReviewLinkOption: merchant.general?.sendReviewLinkOption,
            latitude: merchant.general?.latitude || "",
            longitude: merchant.general?.longitude || "",
            businessCodePhone: businessCodePhone,
            businessPhone: businessPhone,
            contactCodePhone: contactCodePhone,
            contactPhone: contactPhone,
            sameAs: false,
        },
    });

    const watchSameAs = watch("sameAs");

    useEffect(() => {
        if (watchSameAs) {
            const { address, city, state, zip } = getValues();
            setValue("dbaAddress", address, { shouldValidate: true });
            setValue("dbaCity", city, { shouldValidate: true });
            setValue("dbaState", state, { shouldValidate: true });
            setValue("dbaZip", zip, { shouldValidate: true });
        }
    }, [getValues, setValue, watchSameAs]);

    const onSubmit = async (data: FormInputs) => {
        const businessPhoneNumber = `${data.businessCodePhone} ${data.businessPhone}`;
        const mobilePhoneNumber = `${data.contactCodePhone} ${data.contactPhone}`;

        const payload = {
            legalBusinessName: data.legalBusinessName,
            doBusinessName: data.doBusinessName,
            tax: data.tax,
            address: data.address,
            city: data.city,
            stateId: data.state,
            zip: data.zip,
            SameAs: data.sameAs,
            State: data.state,
            emailContact: data.email,
            codePhoneBusiness: data.businessCodePhone,
            phoneBusiness: businessPhoneNumber.replace(/[^\d]/g, ""),
            codePhoneContact: data.contactCodePhone,
            phoneContact: mobilePhoneNumber.replace(/[^\d]/g, ""),
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.position,
            reviewLink: data.reviewLink,
            sendReviewLinkOption: data.sendReviewLinkOption,
            latitude: data.latitude,
            longitude: data.longitude,
            generalId: merchant.general?.generalId,
            merchantId: merchant.merchantId,
            dbaAddress: {
                Address: data.dbaAddress,
                City: data.dbaCity,
                State: data.dbaState,
                Zip: data.dbaZip,
            },
        };

        if (merchant.general?.generalId) {
            try {
                const message = await MerchantService.updateGeneral(merchant.general?.generalId, payload);
                Message.success({ text: message });
                handleSuccess();
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
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={true}
                width={1200}
                title={<p className="font-bold text-lg">Edit</p>}
                onCancel={handleClose}
                footer={
                    <div className="flex space-x-2 justify-end">
                        <ModalButton
                            disabled={isSubmitting}
                            title="Cancel"
                            type={"button"}
                            btnType="cancel"
                            onClick={handleClose}
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
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
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
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={"doBusinessName"}
                                placeholder="Enter doing business as"
                                label="Doing Business As"
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
                                placeholder="Enter business address"
                                label="Business Address"
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
                                <RHFCheckBox<FormInputs> control={control} name={"sameAs"} />
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
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                control={control}
                                name={"reviewLink"}
                                placeholder="Enter review link"
                                label="Review Link"
                                labelRequired={false}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFSelect<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                className="w-full"
                                options={REVIEW_LINK_OPTIONS}
                                control={control}
                                name={"sendReviewLinkOption"}
                                placeholder="Enter title/position"
                                label="Send Review Link Option"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: REGEX_LATITUDE,
                                        message: "Invalid latitude!",
                                    },
                                }}
                                control={control}
                                name={"latitude"}
                                placeholder="Enter latitude"
                                label="Latitude"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: REGEX_LONGITUDE,
                                        message: "Invalid longitude!",
                                    },
                                }}
                                control={control}
                                name={"longitude"}
                                placeholder="Enter longitude"
                                label="Longitude"
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </Spin>
    );
};

export default GeneralModal;
