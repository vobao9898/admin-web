import { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import General from "./General/General";
import Transactions from "./Transactions";
import Activities from "./Activities";
import Setting from "./Setting";
import IConsumer from "interfaces/IConsumer";
import ConsumerService from "services/ConsumerService";
import Page from "components/Page";

const BREAD_CRUMBS = [
    {
        name: "Customer",
        path: "/consumer",
    },
    {
        name: "Detail",
        path: "/consumer",
    },
];

const ConsumerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [consumer, setConsumer] = useState<IConsumer>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async (id: number) => {
            try {
                const data = await ConsumerService.getById(id);
                setConsumer(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                navigate("/consumer");
            }
        };
        if (id && loading) {
            fetchData(parseInt(id));
        }
    }, [id, loading, navigate]);

    const handleLoadData = () => {
        setLoading(true);
    };

    const TABS = [
        {
            key: "General",
            content: <General consumer={consumer} loadData={handleLoadData} />,
        },
        {
            key: "Transactions",
            content: <Transactions consumer={consumer} />,
        },
        {
            key: "Activities",
            content: <Activities consumer={consumer} />,
        },
        {
            key: "Setting",
            content: <Setting consumer={consumer} loadData={handleLoadData} />,
        },
    ];

    return (
        <Page title="Consumer Detail">
            <Breadcrumb title="Consumer Detail" breadcrumbs={BREAD_CRUMBS} />
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="mb-5 flex justify-between items-center">
                    <span className="text-lg font-semibold text-black">ID : {consumer?.accountId}</span>
                    <Button title="BACK" onClick={() => window.history.back()} />
                </div>
                <Tabs defaultActiveKey={"General"}>
                    {TABS.map((item) => (
                        <Tabs.TabPane tab={item?.key} key={item.key}>
                            {item?.content}
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </div>
        </Page>
    );
};

export default ConsumerProfile;
