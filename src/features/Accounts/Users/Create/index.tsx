import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Space } from "antd";
import { RHFDatePicker, RHFPhoneInput, RHFSelect, RHFTextField, RHFUpload } from "components/Form";
import { API_BASE_URL, GENDER_OPTOINS, PHONE_CODES, ROLE_OPTIONS, MASK_PHONE_NUMER } from "contants";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getOptionsState, testValidPhone } from "utils";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button/Button";
import HelperText from "components/HelperText/HelperText";
import Label from "components/Label/Label";
import Spin from "components/Spin";
import Message from "components/Message";
import IState from "interfaces/IState";
import IUser from "interfaces/IUser";
import moment from "moment";
import StateService from "services/StateService";
import UserService from "services/UserService";
import * as yup from "yup";

const BREAD_CRUMBS = [
    {
        name: "Accounts",
        path: "",
    },
    {
        name: "Admin",
        path: "/accounts/account-users",
    },
    {
        name: "New User",
        path: "/accounts/account-users/new",
    },
];

type FormInputs = {
    firstName: string;
    lastName: string;
    code: number;
    phone: string;
    address: string;
    city: string;
    stateId: number;
    email: string;
    gender: string;
    birthDate: Date;
    waRoleId: string;
    fileId: number | null | undefined;
    userName: string;
    password: string;
    confirmPassword: string;
    imageUrl: string | null | undefined;
};

const schema = yup.object({
    firstName: yup.string().required("This is a required field!"),
    lastName: yup.string().required("This is a required field!"),
    code: yup.number().required("Code phone is required"),
    phone: yup
        .string()
        .required("This is a required field!")
        .test("phoneValid", `Invalid phone number`, function (value) {
            return testValidPhone(this.parent.code, value);
        }),
    address: yup.string().required("This is a required field!"),
    city: yup.string().required("This is a required field!"),
    stateId: yup.number().required("This is a required field"),
    email: yup.string().required("This is a required field!").email("Please enter a valid email address!"),
    gender: yup.string().required("This is a required field!"),
    birthDate: yup.date().required("This is a required field!"),
    waRoleId: yup.string().required("This is a required field!"),
    fileId: yup.number().notRequired(),
    userName: yup.string().required("This is a required field!"),
    password: yup.string().required("This is a required field!"),
    confirmPassword: yup
        .string()
        .required("This is a required field!")
        .test("password", "Two passwords that you enter is inconsistent!", function (value) {
            return this.parent.password === value;
        }),
    imageUrl: yup.string().notRequired(),
});

const CreateUser = () => {
    const [state, setState] = useState<IState[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const data = await StateService.get();
                setState(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.log(error);
            }
        };
        if (loading) fetchState();
    }, [loading]);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            code: 1,
            phone: "",
            address: "",
            city: "",
            stateId: undefined,
            email: "",
            gender: undefined,
            birthDate: new Date(),
            waRoleId: undefined,
            fileId: undefined,
            userName: "",
            password: "",
            confirmPassword: "",
            imageUrl: "",
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (data: FormInputs) => {
        try {
            const phoneNumber = `${data.code} ${data.phone}`;

            const payload: Partial<IUser> = {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: phoneNumber.replace(/[^\d]/g, ""),
                address: data.address,
                city: data.city,
                stateId: data.stateId,
                email: data.email,
                gender: data.gender,
                birthDate: moment.utc(data.birthDate).format("MM/DD/YYYY"),
                waRoleId: parseInt(data.waRoleId),
                fileId: data.fileId ? data.fileId : undefined,
                userName: data.userName,
                password: data.password,
            };

            await UserService.createUser(payload);

            Message.success({ text: "Success" });

            navigate("/accounts/account-users");
        } catch (error) {
            reset(data);
        }
    };

    return (
        <Spin spinning={loading}>
            <Breadcrumb title="New User" breadcrumbs={BREAD_CRUMBS} />
            <div className="p-4 shadow rounded-xl bg-gray-50">
                <Spin spinning={isSubmitting}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                            <div className="col-span-12 pb-3">
                                <h4 className="font-semibold text-blue-500 text-xl">Personal Information</h4>
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFTextField<FormInputs>
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
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-12 lg:col-span-12" />
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <Label title="Phone number" required />
                                <Space.Compact className="w-full">
                                    <RHFSelect<FormInputs>
                                        control={control}
                                        name={"code"}
                                        options={PHONE_CODES}
                                        showError={false}
                                        showSearch={false}
                                        className="w-20 min-w-20 flex-shrink-0 cursor-pointer"
                                    />
                                    <RHFPhoneInput<FormInputs>
                                        mask={MASK_PHONE_NUMER}
                                        control={control}
                                        name={"phone"}
                                        placeholder="Enter phone number"
                                        showError={false}
                                    />
                                </Space.Compact>
                                <HelperText message={errors.phone?.message || ""} />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFTextField<FormInputs>
                                    control={control}
                                    name={"address"}
                                    placeholder="Enter address"
                                    label="Address"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFTextField<FormInputs>
                                    control={control}
                                    name={"city"}
                                    placeholder="Enter city"
                                    label="City"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFSelect<FormInputs>
                                    className="w-full"
                                    control={control}
                                    name={"stateId"}
                                    options={getOptionsState(state)}
                                    placeholder="Select state"
                                    label="State"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFTextField<FormInputs>
                                    control={control}
                                    name={"email"}
                                    placeholder="Enter email"
                                    label="Email"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFSelect<FormInputs>
                                    className="w-full"
                                    control={control}
                                    name={"gender"}
                                    options={GENDER_OPTOINS}
                                    placeholder="Select gender"
                                    label="Gender"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFDatePicker<FormInputs>
                                    className="w-full"
                                    control={control}
                                    name={"birthDate"}
                                    placeholder="Select date"
                                    label="Birthday"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFSelect<FormInputs>
                                    className="w-full"
                                    control={control}
                                    name={"waRoleId"}
                                    options={ROLE_OPTIONS}
                                    placeholder="Select role"
                                    label="Role"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFUpload<FormInputs>
                                    rules={{
                                        required: "This is a required field!",
                                    }}
                                    control={control}
                                    labelRequired={false}
                                    name={`imageUrl`}
                                    accept="image/*"
                                    action={`${API_BASE_URL}File`}
                                    label="Avatar"
                                    onUploaded={function (fileId: number, path: string): void {
                                        setValue("fileId", fileId, { shouldValidate: true });
                                        setValue("imageUrl", path, { shouldValidate: true });
                                    }}
                                />
                            </div>
                            <div className="col-span-12 pb-3">
                                <h4 className="font-semibold text-blue-500 text-xl">Account Information</h4>
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFTextField<FormInputs>
                                    control={control}
                                    name={"userName"}
                                    placeholder="Enter user name"
                                    label="User Name"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFTextField<FormInputs>
                                    control={control}
                                    name={"password"}
                                    placeholder="Enter password"
                                    label="Password"
                                    type="password"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 lg:col-span-4">
                                <RHFTextField<FormInputs>
                                    control={control}
                                    name={"confirmPassword"}
                                    placeholder="Enter confirm password"
                                    label="Confirm Password"
                                    type="password"
                                />
                            </div>
                            <div className="col-span-12 pt-2">
                                <div className="flex space-x-2">
                                    <Button title="CANCEL" onClick={() => navigate("/accounts/account-users")} />
                                    <Button title="SAVE" type="submit" btnType="ok" />
                                </div>
                            </div>
                        </div>
                    </form>
                </Spin>
            </div>
        </Spin>
    );
};

export default CreateUser;
