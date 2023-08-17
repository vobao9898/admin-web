import { RHFTextField } from "components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UserService from "services/UserService";
import classNames from "classnames";
import Message from "components/Message";
import * as yup from "yup";
import React from "react";

type FormInputs = {
    newPassword: string;
    confirmPassword: string;
};

const schema = yup.object({
    newPassword: yup.string().required("This is a required field!"),
    confirmPassword: yup
        .string()
        .required("This is a required field!")
        .test("matchTwoPassword", "Two passwords that you enter is inconsistent!", function (value) {
            return this.parent.newPassword === value;
        }),
});

interface IProps {
    currentPassword?: string;
    userId?: string;
    onUpdateSuccess: () => void;
}

const FormPassword: React.FC<IProps> = ({ currentPassword, userId, onUpdateSuccess }) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState<boolean>(false);

    const {
        control: controlPass,
        handleSubmit,
        reset,
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: FormInputs) => {
        if (userId && currentPassword) {
            try {
                const message = await UserService.editPasswordUser(currentPassword, data.newPassword, userId);
                Message.success({ text: message });
                reset({
                    newPassword: "",
                    confirmPassword: "",
                });
                onUpdateSuccess();
            } catch (error) {
                reset(data);
            }
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((preVal) => !preVal);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword((preVal) => !preVal);
    };

    return (
        <>
            <form id="formChangeUserData" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12 pb-3 mt-3">
                        <h4 className="font-semibold text-blue-500 text-xl">New Password</h4>
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <RHFTextField<FormInputs>
                            control={controlPass}
                            name={"newPassword"}
                            placeholder="Enter new password"
                            label="New Password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                                <i
                                    onClick={toggleShowPassword}
                                    className={classNames(
                                        "cursor-pointer text-lg las absolute top-1.5 right-3 z-10",
                                        { "la-eye-slash": !showPassword },
                                        { "la-eye": showPassword }
                                    )}
                                />
                            }
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 lg:col-span-6">
                        <RHFTextField<FormInputs>
                            control={controlPass}
                            name={"confirmPassword"}
                            placeholder="Enter confirm new password"
                            label="Confirm New Password"
                            type={showConfirmPassword ? "text" : "password"}
                            endAdornment={
                                <i
                                    onClick={toggleShowConfirmPassword}
                                    className={classNames(
                                        "cursor-pointer text-lg las absolute top-1.5 right-3 z-10",
                                        { "la-eye-slash": !showConfirmPassword },
                                        { "la-eye": showConfirmPassword }
                                    )}
                                />
                            }
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default FormPassword;
