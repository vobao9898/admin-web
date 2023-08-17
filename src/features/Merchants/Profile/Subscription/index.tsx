import { useEffect, useState } from "react";
import { Spin } from "antd";
import { ID_PACKAGE_ALLOW_ADD_MORE_STAFF } from "contants";
import moment from "moment";
import Button from "components/Button";
import IPricingPlan from "interfaces/IPricingPlan";
import ISubscription from "interfaces/ISubscription";
import MerchantService from "services/MerchantService";
import PricingPlanService from "services/PricingPlanService";
import BillingTable from "./Components/BillingTable";
import ModalForm from "./Components/ModalForm";

interface IProps {
    merchantId: number;
    handleChangeState: (value: string) => void;
}

const Subscription: React.FC<IProps> = ({ merchantId, handleChangeState }) => {
    const [subscription, setSubscription] = useState<ISubscription>();
    const [loading, setLoading] = useState<boolean>(true);
    const [packages, setPackages] = useState<IPricingPlan[]>();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<number>(0);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const { data } = await PricingPlanService.get();
                setPackages(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        const fetchDataSubscription = async (merchantId: number) => {
            try {
                const data = await MerchantService.getSubscription(merchantId);
                setSubscription(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        if (merchantId && loading) {
            fetchDataSubscription(merchantId);
        }
    }, [merchantId, loading]);

    const onCloseEdit = () => {
        setOpenModal(false);
    };

    const handleEdit = () => {
        if (merchantId) {
            setOpenModal(true);
        }
    };

    const handleSuccess = () => {
        setOpenModal(false);
        setLoading(true);
        setRefresh((preVal) => preVal + 1);
    };

    return (
        <Spin spinning={loading}>
            {packages && subscription && openModal ? (
                <ModalForm
                    subscription={subscription}
                    packages={packages}
                    onClose={onCloseEdit}
                    onSuccess={handleSuccess}
                />
            ) : null}
            <div className="p-4 bg-gray-50 shadow rounded-xl">
                {subscription && (
                    <>
                        <div className="mb-4">
                            <div className="font-bold text-lg mb-4 text-blue-500">Subscription</div>
                            <div className="w-3/5 mb-3">
                                <div className="grid grid-cols-2 items-center">
                                    <div>{"Current Subscription Plan"}</div>
                                    <div>{subscription?.planName}</div>
                                    <div>{"Pricing Model"}</div>
                                    <div>Paid {subscription?.pricingType}</div>
                                    <div>{"Next Payment Date"}</div>
                                    <div>{moment(subscription?.expiredDate).format("MMM D, YYYY")}</div>
                                    <div>{"Amount"}</div>
                                    <div>${subscription?.totalPrice}</div>
                                    {subscription && subscription?.packageId === ID_PACKAGE_ALLOW_ADD_MORE_STAFF && (
                                        <>
                                            <div>{"Addition staff"}</div>
                                            <div>{subscription?.additionStaff}</div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="mr-2 mt-1">
                                <Button btnType="ok" onClick={handleEdit} title="Edit" />
                            </div>
                        </div>
                        <div>
                            <div className="font-bold text-lg mb-4 text-blue-500">Payment Method</div>
                            <p>{subscription?.paymentMethod}</p>
                            <div className="mr-2 mt-3">
                                <Button
                                    btnType="ok"
                                    onClick={() => {
                                        handleChangeState("Bank");
                                    }}
                                    title="Edit"
                                />
                            </div>
                        </div>
                    </>
                )}
                <div className="mt-8">
                    {subscription ? (
                        <BillingTable refresh={refresh} subscriptionId={subscription.subscriptionId} />
                    ) : null}
                </div>
            </div>
        </Spin>
    );
};

export default Subscription;
