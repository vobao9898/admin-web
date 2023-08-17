import { useState } from "react";
import { Tabs } from "antd";
import GiftCard from "./GiftCard";
import NailSoftGiftCard from "./NailSoftGiftCard";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import Page from "components/Page";

const GiftCardSold = () => {
    const [activeTab, setActiveTab] = useState("giftCard");

    const tabs = [
        {
            key: "giftCard",
            title: "Gift Card",
            content: <GiftCard />,
        },
        {
            title: "NailSoft GC",
            key: "nailSoftGiftCard",
            content: <NailSoftGiftCard />,
        },
    ];

    const BREAD_CRUMBS = [
        {
            name: "Report",
            path: "",
        },
        {
            name: "Gift Card Transactions",
            path: "/reports/gift-card-transactions",
        },
    ];

    const handleChangeTabs = (key: string) => {
        localStorage.setItem("toggleState", JSON.stringify(key));
        setActiveTab(key);
    };

    return (
        <Page title="Gift Card Transactions">
            <div className="grid">
                <Breadcrumb title="Gift Card Transactions" breadcrumbs={BREAD_CRUMBS} />
                <div className="mb-5 p-4 shadow rounded-xl bg-gray-50">
                    <Tabs activeKey={activeTab} onChange={handleChangeTabs}>
                        {tabs.map((item) => (
                            <Tabs.TabPane tab={item?.title} key={item?.key}>
                                {item?.content}
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                </div>
            </div>
        </Page>
    );
};

export default GiftCardSold;
