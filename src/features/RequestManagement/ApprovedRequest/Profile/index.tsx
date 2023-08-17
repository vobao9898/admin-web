import { Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Page from "components/Page";
import IMerchant from "interfaces/IMerchant";
import moment from "moment";
import RequestManagementService from "services/RequestManagementService";
import MerchantInformation from "features/RequestManagement/Components/MerchantInformation";

const BREAD_CRUMBS = [
    {
        name: "Approved Request Detail",
        path: "/request/approved-request",
    },
    {
        name: "Detail",
        path: "",
    },
];

const PendingRequestDetail = () => {
    const navigate = useNavigate();
    const { merchantId } = useParams();

    const [pending, setPending] = useState<IMerchant>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getPending = async (merchantId: string) => {
            try {
                const data = await RequestManagementService.getPendingById(parseInt(merchantId));
                setPending(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (merchantId && loading) {
            getPending(merchantId);
        }
    }, [merchantId, loading]);

    const onClickBack = () => {
        navigate("/request/approved-request");
    };

    let utc = pending?.handlingActivities[0]?.createDate;
    utc = moment(utc).format("MM/DD/YYYY - hh:mm A");

    return (
        <Page title="Approved Request Profile">
            <Spin className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6 gap-5 intro-x" spinning={loading}>
                <Breadcrumb title="Approved Request" breadcrumbs={BREAD_CRUMBS} />
                <div className="px-4 py-5 rounded-xl shadow bg-gray-50 col-span-2 row-span-2 grid">
                    <div className="flex mt-4 px-4 justify-between border-b border-blue-500 h-[60px] items-center">
                        <p className="font-semibold text-lg text-black">ID-{pending?.merchantId}</p>
                        <Button title="BACK" onClick={onClickBack} />
                    </div>
                    <div className="p-4 border-b border-blue-500">
                        <p className="w-fit mb-3 px-8 py-2 text-white bg-green-500 font-bold text-lg">APPROVED</p>
                        <p className="mb-2 text-blue-500 font-bold text-lg">
                            By {pending && `${pending?.adminUser?.first_name} ${pending?.adminUser?.last_name}`}
                        </p>
                        <p className="font-semibold text-black text-md">Date/Time: {utc}</p>
                    </div>
                    {pending && <MerchantInformation pending={pending} />}
                </div>
            </Spin>
        </Page>
    );
};

export default PendingRequestDetail;
