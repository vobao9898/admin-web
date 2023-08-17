import { Spin } from "antd";
import { useEffect, useState } from "react";
import { IPrincipalInfo } from "./ICreateMerchant";
import { IPackage } from "./Package";
import { IPrincipal } from "./Principal";
import { IStep } from "components/Wizard";
import { BankInfo, BusinessInfo, GeneralInfo } from "dtos/ICreateMerchant";
import { useNavigate } from "react-router-dom";
import ICreateMerchant from "./ICreateMerchant";
import Package from "./Package";
import Principal from "./Principal";
import Wizard from "components/Wizard";
import IPricingPlan from "interfaces/IPricingPlan";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button";
import Page from "components/Page";
import IState from "interfaces/IState";
import MerchantService from "services/MerchantService";
import PricingPlanService from "services/PricingPlanService";
import StateService from "services/StateService";
import Bank from "./Bank";
import Business from "./Business";
import General from "./General";
import moment from "moment";
import Message from "components/Message/Message";

const BREAD_CRUMBS = [
    {
        name: "Merchant List",
        path: "/",
    },
    {
        name: "Add Merchant",
        path: "/merchant/add",
    },
];

export const DEFAUL_PRINCIPAL: IPrincipal = {
    principalId: 0,
    firstName: "",
    lastName: "",
    title: "",
    ownerShip: "",
    codeHomePhone: 1,
    homePhone: "",
    codeMobilePhone: 1,
    mobilePhone: "",
    email: "",
    address: "",
    city: "",
    state: undefined as unknown as number,
    zip: "",
    yearAtThisAddress: "",
    ssn: "",
    birthDate: new Date(),
    driverNumber: "",
    stateIssued: undefined as unknown as number,
    fileUrl: "",
    fileId: undefined as unknown as number,
};

const MerchantCreate = () => {
    const navigate = useNavigate();
    const [current, setCurrent] = useState(0);
    const [state, setState] = useState<IState[]>([]);
    const [packages, setPackages] = useState<IPricingPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [general, setGeneral] = useState<GeneralInfo>();
    const [business, setBusiness] = useState<BusinessInfo>();
    const [bank, setBank] = useState<BankInfo>();
    const [principals, setPrincipals] = useState<IPrincipal[]>([DEFAUL_PRINCIPAL]);
    const [packageData, setPackageData] = useState<IPackage>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [stateResp, packageResp] = await Promise.all([StateService.get(), PricingPlanService.get()]);
                setState(stateResp);
                setPackages(packageResp?.data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) {
            fetchData();
        }
    }, [loading]);

    const handlePrev = () => {
        setCurrent(current - 1);
    };

    const formatDataPrincipals = (principals: IPrincipal[]) => {
        const newPrincipals: IPrincipalInfo[] = principals.map((item) => {
            const homPhone = `${item.codeHomePhone} ${item.homePhone}`;
            const mobilePhone = `${item.codeMobilePhone} ${item.mobilePhone}`;

            return {
                principalId: item.principalId,
                firstName: item.firstName,
                lastName: item.lastName,
                position: item.title,
                ownerShip: parseInt(item.ownerShip),
                homePhone: homPhone.replace(/[^\d]/g, ""),
                mobilePhone: mobilePhone.replace(/[^\d]/g, ""),
                yearAtThisAddress: item.yearAtThisAddress,
                ssn: item.ssn,
                dateOfBirth: moment(item?.birthDate).format("MM/DD/YYYY"),
                driverLicense: item.driverNumber,
                stateIssued: item.stateIssued,
                fileId: item.fileId,
                email: item.email,
                address: item.address,
                city: item.city,
                zip: item.zip,
                title: item.title,
                driverNumber: item.driverNumber,
                stateId: item.state,
                yearAddress: item.yearAtThisAddress,
            };
        });

        return newPrincipals;
    };

    const formatDataGeneral = (general: GeneralInfo) => {
        const businessPhone = `${general.businessCodePhone} ${general.businessPhoneNumber}`;
        const contactPhone = `${general.contactCodePhone} ${general.contactPhoneNumber}`;
        const data = {
            businessName: general.businessName,
            doingBusiness: general.doingBusiness,
            tax: general.tax,
            email: general.email,
            businessPhone: businessPhone.replace(/[^\d]/g, ""),
            contactPhone: contactPhone.replace(/[^\d]/g, ""),
            firstName: general.firstName,
            lastName: general.lastName,
            position: general.position,
            dbaAddress: {
                address: general.dbaAddress.address,
                city: general.dbaAddress.city,
                state: general.dbaAddress.state,
                zip: general.dbaAddress.zip,
            },
            businessAddress: {
                address: general.businessAddress.address,
                city: general.businessAddress.city,
                state: general.businessAddress.state,
                zip: general.businessAddress.zip,
            },
        };
        return data;
    };

    const formatDataBank = (bank: BankInfo) => {
        return {
            accountHolderName: bank.accountHolderName,
            routingNumber: parseInt(bank.routingNumber),
            accountNumber: parseInt(bank.accountNumber),
            bankName: bank.bankName,
            fileId: bank.fileId,
        };
    };

    const formatDataBusiness = (business: BusinessInfo) => {
        return {
            question1: {
                isAccept: business.question1.isAccept,
                desc: business.question1.desc,
                question: business.question1.question,
            },
            question2: {
                isAccept: business.question2.isAccept,
                desc: business.question2.desc,
                question: business.question2.question,
            },
            question3: {
                isAccept: business.question3.isAccept,
                desc: business.question3.desc,
                question: business.question3.question,
            },
            question4: {
                isAccept: business.question4.isAccept,
                desc: business.question4.desc,
                question: business.question4.question,
            },
            question5: {
                isAccept: business.question5.isAccept,
                desc: business.question5.desc,
                question: business.question5.question,
            },
        };
    };

    const handleSubmitStep = (data: any) => {
        if (current === 0) {
            setCurrent(1);
            setGeneral(data);
        } else if (current === 1) {
            setCurrent(2);
            setBusiness(data);
        } else if (current === 2) {
            setCurrent(3);
            setBank(data);
        } else if (current === 3) {
            setCurrent(4);
            setPrincipals(data);
        } else if (current === 4) {
            setCurrent(3);
            setPackageData(data);
        }
    };

    const onSubmit = async (data: IPackage) => {
        if (general && business && bank && principals && data) {
            const newPrincipals = formatDataPrincipals(principals);
            const newGeneral = formatDataGeneral(general);
            const newBank = formatDataBank(bank);
            const newBusiness = formatDataBusiness(business);

            const payload: ICreateMerchant = {
                generalInfo: newGeneral,
                bankInfo: newBank,
                businessInfo: newBusiness,
                principalInfo: newPrincipals,
                packagePricing: data.packageId,
                packageId: data.packageId,
                type: general.type,
                mid: "",
                notes: "",
                terminalInfo: "",
                pricingType: "",
                additionStaff: data.additionStaff ? parseInt(data.additionStaff) : 0, //TODO Check code cũ
                price: 0,
                currentRate: {
                    discountRate: 0,
                    transactionsFee: 0,
                },
            };

            try {
                setIsCreating(true);
                const message = await MerchantService.create(payload);
                setIsCreating(false);
                Message.success({ text: message });
                navigate("/");
            } catch (error: any) {
                setIsCreating(false);
            }
        }
    };

    const steps: IStep[] = [
        {
            title: "General Information",
            content: <General general={general} state={state} onSubmitGeneral={handleSubmitStep} />,
        },
        {
            title: "Business Information",
            content: <Business business={business} onSubmitBusiness={handleSubmitStep} />,
        },
        {
            title: "Bank Information",
            content: <Bank bank={bank} onSubmitBank={handleSubmitStep} />,
        },
        {
            title: "Principal Information",
            content: <Principal principals={principals} state={state} onSubmitPrincipals={handleSubmitStep} />,
        },
        {
            title: "Pricing Plan",
            content: (
                <Package
                    packages={packages}
                    packageData={packageData}
                    onPreviousPackage={handleSubmitStep}
                    onSubmitPackage={onSubmit}
                />
            ),
        },
    ];

    return (
        <Page title="Add Merchant">
            <Spin spinning={loading || isCreating}>
                <Breadcrumb title={"Merchant List"} breadcrumbs={BREAD_CRUMBS} />
                <div className="mb-4 text-lg w-full rounded-xl px-4 py-3 bg-white shadow-md">
                    <div className={`w-full flex flex-wrap items-center demo my-5 text-white`}>
                        <Wizard steps={steps} current={current} />
                    </div>
                    <div className="relative px-4">
                        {steps[current].content}
                        <div className="absolute right-4 bottom-0">
                            <>
                                {current > 0 && current !== 4 && <Button title="Previous" onClick={handlePrev} />}
                                {current !== 4 && <Button title="Cancel" btnType="cancel" moreClass="ml-2" />}
                            </>
                        </div>
                    </div>
                </div>
            </Spin>
        </Page>
    );
};

export default MerchantCreate;
