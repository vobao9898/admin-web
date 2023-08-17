import { yupResolver } from "@hookform/resolvers/yup";
import { RHFTextField } from "components/Form";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserService from "services/UserService";
import Logo from "assets/images/logoLogin.svg";
import RoundButton from "components/RoundButton";
import Spin from "components/Spin";
import React from "react";
import * as yup from "yup";
import classNames from "classnames";

type FormInputs = {
    username: string;
    password: string;
};

const schema = yup.object({
    username: yup.string().required("This is a required field!").email("Please enter a valid email address!"),
    password: yup.string().required("This is a required field!"),
});

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState<boolean>(false);

    const {
        control,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormInputs) => {
        try {
            const verifyCodeId = await UserService.login(data.username, data.password);
            navigate("/verify", {
                state: {
                    verifyCodeId,
                },
            });
        } catch (error) {
            reset({
                password: data.password,
                username: data.username,
            });
        }
    };

    const toggleShowPassword = () => {
        setShowPassword((preVal) => !preVal);
    };

    return (
        <div className="h-screen layout-auth z-10 flex items-center justify-center bg-alice-blue">
            <div className="container lg:w-3/5 mx-auto flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden flex w-full">
                    <div className="w-full flex justify-center flex-col p-10">
                        <div className="mb-8">
                            <h1 className="intro-x text-4xl mb-3 font-bold">Sign In</h1>
                        </div>
                        <Spin spinning={isSubmitting}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-12 space-y-4">
                                    <div className="col-span-12">
                                        <RHFTextField<FormInputs>
                                            control={control}
                                            name={"username"}
                                            label="Username"
                                            placeholder="Enter username"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <div className="col-span-12">
                                            <RHFTextField<FormInputs>
                                                type={showPassword ? "text" : "password"}
                                                control={control}
                                                name={"password"}
                                                label="Password"
                                                placeholder="Enter password"
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
                                    </div>
                                    <div className="col-span-12">
                                        <RoundButton type="submit" title="Log In" />
                                    </div>
                                </div>
                            </form>
                        </Spin>
                    </div>
                    <div className="w-3/5 bg-blue-primary p-10 flex justify-center items-center">
                        <img src={Logo} alt="logo" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
