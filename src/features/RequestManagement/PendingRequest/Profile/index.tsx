import { Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import Button from "components/Button/Button";
import Page from "components/Page";
import IMerchant from "interfaces/IMerchant";
import IState from "interfaces/IState";
import moment from "moment";
import RequestManagementService from "services/RequestManagementService";
import StateService from "services/StateService";
import MerchantInformation from "../../Components/MerchantInformation";
import Accept from "./Components/Accept";
import EditPending from "./Components/Edit";
import Reject from "./Components/Reject";
import Message from "components/Message";

const BREAD_CRUMBS = [
    {
        name: "Pending Request Detail",
        path: "/request/pending-request",
    },
    {
        name: "Detail",
        path: "",
    },
];

const PendingRequestDetail = () => {
    const { merchantId } = useParams();
    const navigate = useNavigate();

    const [pending, setPending] = useState<IMerchant>();
    const [loading, setLoading] = useState<boolean>(true);
    const [status, setStatus] = useState<number>();
    const [isReject, setIsReject] = useState<boolean>(false);
    const [isAccept, setIsAccept] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [state, setState] = useState<IState[]>([]);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const data = await StateService.get();
                setState(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchState();
    }, []);

    useEffect(() => {
        const getPending = async (merchantId: string) => {
            try {
                const data: IMerchant = await RequestManagementService.getPendingById(parseInt(merchantId));

                if (data?.isApproved === 1) {
                    navigate("/request/approved-request/" + data?.merchantId);
                }

                if (data?.isRejected === 1) {
                    navigate("/request/rejected-request/" + data?.merchantId);
                }

                setPending(data);
                setStatus(data?.status);
                setLoading(false);
            } catch (error) {
                navigate("/request/pending-request");
            }
        };

        if (merchantId && loading) {
            getPending(merchantId);
        }
    }, [merchantId, loading, navigate]);

    const onClickBack = () => {
        navigate("/request/pending-request");
    };

    const changeStatus = async (value: number) => {
        try {
            if (merchantId) {
                const message = await RequestManagementService.updateStatus({ Status: value }, parseInt(merchantId));
                Message.success({ text: message });
                setLoading(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCloseReject = () => {
        setIsReject(false);
    };

    const handleOpenReject = () => {
        setIsReject(true);
    };

    const handleCloseAccept = () => {
        setIsAccept(false);
    };

    const handleOpenAccept = () => {
        setIsAccept(true);
    };

    const closeEdit = () => {
        setIsEdit(false);
    };

    const handleSuccess = () => {
        setLoading(true);
        setIsEdit(false);
    };

    let utc = pending?.handlingActivities[0]?.createDate;
    utc = moment(utc).format("MM/DD/YYYY - hh:mm A");

    return (
        <Page title="Pending Request Profile">
            <Spin className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x" spinning={loading}>
                {pending && merchantId && (
                    <>
                        <Reject
                            handleClose={handleCloseReject}
                            isReject={isReject}
                            merchantId={merchantId}
                            pending={pending}
                        />
                        <Accept
                            isAccept={isAccept}
                            handleClose={handleCloseAccept}
                            merchantId={merchantId}
                            pending={pending}
                            setIsLoading={setLoading}
                        />
                    </>
                )}

                {!isEdit && (
                    <>
                        <Breadcrumb title="Pending Request Detail" breadcrumbs={BREAD_CRUMBS} />
                        <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
                            <div className="flex mt-4 px-4 justify-between border-b border-blue-500 h-[60px] items-center">
                                <p className="font-semibold text-lg text-black">ID-{pending?.merchantId}</p>
                                <ul className="flex">
                                    <li>
                                        <Button title="BACK" moreClass="mr-5" onClick={onClickBack} />
                                    </li>
                                    <li>
                                        <Button title="REJECT" moreClass="mr-5" onClick={handleOpenReject} />
                                    </li>
                                    <li>
                                        <Button title="EDIT" moreClass="mr-5" onClick={() => setIsEdit(true)} />
                                    </li>
                                    <li>
                                        <Button title="ACCEPT" btnType="ok" onClick={handleOpenAccept} />
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <div className="border-b border-blue-500 p-4">
                                    <Select
                                        size="large"
                                        value={status}
                                        onChange={(value) => changeStatus(value)}
                                        className="capitalize"
                                    >
                                        <Select.Option value={0}>Pending</Select.Option>
                                        <Select.Option value={1}>Handling</Select.Option>
                                    </Select>
                                    {pending?.handlingActivities.length !== 0 && (
                                        <div>
                                            <p className="mt-3 font-semibold text-md text-black">
                                                By {pending?.handlingActivities[0]?.waUserName}
                                            </p>
                                            <p className="mt-2 font-semibold text-md text-black">Date/Time: {utc}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {pending && <MerchantInformation pending={pending} />}
                        </div>
                    </>
                )}
                {isEdit && pending && merchantId && (
                    <EditPending
                        pending={pending}
                        state={state}
                        closeEdit={closeEdit}
                        onSuccess={handleSuccess}
                        merchantId={merchantId}
                    />
                )}
            </Spin>
        </Page>
    );
};

export default PendingRequestDetail;
