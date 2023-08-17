import { Modal, Spin, Tabs } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import Page from "components/Page";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import General from "./General/General";
import Bank from "./Bank";
import Principals from "./Principals";
import Activities from "./Activities";
import Setting from "../Setting";
import Device from "./Device";
import Invoice from "./Invoice";
import GiftCard from "./GiftCard";
import Extra from "./Extra";
import Product from "./Product";
import Service from "./Service";
import Category from "./Category";
import Subscription from "./Subscription";
import Staff from "./Staff";
import IMerchant from "interfaces/IMerchant";
import MerchantService from "services/MerchantService";
import StateService from "services/StateService";
import IState from "interfaces/IState";
import ModalButton from "components/ModalButton";
import dayjs from "dayjs";
import moment from "moment";
import Message from "components/Message";
import classNames from "classnames";

const BREAD_CRUMBS = [
    {
        name: "Merchant List",
        path: "/",
    },
    {
        name: "Merchant Profile",
    },
];

const MerchantProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    const [merchant, setMerchant] = useState<IMerchant>();
    const [loading, setLoading] = useState<boolean>(true);
    const [toggleState, setToggleState] = useState<string>("General");
    const [state, setState] = useState<IState[]>([]);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [isModalDelete, setIsModalDelete] = useState<boolean>(false);
    const [customAppointment, setCustomAppointment] = useState<any>([
        dayjs(new Date(year, month, 1)),
        dayjs(new Date(year, month + 1, 0)),
    ]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (localStorage.getItem("toggleState")) {
            const data: any = localStorage.getItem("toggleState");
            const oldToggleState = JSON.parse(data);
            oldToggleState && setToggleState(oldToggleState || "General");
        }
    }, []);

    useEffect(() => {
        const fetchData = async (id: string) => {
            try {
                const data = await MerchantService.getMerchantById(parseInt(id));
                const stateData = await StateService.get();
                setState(stateData);
                setMerchant(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                navigate("/");
            }
        };
        if (id && loading) fetchData(id);
    }, [id, loading, navigate]);

    const handleChange = () => {
        setLoading(true);
    };

    const handleChangeState = (key: string) => {
        localStorage.setItem("toggleState", JSON.stringify(key));
        setToggleState(key);
    };

    const TABS = [
        {
            key: "General",
            content: (merchant: IMerchant) => <General merchant={merchant} state={state} handleChange={handleChange} />,
        },
        {
            key: "Bank",
            content: (merchant: IMerchant) => (
                <Bank bank={merchant.businessBank} handleChange={handleChange} toggleState={toggleState} />
            ),
        },
        {
            key: "Principal",
            content: (merchant: IMerchant) => (
                <Principals
                    merchantId={merchant.merchantId}
                    principals={merchant.principals}
                    handleChange={handleChange}
                />
            ),
        },
        {
            key: "Subscription",
            content: (merchant: IMerchant) =>
                id && (
                    <Subscription merchantId={parseInt(id)} handleChangeState={(value) => handleChangeState(value)} />
                ),
        },
        {
            key: "Staff",
            content: (merchant: IMerchant) => id && <Staff merchantId={parseInt(id)} toggleState={toggleState} />,
        },
        {
            key: "Category",
            content: (merchant: IMerchant) => id && <Category merchantId={parseInt(id)} merchant={merchant} />,
        },
        {
            key: "Service",
            content: (merchant: IMerchant) => id && <Service merchantId={parseInt(id)} toggleState={toggleState} />,
        },
        {
            key: "Product",
            content: (merchant: IMerchant) => id && <Product merchantId={parseInt(id)} merchant={merchant} />,
        },
        {
            key: "Extra",
            content: (merchant: IMerchant) => id && <Extra merchantId={parseInt(id)} />,
        },
        {
            key: "Gift Card",
            content: (merchant: IMerchant) => id && <GiftCard merchantId={parseInt(id)} toggleState={toggleState} />,
        },
        {
            key: "Invoice",
            content: (merchant: IMerchant) => id && <Invoice merchantId={parseInt(id)} toggleState={toggleState} />,
        },
        {
            key: "Device",
            content: (merchant: IMerchant) => id && <Device merchantId={parseInt(id)} />,
        },
        {
            key: "Setting",
            content: (merchant: IMerchant) =>
                id && <Setting merchantId={parseInt(id)} merchant={merchant} handleChange={handleChange} />,
        },
        {
            key: "Activities",
            content: (merchant: IMerchant) => id && <Activities merchantId={parseInt(id)} />,
        },
    ];

    const isHideServiceTabs = (data: IMerchant, item: string) => {
        return data && data.type === "Retailer" && item === "Service";
    };

    const handleBack = () => {
        navigate("/");
    };

    const handleExport = async () => {
        try {
            setIsLoading(true);
            if (merchant) {
                const params = {
                    fromDate: moment(dayjs(customAppointment[0], "DD/MM/YYYY").toString()).format("L"),
                    toDate: moment(dayjs(customAppointment[1], "DD/MM/YYYY").toString()).format("L"),
                };
                const path = await MerchantService.exportSettlement(merchant?.merchantId, params);
                window.open(path);
            }
            setIsModal(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            if (merchant) {
                const message = await MerchantService.deleteMerchant(merchant?.merchantId);
                Message.success({ text: message });
                navigate("/");
            }
            setIsModal(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const afterClose = () => {
        setCustomAppointment([dayjs(new Date(year, month, 1)), dayjs(new Date(year, month + 1, 0))]);
    };

    const handleCloneMerchant = async () => {
        if (merchant) {
            try {
                setIsLoading(true);
                const message = await MerchantService.cloneMerchant(merchant?.merchantId);
                Message.success({ text: message });
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        }
    };

    return (
        <Page title="Merchant Detail">
            <Spin spinning={isLoading}>
                <Modal
                    centered={true}
                    width={400}
                    maskClosable={false}
                    destroyOnClose={true}
                    open={isModal}
                    title={<p className="font-bold text-lg">{"EXPORT SETTLEMENT"}</p>}
                    afterClose={afterClose}
                    onCancel={() => setIsModal(false)}
                    footer={
                        <div className="flex justify-end gap-x-2">
                            <ModalButton
                                title="Cancel"
                                type={"button"}
                                btnType="cancel"
                                onClick={() => setIsModal(false)}
                            />
                            <ModalButton
                                title="Save"
                                type={"submit"}
                                btnType="save"
                                onClick={handleExport}
                                loading={isLoading}
                            />
                        </div>
                    }
                >
                    <div className="mr-2 mb-1">
                        <p className="text-black font-medium mr-1">Date Range</p>
                        <DatePicker.RangePicker
                            defaultValue={[
                                dayjs(customAppointment[0], "DD/MM/YYYY"),
                                dayjs(customAppointment[1], "DD/MM/YYYY"),
                            ]}
                            onChange={(e) => {
                                if (e) {
                                    setCustomAppointment(e);
                                } else {
                                    setCustomAppointment([
                                        dayjs(new Date(year, month, 1)),
                                        dayjs(new Date(year, month + 1, 0)),
                                    ]);
                                }
                            }}
                            size="large"
                            className="w-[370px]"
                            format="MM/DD/YYYY"
                        />
                    </div>
                </Modal>
                <Modal
                    centered={true}
                    width={600}
                    maskClosable={false}
                    destroyOnClose={true}
                    open={isModalDelete}
                    title={<p className="font-bold text-lg">{"Delete Merchant?"}</p>}
                    onCancel={() => setIsModalDelete(false)}
                    footer={
                        <div className="flex justify-end gap-x-2">
                            <ModalButton
                                title="Cancel"
                                type={"button"}
                                btnType="cancel"
                                onClick={() => setIsModalDelete(false)}
                            />
                            <ModalButton
                                title="AGREE"
                                type={"submit"}
                                btnType="save"
                                onClick={handleDelete}
                                loading={isLoading}
                            />
                        </div>
                    }
                >
                    <p>
                        This Merchant will be remove from the app. You can not restore this Merchant, Are you sure you
                        want to do this?.
                    </p>
                </Modal>
                <Spin spinning={loading}>
                    <Breadcrumb title="Merchant Profile" breadcrumbs={BREAD_CRUMBS} />
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="mb-5 lg:flex justify-between items-center">
                            <span className="text-lg font-semibold text-black">ID : {id}</span>
                            <div
                                className={classNames("grid grid-cols-2 gap-3 lg:mb-0 mb-4", {
                                    "lg:grid-cols-3": merchant?.type !== "Retailer" || !merchant?.isWareHouse,
                                    "lg:grid-cols-4": merchant?.type === "Retailer" && merchant?.isWareHouse,
                                })}
                            >
                                {merchant?.type !== "Retailer" || !merchant?.isWareHouse ? null : (
                                    <Button btnType={"ok"} title={"Clone Merchant"} onClick={handleCloneMerchant} />
                                )}
                                <Button title="Delete" btnType="ok" onClick={() => setIsModalDelete(true)} />
                                <Button title="Export Settlement" btnType="ok" onClick={() => setIsModal(true)} />
                                <Button onClick={handleBack} title="Back" btnType="ok" />
                            </div>
                        </div>
                        <Tabs activeKey={toggleState} destroyInactiveTabPane onChange={handleChangeState}>
                            {merchant &&
                                TABS.map((item) => {
                                    return isHideServiceTabs(merchant, item.key) ? null : (
                                        <Tabs.TabPane tab={item?.key} key={item.key}>
                                            {merchant ? item?.content(merchant) : null}
                                        </Tabs.TabPane>
                                    );
                                })}
                        </Tabs>
                    </div>
                </Spin>
            </Spin>
        </Page>
    );
};

export default MerchantProfile;
