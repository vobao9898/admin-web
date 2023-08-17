import { Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCodeAndPhoneNumber } from "utils";
import PrincipalService from "services/PrincipalService";
import StateService from "services/StateService";
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import Button from "components/Button";
import Page from "components/Page";
import IPrincipal from "interfaces/IPrincipal";
import IState from "interfaces/IState";
import Information from "./Information/Information";
import Logs from "./Logs";
import Merchants from "./Merchant";

const BREAD_CRUMBS = [
    {
        name: "Principal List",
        path: "/principal",
    },
    {
        name: "Principal Detail",
        path: "",
    },
];

const PrincipalDetail = () => {
    const { principalId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingExport, setLoadingExport] = useState<boolean>(false);

    const [principal, setPrincipal] = useState<IPrincipal>();
    const [state, setState] = useState<IState[]>([]);
    const [toggleState, setToggleState] = useState<string>("information");

    useEffect(() => {
        const fetchData = async (principalId: string) => {
            try {
                const data = await PrincipalService.getById(parseInt(principalId));
                const dataState = await StateService.get();

                const [codeHomePhone, homePhone] = getCodeAndPhoneNumber(data.homePhone);
                const [codeMobilePhone, mobilePhone] = getCodeAndPhoneNumber(data.mobilePhone);

                const principal: IPrincipal = {
                    ...data,
                    homePhone: homePhone,
                    codeHomePhone: codeHomePhone,
                    mobilePhone: mobilePhone,
                    codeMobilePhone: codeMobilePhone,
                };

                setState(dataState);
                setPrincipal(principal);
                setLoading(false);

                if (!data) {
                    navigate("/principal");
                    return;
                }
            } catch (error) {
                setLoading(false);
            }
        };
        if (principalId && loading) {
            fetchData(principalId);
        }
    }, [principalId, loading, navigate]);

    const renderFullName = (principal: IPrincipal) => {
        return `${principal.firstName} ${principal.lastName}`;
    };

    const handleExportPrincipal = async () => {
        if (principalId) {
            try {
                setLoadingExport(true);
                const linkExport = await PrincipalService.exportPrincipalById(parseInt(principalId));
                window.open(linkExport, "_blank");
                setLoadingExport(false);
            } catch (error) {
                setLoadingExport(false);
            }
        }
    };

    const handleChangeState = (key: string) => {
        localStorage.setItem("toggleState", JSON.stringify(key));
        setToggleState(key);
    };

    const handleChange = async () => {
        setLoading(true);
    };

    const objDetail = [
        {
            key: "information",
            title: <p>Information</p>,
            content: principalId && principal && (
                <Information id={principalId} principal={principal} state={state} handleChange={handleChange} />
            ),
        },
        {
            key: "merchants",
            title: <p>Merchants</p>,
            content: principalId && principal && <Merchants id={principalId} />,
        },
        {
            key: "log",
            title: <p>Logs</p>,
            content: principal?.arrayOldData && <Logs logs={principal?.arrayOldData} />,
        },
    ];

    return (
        <Page title="Principal Detail">
            <Spin spinning={loading || loadingExport}>
                <Breadcrumb title="Principal Profile" breadcrumbs={BREAD_CRUMBS} />
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="mb-5 lg:flex justify-between items-center">
                        <span className="text-lg font-bold text-black block lg:mb-0 mb-4">
                            {principal && renderFullName(principal)}
                        </span>
                        <div className={"grid lg:grid-cols-2 gap-3 lg:mb-0 mb-4"}>
                            <Button btnType="ok" title="Export Principal" onClick={handleExportPrincipal} />
                            <Button btnType="ok" title="Back" onClick={() => navigate("/principal")} />
                        </div>
                    </div>
                    <Tabs activeKey={toggleState} onChange={handleChangeState}>
                        {objDetail.map((item) => (
                            <Tabs.TabPane tab={item?.title} key={item?.key}>
                                {item?.content}
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                </div>
            </Spin>
        </Page>
    );
};

export default PrincipalDetail;
