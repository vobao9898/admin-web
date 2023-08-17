import { Modal, Space, Spin } from "antd";
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
import { useForm } from "react-hook-form";
import { getCodeAndPhoneNumber, getOptionsState, testValidPhone, testValidSSN } from "utils";
import HelperText from "components/HelperText";
import Label from "components/Label";
import ModalButton from "components/ModalButton";
import Message from "components/Message";
import IPrincipal from "interfaces/IPrincipal";
import IState from "interfaces/IState";
import debounce from "lodash/debounce";
import moment from "moment";
import React from "react";
import MerchantService from "services/MerchantService";
import PrincipalService from "services/PrincipalService";
import StateService from "services/StateService";

interface IProps {
    merchantId: number;
    state: IState[];
    principals: IPrincipal[];
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
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
    driverLicense: string;
    stateIssued: number;
    imageUrl: string;
    fileId: number;
    currentEmail: string;
    currentSsn: string;
};

const CreatePrincipal: React.FC<IProps> = ({ merchantId, state, principals, onClose, onSuccess }) => {
    const {
        control,
        getValues,
        setValue,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormInputs>({
        mode: "onBlur",
        reValidateMode: "onBlur",
        defaultValues: {
            principalId: 0,
            firstName: "",
            lastName: "",
            title: "",
            ownerShip: "",
            codeHomePhone: 1,
            homePhone: "",
            codeMobilePhone: 1,
            mobilePhone: "",
            email: "",
            address: "",
            city: "",
            state: undefined,
            zip: "",
            yearAtThisAddress: "",
            ssn: "",
            birthDate: new Date(),
            driverLicense: "",
            stateIssued: undefined,
            imageUrl: "",
            fileId: undefined,
            currentEmail: "",
            currentSsn: "",
        },
    });

    const onSubmit = async (data: FormInputs) => {
        const homPhone = `${data.codeHomePhone} ${data.homePhone}`;
        const mobilePhone = `${data.codeMobilePhone} ${data.mobilePhone}`;

        const payload: Partial<IPrincipal> = {
            firstName: data.firstName,
            lastName: data.lastName,
            title: data.title,
            ownerShip: parseInt(data.ownerShip),
            homePhone: homPhone.replace(/[^\d]/g, ""),
            mobilePhone: mobilePhone.replace(/[^\d]/g, ""),
            yearAddress: data.yearAtThisAddress,
            ssn: data.ssn.replace(/[^\d]/g, ""),
            birthDate: moment.utc(data.birthDate).format(),
            driverNumber: data.driverLicense,
            fileId: data.fileId,
            city: data.city,
            stateId: data.state,
            address: data.address,
            zip: data.zip,
            email: data.email,
            stateIssued: data.stateIssued,
        };

        try {
            if (data.principalId === 0) {
                await handleCreate(payload);
            } else {
                await handleUpdate(data.principalId, payload);
            }
            onSuccess();
            reset({});
            Message.success({ text: "Success" });
        } catch (error) {
            reset(data);
        }
    };

    const handleUpdate = async (id: number, data: Partial<IPrincipal>) => {
        try {
            await PrincipalService.update(id, data);
            if (principals && principals.length && principals.findIndex((x) => x.principalId === id) !== -1) {
                await MerchantService.changePrincipal(merchantId, id);
            }
        } catch (error) {
            throw error;
        }
    };

    const handleCreate = async (data: Partial<IPrincipal>) => {
        try {
            const principalId = await PrincipalService.create(data);
            await MerchantService.changePrincipal(merchantId, principalId);
        } catch (error) {
            throw error;
        }
    };

    const handleClose = () => {
        onClose();
        reset({});
    };

    const debounceSuggestionState = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value) {
            const data = await StateService.getSuggestionByZipCode(value);
            if (data && data.stateId) {
                const addressWatch = getValues("address");
                Modal.confirm({
                    title: "Are you want to replace?",
                    content: (
                        <div>
                            <div>Business Address: {addressWatch}</div>
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

    // TODO: Remove eslint comment
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeSuggesstionState = React.useCallback(debounceSuggestionState, []);

    const handleBlur = async (value: string, type: "email" | "ssn") => {
        if (
            value &&
            ((type === "email" && REGEX_EMAIL.test(value.trim())) || (type === "ssn" && testValidSSN(value)))
        ) {
            let keyword = value;

            if (type === "ssn") {
                keyword = value.replaceAll("-", "");
            }

            const currentEmail = getValues("currentEmail");
            const currentSsn = getValues("currentSsn");

            if (
                (type === "email" && keyword !== currentEmail) ||
                (type === "ssn" && keyword !== currentSsn?.replace(/[^\d]/g, ""))
            ) {
                const principal = await PrincipalService.getPrincipalByKey(type, keyword);

                if (principal) {
                    Modal.confirm({
                        title: `${
                            type === "email" ? "Email" : "Social Security Number"
                        } is exist. Are you want to replace?`,
                        onOk() {
                            const [codeMobilePhone, mobilePhoneNumber] = getCodeAndPhoneNumber(principal.mobilePhone);
                            const [codeHomePhone, homePhoneNumber] = getCodeAndPhoneNumber(principal.homePhone);

                            setValue("principalId", principal.principalId, { shouldValidate: true });
                            setValue("firstName", principal.firstName, { shouldValidate: true });
                            setValue("lastName", principal.lastName, { shouldValidate: true });
                            setValue("title", principal.title, { shouldValidate: true });
                            setValue("ownerShip", principal?.ownerShip?.toString(), { shouldValidate: true });
                            setValue("codeHomePhone", codeHomePhone, { shouldValidate: true });
                            setValue("homePhone", homePhoneNumber, { shouldValidate: true });
                            setValue("codeMobilePhone", codeMobilePhone, { shouldValidate: true });
                            setValue("mobilePhone", mobilePhoneNumber, { shouldValidate: true });
                            setValue("email", principal.email, { shouldValidate: true });
                            setValue("address", principal.address, { shouldValidate: true });
                            setValue("city", principal.city, { shouldValidate: true });
                            setValue("state", principal.stateId, { shouldValidate: true });
                            setValue("zip", principal.zip, { shouldValidate: true });
                            setValue("yearAtThisAddress", principal.yearAddress, { shouldValidate: true });
                            setValue("ssn", principal.ssn, { shouldValidate: true });
                            setValue("birthDate", new Date(principal.birthDate), { shouldValidate: true });
                            setValue("driverLicense", principal.driverNumber, { shouldValidate: true });
                            setValue("stateIssued", principal.stateIssued, { shouldValidate: true });
                            setValue("imageUrl", principal.imageUrl, { shouldValidate: true });
                            setValue("fileId", principal.fileId, { shouldValidate: true });
                            setValue("currentEmail", principal.email, { shouldValidate: true });
                            setValue("currentSsn", principal.ssn, { shouldValidate: true });
                        },
                        onCancel() {},
                    });
                }
            }
        }
    };

    return (
        <Spin spinning={isSubmitting}>
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={true}
                width={1200}
                title={<p className="font-bold text-lg">Add Principal</p>}
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
                                name={"firstName"}
                                placeholder="Enter first name"
                                label="First Name"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
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
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={"title"}
                                placeholder="Enter title/position"
                                label="Title/Position"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: new RegExp("^[0-9]+$"),
                                        message: "Please enter only number!",
                                    },
                                }}
                                control={control}
                                name={"ownerShip"}
                                placeholder="Enter ownership"
                                label="Ownership"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <Label title="Home Phone" required />
                            <Space.Compact className="w-full">
                                <RHFSelect<FormInputs>
                                    control={control}
                                    name={"codeHomePhone"}
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
                                                const codePhone = getValues("codeHomePhone");
                                                return !testValidPhone(codePhone, value as string)
                                                    ? "Invalid home phone"
                                                    : true;
                                            },
                                        },
                                    }}
                                    mask={MASK_PHONE_NUMER}
                                    control={control}
                                    name={"homePhone"}
                                    placeholder="Enter phone number"
                                    showError={false}
                                />
                            </Space.Compact>
                            <HelperText message={errors.homePhone?.message || ""} />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <Label title="Mobile Phone" required />
                            <Space.Compact className="w-full">
                                <RHFSelect<FormInputs>
                                    control={control}
                                    name={"codeMobilePhone"}
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
                                                const codePhone = getValues("codeMobilePhone");
                                                return !testValidPhone(codePhone, value as string)
                                                    ? "Invalid mobile phone"
                                                    : true;
                                            },
                                        },
                                    }}
                                    mask={MASK_PHONE_NUMER}
                                    control={control}
                                    name={"mobilePhone"}
                                    placeholder="Enter mobile phone"
                                    showError={false}
                                />
                            </Space.Compact>
                            <HelperText message={errors.mobilePhone?.message || ""} />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFSearchTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: REGEX_EMAIL,
                                        message: "Please enter a valid email address!",
                                    },
                                }}
                                handleOnBlur={(value) => handleBlur(value, "email")}
                                control={control}
                                name={`email`}
                                placeholder="Enter emaill address"
                                label="Email Address"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={"address"}
                                placeholder="Enter address"
                                label="Address"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
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
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
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
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFSearchTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: new RegExp("^[0-9]+$"),
                                        message: "Please enter only number!",
                                    },
                                }}
                                handleOnChange={handleChangeSuggesstionState}
                                control={control}
                                name={"zip"}
                                placeholder="Enter zip code"
                                label="Zip Code"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: new RegExp("^[0-9]+$"),
                                        message: "Please enter only number!",
                                    },
                                }}
                                control={control}
                                name={"yearAtThisAddress"}
                                placeholder="Enter year at this address"
                                label="Year at this Address"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
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
                                handleOnBlur={(value) => handleBlur(value, "ssn")}
                                mask={MASK_SOCIAL_SECURITY_NUMBER}
                                control={control}
                                name={`ssn`}
                                placeholder="Enter social security number"
                                label="Social Security Number"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFDatePicker<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                className="w-full"
                                control={control}
                                name={"birthDate"}
                                placeholder="Select date"
                                label="Date of birth"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFTextField<FormInputs>
                                control={control}
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: /^[A-Za-z0-9]*$/,
                                        message: "Driver License Number Invalid!",
                                    },
                                }}
                                name={"driverLicense"}
                                placeholder="Enter driver license number"
                                label="Driver License Number"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFSelect<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                className="w-full"
                                control={control}
                                name={"stateIssued"}
                                options={getOptionsState(state)}
                                placeholder="State Issued"
                                label="State Issued"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6 lg:col-span-3">
                            <RHFUpload<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                }}
                                control={control}
                                name={`imageUrl`}
                                accept="image/*,.pdf"
                                allowPdf
                                action={`${API_BASE_URL}File?allowOtherFile=true`}
                                label="Driver License Picture"
                                onUploaded={function (fileId: number, path: string): void {
                                    setValue("fileId", fileId, { shouldValidate: true });
                                    setValue("imageUrl", path, { shouldValidate: true });
                                }}
                            />
                        </div>
                    </div>
                </form>
            </Modal>
        </Spin>
    );
};

export default CreatePrincipal;
