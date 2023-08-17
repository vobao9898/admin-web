import { yupResolver } from "@hookform/resolvers/yup";
import { Space } from "antd";
import { RHFDatePicker, RHFPhoneInput, RHFSelect, RHFTextField } from "components/Form";
import { GENDER_OPTOINS, KEY_USER, PHONE_CODES, MASK_PHONE_NUMER } from "contants";
import { useForm } from "react-hook-form";
import { testValidPhone } from "utils";
import { IGlobalUser } from "context/Reducer";
import HelperText from "components/HelperText";
import Label from "components/Label";
import Message from "components/Message";
import IUser from "interfaces/IUser";
import moment from "moment";
import React from "react";
import UserService from "services/UserService";
import * as yup from "yup";

type FormInputs = {
    phone: string;
    address: string;
    email: string;
    gender: string;
    birthDate: Date;
    codePhone: number;
};

const schema = yup.object({
    address: yup.string().required("This is a required field!"),
    phone: yup
        .string()
        .required("This is a required field!")
        .test("phoneValid", `Invalid phone number`, function (value) {
            return testValidPhone(this.parent.codePhone, value);
        }),
    codePhone: yup.number().required("This is a required field!"),
    email: yup.string().required("This is a required field!").email("Please enter a valid email address!"),
    gender: yup.string().required("This is a required field!"),
    birthDate: yup.date().required("This is a required field!"),
});

interface IProps {
    user: IUser;
    userGlobal: IGlobalUser;
    imgUpload: string;
    fileId?: number;
    onUpdateSuccess: () => void;
}

const FormProfile: React.FC<IProps> = ({ user, userGlobal, imgUpload, fileId, onUpdateSuccess }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            codePhone: user.code || 1,
            phone: user.phone,
            address: user.address,
            email: user.email,
            gender: user.gender,
            birthDate: new Date(user.birthDate),
        },
    });

    const onSubmit = async (data: FormInputs) => {
        if (user) {
            try {
                const phoneNumber = `${data.codePhone} ${data.phone}`;

                const payload: Partial<IUser> = {
                    ...user,
                    address: data.address,
                    email: data.email,
                    gender: data.gender,
                    phone: phoneNumber.replace(/[^\d]/g, ""),
                    birthDate: moment(data.birthDate).format("MM/DD/YYYY"),
                    fileId: fileId,
                };
                if (userGlobal.userAdmin.waUserId === user.waUserId) {
                    const userAdmin = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        imageUrl: imgUpload
                            ? imgUpload
                            : "https://storage.harmonypayment.com/1638258756223099055_23cff1f4-312e-42e2-9dcb-df3afeb1603b.png",
                        roleName: user.roleName,
                        waUserId: user.waUserId,
                    };
                    localStorage.setItem(
                        KEY_USER,
                        JSON.stringify({
                            token: userGlobal.token,
                            userAdmin,
                        })
                    );
                }
                const message = await UserService.editUser(user.waUserId, payload);

                Message.success({ text: message });
                window.location.reload();
                onUpdateSuccess();
            } catch (error) {
                reset(data);
            }
        }
    };

    return (
        <form id="formChangeUserData" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                <div className="col-span-12 pb-3 mt-3">
                    <h4 className="font-semibold text-blue-500 text-xl">Personal Information</h4>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                    <Label title="Phone number" required />
                    <Space.Compact className="w-full">
                        <RHFSelect<FormInputs>
                            control={control}
                            name={"codePhone"}
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
                <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                    <RHFTextField<FormInputs>
                        control={control}
                        name={"address"}
                        placeholder="Enter address"
                        label="Address"
                    />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                    <RHFTextField<FormInputs>
                        control={control}
                        name={"email"}
                        placeholder="Enter email"
                        label="Email"
                    />
                </div>
                <div className="col-span-12 pb-3 mt-3">
                    <h4 className="font-semibold text-blue-500 text-xl">Account Information</h4>
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                    <RHFDatePicker<FormInputs>
                        className="w-full"
                        control={control}
                        name={"birthDate"}
                        placeholder="Select date"
                        label="Birthday"
                    />
                </div>
                <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                    <RHFSelect<FormInputs>
                        className="w-full"
                        control={control}
                        name={"gender"}
                        options={GENDER_OPTOINS}
                        placeholder="Select gender"
                        label="Gender"
                        labelRequired={false}
                    />
                </div>
            </div>
        </form>
    );
};

export default FormProfile;
