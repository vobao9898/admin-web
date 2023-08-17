import { useState } from "react";
import { Spin } from "antd";
import Page from "components/Page";
import Appointment from "./Appointment";
import Order from "./Order";
import Merchant from "./Merchant";
import Consumer from "./Consumer";
import GiftCard from "./GiftCard";
import Transaction from "./Transaction";
import ModalSuccess from "components/Modal";

const Dashboard = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [isExport, setIsExport] = useState<boolean>(false);
    const [linkExport, setLinkExport] = useState<string>("");

    const onClose = () => {
        setIsExport(false);
    };

    return (
        <Page title="Dashboard">
            <div className="bg-blue-secondary">
                <Spin spinning={loading}>
                    <ModalSuccess isExport={isExport} linkExport={linkExport} onClose={onClose}></ModalSuccess>
                    <div className="text-[24px] text-black font-semibold">Dashboard</div>
                    <div className="mt-[26px] grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 pb-25 dashboard gap-y-4 gap-x-4">
                        <Appointment
                            setLoadingExport={(value: boolean) => setLoading(value)}
                            setIsExport={(value: boolean) => setIsExport(value)}
                            setLinkExport={(value: string) => setLinkExport(value)}
                        />
                        <Order
                            setLoadingExport={(value: boolean) => setLoading(value)}
                            setIsExport={(value: boolean) => setIsExport(value)}
                            setLinkExport={(value: string) => setLinkExport(value)}
                        />
                        <Merchant
                            setLoadingExport={(value: boolean) => setLoading(value)}
                            setIsExport={(value: boolean) => setIsExport(value)}
                            setLinkExport={(value: string) => setLinkExport(value)}
                        />
                        <Consumer
                            setLoadingExport={(value: boolean) => setLoading(value)}
                            setIsExport={(value: boolean) => setIsExport(value)}
                            setLinkExport={(value: string) => setLinkExport(value)}
                        />
                        <GiftCard
                            setLoadingExport={(value: boolean) => setLoading(value)}
                            setIsExport={(value: boolean) => setIsExport(value)}
                            setLinkExport={(value: string) => setLinkExport(value)}
                        />
                        <Transaction
                            setLoadingExport={(value: boolean) => setLoading(value)}
                            setIsExport={(value: boolean) => setIsExport(value)}
                            setLinkExport={(value: string) => setLinkExport(value)}
                        />
                    </div>
                </Spin>
            </div>
        </Page>
    );
};

export default Dashboard;
