import { Switch, Spin, Modal } from "antd";
import { useState, useEffect } from "react";
import Breadcrumb from "components/Breadcrumb";
import SettingService from "services/SettingService";
import ISetting from "interfaces/ISetting";
import Page from "components/Page";
import Message from "components/Message/Message";

const { confirm } = Modal;

const BREAD_CRUMBS = [
    {
        name: "Settings",
        path: "/settings/maintenance",
    },
    {
        name: "Maintenance",
        path: "/settings/maintenance",
    },
];

const Maintenance = () => {
    const [setting, setSetting] = useState<ISetting | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await SettingService.get();
                setLoading(false);
                setSetting(data);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading]);

    const handleClick = (checked: boolean) => {
        confirm({
            title: "Are you sure you want to switch?",
            okText: "Yes",
            cancelText: "No",
            onOk() {
                if (setting) {
                    const newSetting: ISetting = {
                        ...setting,
                        value: checked,
                    };
                    setSetting(newSetting);
                    handleUpdate(checked);
                }
            },
        });
    };

    const handleUpdate = async (value: boolean) => {
        try {
            const message = await SettingService.updateMaintenance(value);
            Message.success({ text: message });
            setLoading(true);
        } catch (error) {
            setLoading(true);
        }
    };

    return (
        <Page title="Maintenance">
            <Spin spinning={loading}>
                <Breadcrumb title="Settings" breadcrumbs={BREAD_CRUMBS} />
                <div className="p-4 shadow rounded-2xl bg-gray-50">
                    <div className="font-bold text-lg mb-4 text-blue-500">Maintenance</div>
                    <div className="flex">
                        <div className="mr-2 flex items-center text-cyan-blue">Maintenance mode on Portal:</div>
                        <Switch checked={setting?.value} onChange={handleClick} />
                    </div>
                </div>
            </Spin>
        </Page>
    );
};

export default Maintenance;
