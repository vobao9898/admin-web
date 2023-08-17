import { yupResolver } from "@hookform/resolvers/yup";
import { RHFTextField } from "components/Form";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UserService from "services/UserService";
import Logo from "assets/images/logoLogin.svg";
import RoundButton from "components/RoundButton";
import Spin from "components/Spin";
import useUser from "hooks/useUser";
import * as yup from "yup";
import { IGlobalUser } from "context/Reducer";

type FormInputs = {
    code: string;
};

interface CustomizedState {
    verifyCodeId: number;
}

const schema = yup.object({
    code: yup.string().required("This is a required field!"),
});

const Verify = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const { login } = useUser();

    const {
        control,
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<FormInputs>({
        mode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues: {
            code: "",
        },
    });

    const onSubmit = async (data: FormInputs) => {
        try {
            const resp = await UserService.verify((state as CustomizedState).verifyCodeId, data.code);
            const user: IGlobalUser = {
                token: resp?.token,
                userAdmin: {
                    firstName: resp?.userAdmin?.firstName,
                    lastName: resp?.userAdmin?.lastName,
                    imageUrl: resp?.userAdmin?.imageUrl,
                    roleName: resp?.userAdmin?.roleName,
                    waUserId: resp?.userAdmin?.waUserId,
                },
            };
            login(user);
            navigate("/");
        } catch (error) {
            reset({});
        }
    };

    return (
        <div className="h-screen layout-auth z-10 flex items-center justify-center bg-alice-blue">
            <div className="container lg:w-3/5 mx-auto flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden flex w-full">
                    <div className="w-full flex justify-center flex-col p-10">
                        <div className="mb-8">
                            <h1 className="intro-x text-4xl mb-3 font-bold">Verification code</h1>
                            <p>Your account will be locked if you don't verify after 5 times</p>
                        </div>
                        <Spin spinning={isSubmitting}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid grid-cols-12 space-y-4">
                                    <div className="col-span-12">
                                        <RHFTextField<FormInputs>
                                            control={control}
                                            name={"code"}
                                            placeholder="Enter verification code"
                                            label="Verification code"
                                        />
                                    </div>
                                    <div className="col-span-12">
                                        <RoundButton type="submit" title="Verification code" />
                                    </div>
                                </div>
                            </form>
                            <div className="mt-3 intro-x">
                                <Link to="/login">Another account?</Link>
                            </div>
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

export default Verify;
