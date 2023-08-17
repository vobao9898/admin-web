import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCodeAndPhoneNumber, maskPhone } from "utils";
import { API_BASE_URL } from "contants";
import { useUser } from "hooks/useUser";
import classNames from "classnames";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Upload from "components/Upload/Upload";
import Message from "components/Message";
import IUser from "interfaces/IUser";
import UserService from "services/UserService";
import moment from "moment";
import FormPassword from "./FormPassword";
import FormProfile from "./FormProfile";

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
        name: "Profile",
        path: "",
    },
];

const Profile = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [user, setUser] = useState<IUser>();
    const [imgUpload, setImgUpload] = useState<string>("");
    const [fileId, setFileId] = useState<number>(0);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const { userGlobal } = useUser();

    useEffect(() => {
        const loadUser = async (id: string) => {
            try {
                const data = await UserService.getUserById(id);
                const [code, phone] = getCodeAndPhoneNumber(data?.phone);
                const user = {
                    ...data,
                    code,
                    phone,
                };
                setUser(user);
                setLoading(false);
                setImgUpload(user?.imageUrl);
                if (user.fileId) setFileId(user.fileId);
            } catch (error) {
                setLoading(false);
                navigate(`/accounts/account-users`);
            }
        };
        if (id && loading) {
            loadUser(id);
        }
    }, [id, loading, navigate]);

    const handleEnable = async (status: number, id: string) => {
        if (status === 1) {
            try {
                const message = await UserService.enableUser(id);
                Message.success({ text: message });
                setLoading(true);
            } catch (error) {
                console.log(error);
            }
        } else {
            // TODO Missing api disable user
        }
    };

    const handleUpdateSuccess = () => {
        if (id) {
            setIsEdit(false);
            setLoading(true);
        }
    };

    return (
        <div>
            <Breadcrumb title="Profile" breadcrumbs={BREAD_CRUMBS} />
            <div className="p- rounded-xl">
                <Spin spinning={loading}>
                    {!isEdit && (
                        <div className="p-4 flex justify-between bg-gray-50 shadow rounded-xl">
                            <div className="w-1/3">
                                <div className="flex justify-center">
                                    {!isEdit && (
                                        <div
                                            className="w-[200px] h-[200px] rounded-full bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url(${user?.imageUrl})`,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="w-3/4 pl-5">
                                <div className="py-2 flex justify-between border-b border-black/10">
                                    <div>
                                        <h2 className="mb-1 font-bold text-black text-3xl">
                                            {user && user?.firstName + " " + user?.lastName}
                                        </h2>
                                        <h4 className="text-lg text-blue-500 font-medium">{user && user?.roleName}</h4>
                                    </div>
                                    <div className="flex items-center">
                                        {!isEdit && (
                                            <>
                                                {userGlobal?.userAdmin.waUserId !== user?.waUserId ? (
                                                    <>
                                                        <Button
                                                            title="BACK"
                                                            onClick={() => navigate(`/accounts/account-users/`)}
                                                            moreClass="mr-5"
                                                        />
                                                        <Button
                                                            title={user?.isDisabled === 0 ? "DISABLE" : "ENABLE"}
                                                            onClick={() => {
                                                                user && id && handleEnable(user?.isDisabled, id);
                                                            }}
                                                            moreClass="mr-5"
                                                        />
                                                    </>
                                                ) : null}
                                                <Button
                                                    title="EDIT"
                                                    btnType="ok"
                                                    onClick={() => {
                                                        setIsEdit(true);
                                                        setIsEditPassword(false);
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                {!isEdit && (
                                    <div>
                                        <h4 className="my-5 text-lg text-blue-500 font-semibold">
                                            Contact Information
                                        </h4>
                                        <div className="flex flex-wrap">
                                            <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                                                <p>Phone</p>
                                                <p className="text-black font-semibold">
                                                    {user?.code && maskPhone(user?.code, user?.phone)}
                                                </p>
                                            </div>
                                            <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                                                <p>Address</p>
                                                <p className="text-black font-semibold">{user && user?.address}</p>
                                            </div>
                                            <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                                                <p>Email</p>
                                                <p className="text-black font-semibold">{user?.email}</p>
                                            </div>
                                        </div>
                                        <h4 className="my-5 text-lg text-blue-500 font-semibold">Basic Information</h4>
                                        <div className="flex flex-wrap">
                                            <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                                                <p>Date of Birth</p>
                                                <p className="text-black font-semibold">
                                                    {moment(user?.birthDate).format("MM/DD/YYYY")}
                                                </p>
                                            </div>
                                            <div className="w-full md:w-1/2 lg:w-1/3 mb-2">
                                                <p>Gender</p>
                                                <p className="text-black font-semibold capitalize">
                                                    {user && user?.gender}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {isEdit && (
                        <div className="p-4 flex justify-between bg-gray-50 shadow rounded-xl">
                            <div className="w-1/3">
                                <div className={classNames({ "flex justify-center": !isEdit })}>
                                    <div
                                        className="w-[200px] h-[200px] rounded-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${imgUpload})`,
                                        }}
                                    ></div>
                                </div>
                                {!isEditPassword && (
                                    <div className="col-span-12 flex justify-center max-w-[200px]">
                                        <Upload
                                            action={`${API_BASE_URL}File`}
                                            name="file"
                                            onUploaded={(fileId, path) => {
                                                setFileId(fileId);
                                                setImgUpload(path);
                                            }}
                                            content={
                                                <button className="mt-5 p-2 font-semibold text-black border shadow w-25">
                                                    Upload
                                                </button>
                                            }
                                        />
                                    </div>
                                )}
                                {isEdit && (
                                    <>
                                        <p
                                            className={`mt-5 hover:underline cursor-pointer ${
                                                isEditPassword ? "text-blue-300" : "text-blue-500"
                                            }`}
                                            onClick={() => setIsEditPassword(false)}
                                        >
                                            <i className="las la-pen" /> Profile
                                        </p>
                                        <p
                                            className={`mt-3 hover:underline cursor-pointer ${
                                                isEditPassword ? "text-blue-500" : "text-blue-300"
                                            }`}
                                            onClick={() => setIsEditPassword(true)}
                                        >
                                            <i className="las la-shield-alt" /> Change Password
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="w-3/4 pl-5">
                                <div className="py-2 flex justify-between border-b border-black/10">
                                    <div>
                                        <h2 className="mb-1 font-bold text-black text-3xl">
                                            {user && user?.firstName + " " + user?.lastName}
                                        </h2>
                                        <h4 className="text-lg text-blue-500 font-medium">{user && user?.roleName}</h4>
                                    </div>
                                    <div className="flex items-center">
                                        <Button
                                            title="CANCEL"
                                            btnType="cancel"
                                            onClick={() => setIsEdit(false)}
                                            moreClass="mr-5"
                                        />
                                        <Button title="SAVE" btnType="ok" type="submit" form="formChangeUserData" />
                                    </div>
                                </div>
                                {user ? (
                                    !isEditPassword ? (
                                        <>
                                            {userGlobal && (
                                                <FormProfile
                                                    user={user}
                                                    fileId={fileId}
                                                    onUpdateSuccess={handleUpdateSuccess}
                                                    userGlobal={userGlobal}
                                                    imgUpload={imgUpload}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <FormPassword
                                            currentPassword={user?.password}
                                            userId={id}
                                            onUpdateSuccess={handleUpdateSuccess}
                                        />
                                    )
                                ) : null}
                            </div>
                        </div>
                    )}
                </Spin>
            </div>
        </div>
    );
};

export default Profile;
