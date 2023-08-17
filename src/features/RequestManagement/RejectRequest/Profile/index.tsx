import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import Button from "components/Button/Button";
import IMerchant from "interfaces/IMerchant";
import RequestManagementService from "services/RequestManagementService";
import MerchantInformation from "features/RequestManagement/Components/MerchantInformation";
import Message from "components/Message";
import EditPending from "features/RequestManagement/RejectRequest/Profile/Components/EditPending";
import Page from "components/Page";
import IState from "interfaces/IState";
import moment from "moment";
import StateService from "services/StateService";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { Modal, Spin } from "antd";

const BREAD_CRUMBS = [
    {
        name: "Reject Request Detail",
        path: "/request/rejected-request",
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
    const [loading, setLoading] = useState(true);
    const [loadingEdit, setLoadingEdit] = useState<boolean>(false);
    const [isVisiable, setIsVisiable] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [state, setState] = useState<IState[]>([]);

    useEffect(() => {
        const fetchData = async (merchantId: number) => {
            try {
                const data = await RequestManagementService.getPendingById(merchantId);
                const stateData = await StateService.get();
                if (!data) {
                    navigate("/request/rejected-request");
                    return;
                }
                setPending(data);
                setState(stateData);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (merchantId && loading) {
            fetchData(parseInt(merchantId));
        }
    }, [merchantId, loading, navigate]);

    const onClickBack = () => {
        navigate("/request/rejected-request");
    };

    const handleDelete = async () => {
        if (merchantId) {
            try {
                setLoadingEdit(true);
                const message = await RequestManagementService.deleteRejected(parseInt(merchantId));
                Message.success({ text: message });
                navigate("/request/rejected-request");
                setLoadingEdit(false);
            } catch (error) {
                setLoadingEdit(false);
            }
        }
    };

    const handleRevert = async () => {
        if (merchantId) {
            try {
                setLoadingEdit(true);
                const message = await RequestManagementService.revert(parseInt(merchantId));
                Message.success({ text: message });
                navigate("/request/pending-request");
                setLoadingEdit(false);
            } catch (error) {
                setLoadingEdit(false);
            }
        }
    };

    const toggleDelete = () => {
        setIsVisiable((preVal) => !preVal);
    };

    const toggleEdit = () => {
        setIsEdit((preVal) => !preVal);
    };

    const handleSuccess = () => {
        setLoading(true);
        setIsEdit(false);
    };

    let utc = pending?.handlingActivities[0]?.createDate;
    utc = moment(utc).format("MM/DD/YYYY - hh:mm A");

    return (
        <Page title="Reject Request Profile">
            <Spin
                className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x"
                spinning={loading || loadingEdit}
            >
                <Modal
                    open={isVisiable}
                    title={<p className="font-bold text-black text-lg">Delete Merchant?</p>}
                    onCancel={toggleDelete}
                    footer={
                        <div>
                            <button className="text-blue-500 px-3 py-1 hover:bg-blue-100 mr-5" onClick={toggleDelete}>
                                DISAGREE
                            </button>
                            <button className="text-blue-500 px-3 py-1 hover:bg-blue-100" onClick={handleDelete}>
                                AGREE
                            </button>
                        </div>
                    }
                >
                    <p>
                        This Merchant will be remove from the app. You can not restore this Merchant, Are you sure you
                        want to do this?.
                    </p>
                </Modal>
                {!isEdit && (
                    <>
                        <Breadcrumb title="Reject Request Detail" breadcrumbs={BREAD_CRUMBS} />
                        <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
                            <div className="flex mt-4 px-4 justify-between border-b border-blue-500 h-[60px] items-center">
                                <p className="font-semibold text-lg text-black">ID-{pending?.merchantId}</p>
                                <div className="flex gap-x-5">
                                    <Button title="DELETE" onClick={toggleDelete} />
                                    <Button title="EDIT" onClick={toggleEdit} />
                                    <Button title="REVERT" onClick={handleRevert} />
                                    <Button title="BACK" onClick={onClickBack} />
                                </div>
                            </div>
                            <div>
                                <div className=" border-b border-blue-500 p-4">
                                    <p className="w-fit mb-3 px-8 py-2 text-white bg-red-500 font-bold text-lg">
                                        REJECTED
                                    </p>
                                    <p className="mt-3 font-semibold text-md text-black">
                                        By {pending?.adminUser?.first_name + " " + pending?.adminUser?.last_name}
                                    </p>
                                    <p className="mt-2 font-semibold text-md text-black">Date/Time: {utc}</p>
                                    <p className="mt-2 font-semibold text-md text-black">Reason:</p>
                                    <p className="mt-2">{pending?.reason}</p>
                                </div>
                            </div>

                            {pending && <MerchantInformation pending={pending}></MerchantInformation>}
                        </div>
                    </>
                )}
                {isEdit && pending && merchantId && (
                    <EditPending
                        pending={pending}
                        state={state}
                        onClose={toggleEdit}
                        onSuccess={handleSuccess}
                        merchantId={merchantId}
                    />
                )}
            </Spin>
        </Page>
    );
};

export default PendingRequestDetail;
