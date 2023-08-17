import { Modal, Space, Spin } from "antd";
import {
    RHFDatePicker,
    RHFPhoneInput,
    RHFSSNInput,
    RHFSelect,
    RHFTextField,
    RHFUpload,
    RHFSearchTextField,
} from "components/Form";
import { useForm } from "react-hook-form";
import { API_BASE_URL, MASK_PHONE_NUMER, MASK_SOCIAL_SECURITY_NUMBER, PHONE_CODES, REGEX_EMAIL } from "contants";
import { getOptionsState, testValidPhone, testValidSSN } from "utils";
import HelperText from "components/HelperText";
import Label from "components/Label";
import ModalButton from "components/ModalButton";
import IPrincipal from "interfaces/IPrincipal";
import IState from "interfaces/IState";
import moment from "moment";
import React from "react";
import PrincipalService from "services/PrincipalService";
import StateService from "services/StateService";
import debounce from "lodash/debounce";

interface IProps {
    open: boolean;
    state: IState[];
    onClose: () => void;
    onSuccess: () => void;
}

type FormInputs = {
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
};

const CreatePrincipal: React.FC<IProps> = ({ open, state, onClose, onSuccess }) => {
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
        },
    });

    const onSubmit = async (data: FormInputs) => {
        const homPhone = `${data.codeHomePhone} ${data.homePhone}`;
        const mobilePhone = `${data.codeMobilePhone} ${data.mobilePhone}`;

        const body: Partial<IPrincipal> = {
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
            await PrincipalService.create(body);
            onSuccess();
            reset({});
        } catch (error) {
            reset(data);
        }
    };

    const handleClose = () => {
        onClose();
        reset({});
    };

    const debounceSuggestionState = debounce(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (value) {
            try {
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
            } catch (error) {
                console.log(error);
            }
        }
    }, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleChangeSuggesstionState = React.useCallback(debounceSuggestionState, []);

    return (
        <Spin spinning={isSubmitting}>
            <Modal
                centered={true}
                maskClosable={false}
                destroyOnClose={true}
                open={open}
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
                                                const codeHomePhone = getValues("codeHomePhone");
                                                return !testValidPhone(codeHomePhone, value as string)
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
                                                const codeMobilePhone = getValues("codeMobilePhone");
                                                return !testValidPhone(codeMobilePhone, value as string)
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
                            <RHFTextField<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    pattern: {
                                        value: REGEX_EMAIL,
                                        message: "Please enter a valid email address!",
                                    },
                                    validate: {
                                        uniqueEmail: (value) => {
                                            return new Promise((resolve, reject) => {
                                                PrincipalService.getPrincipalByKey("email", value as string).then(
                                                    (data) => {
                                                        if (data) {
                                                            resolve("Email is exist. Please enter another email!");
                                                        } else {
                                                            resolve(true);
                                                        }
                                                    }
                                                );
                                            });
                                        },
                                    },
                                }}
                                control={control}
                                name={"email"}
                                placeholder="Enter email address"
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
                            <RHFSSNInput<FormInputs>
                                rules={{
                                    required: "This is a required field!",
                                    validate: {
                                        uniqueSSN: (value) => {
                                            if (!testValidSSN(value as string)) {
                                                return "Invalid social security number!";
                                            } else {
                                                const formatSSN = (value as string).replace(/[^\d]/g, "");
                                                return new Promise((resolve, _) => {
                                                    PrincipalService.getPrincipalByKey("ssn", formatSSN).then(
                                                        (data) => {
                                                            if (data) {
                                                                resolve(
                                                                    "Social Security Number is exist. Please enter another social security number!"
                                                                );
                                                            } else {
                                                                resolve(true);
                                                            }
                                                        }
                                                    );
                                                });
                                            }
                                        },
                                    },
                                }}
                                mask={MASK_SOCIAL_SECURITY_NUMBER}
                                control={control}
                                name={"ssn"}
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
                                    setValue("fileId", fileId, { shouldValidate: true, shouldDirty: true });
                                    setValue("imageUrl", path, { shouldValidate: true, shouldDirty: true });
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
