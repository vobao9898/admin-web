import { Checkbox, Input, Modal, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "components/Breadcrumb";
import Button from "components/Button/Button";
import ModalButton from "components/ModalButton/ModalButton";
import Message from "components/Message";
import IActions from "interfaces/IActions";
import IAdminUser from "interfaces/IAdminUser";
import IDepartment from "interfaces/IDepartment";
import IPermission from "interfaces/IPermission";
import IPermissionData from "interfaces/IPermissionData";
import Page from "components/Page";
import IValueDepartment from "interfaces/IValueDepartment";
import UserService from "services/UserService";
import CheckBoxPermission from "./Components/CheckBoxPermission";
import Department from "./Components/Department";
import Columns from "./Columns";

const BREAD_CRUMBS = [
    {
        name: "Accounts",
        path: "",
    },
    {
        name: "Roles",
        path: "/accounts/roles",
    },
];

const PAGE_SIZE_DEFAULT = 10;

const Roles = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [originPermission, setOriginPermission] = useState<IPermission[]>([]);
    const [data, set_data] = useState<IPermissionData>();
    const [name, setName] = useState<string>("");
    const [dataCheck, setDataCheck] = useState<IAdminUser[]>([]);
    const [editable, setEditable] = useState<boolean>(false);
    const [dataUser, setDataUser] = useState<IAdminUser[]>([]);
    const [dataEdit, setDataEdit] = useState<IDepartment>();
    const [dataDepartment, setDataDepartment] = useState<IDepartment[]>([]);
    const [param, setParam] = useState({ page: "1", row: "10", pages: 0 });
    const timeout = useRef<any>();
    const [page, setPage] = useState<number>(1);
    const [page_size, setPageSize] = useState<number>(PAGE_SIZE_DEFAULT);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModal, setIsModal] = useState<boolean>(false);
    const [isLoadingDepartment, setIsLoadingDepartment] = useState(false);

    const handleRestoreDepartment = async (data: number) => {
        const res: any = await UserService.editDepartmentRestore(data);
        if (res?.data) {
            Message.success({ text: res?.message });
            setLoading(true);
        } else {
            Message.error({ text: res?.message });
        }
    };

    const handleArchiveDepartment = async (data: number) => {
        const res: any = await UserService.editDepartmentArchive(data);
        if (res?.data) {
            Message.success({ text: res?.message });
            setLoading(true);
        } else {
            Message.error({ text: res?.message });
        }
    };

    const handleEdit = (data: IDepartment) => {
        setDataEdit(data);
        setDataCheck(data.members);
        toggleOpenModal();
        setName(data?.departmentName);
    };

    const loadData = async () => {
        try {
            const dataUserStep = await UserService.getUser(parseInt(param.page), parseInt(param.row));
            await setDataUser(dataUserStep.data);
            setParam({ ...param, pages: dataUserStep.pages });
        } catch (error) {}
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await UserService.getDepartment();
                setDataDepartment(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        if (loading) fetchData();
    }, [loading]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await UserService.getPermission();
                setOriginPermission(data);
                renderData(data);
                setIsLoading(false);
            } catch (error) {}
        };
        fetchData();
    }, []);

    const renderData = (data: IPermission[]) => {
        const fullActions: IActions[] = [];
        data.map((item, index) => {
            if (index !== 0) fullActions.push(...item.actions);
            return item;
        });

        data[0].actions.map((i: any) => {
            switch (i.waRoleId) {
                case 1:
                    i.adminstrator = i.roleIsActive;
                    break;
                case 2:
                    i.manager = i.roleIsActive;
                    break;

                case 3:
                    i.staff1 = i.roleIsActive;
                    break;

                case 4:
                    i.staff2 = i.roleIsActive;
                    break;
                default:
                    break;
            }

            fullActions.map((a1) => {
                if (i.action === a1.action) {
                    switch (a1.waRoleId) {
                        case 1:
                            i.adminstrator = a1.roleIsActive;
                            break;
                        case 2:
                            i.manager = a1.roleIsActive;
                            break;

                        case 3:
                            i.staff1 = a1.roleIsActive;
                            break;

                        case 4:
                            i.staff2 = a1.roleIsActive;
                            break;
                        default:
                            break;
                    }
                }
                return a1;
            });
            return i;
        });

        const final = data[0];

        const dashboard1: IActions[] = [];
        const requestManagement1: IActions[] = [];
        const merchant1: IActions[] = [];
        const consumer1: IActions[] = [];
        const giftCard1: IActions[] = [];
        const pricingPlan1: IActions[] = [];
        const account1: IActions[] = [];
        const report1: IActions[] = [];

        final.actions.map((i) => {
            switch (i.modulePage) {
                case "Dashboard":
                    dashboard1.push(i);
                    break;
                case "Request Management":
                    requestManagement1.push(i);
                    break;
                case "Merchant":
                    merchant1.push(i);
                    break;
                case "Consumer":
                    consumer1.push(i);
                    break;
                case "Gift Card":
                    giftCard1.push(i);
                    break;
                case "Pricing Plan":
                    pricingPlan1.push(i);
                    break;
                case "Accounts":
                    account1.push(i);
                    break;
                case "Reports":
                    report1.push(i);
                    break;
                default:
                    break;
            }
            return i;
        });
        const dataS: IPermissionData = {
            dashboard: dashboard1,
            requestManagement: requestManagement1,
            merchant: merchant1,
            consumer: consumer1,
            giftCard: giftCard1,
            pricingPlan: pricingPlan1,
            account: account1,
            report: report1,
        };

        set_data(dataS);
    };

    const onCheckPermission = (status: boolean, action: string, roleID: number) => {
        if (!editable) {
            const origin = originPermission;
            var dataOriginPermission: IPermission[] = [];
            origin.map((i) => {
                if (i.waRoleId === roleID) {
                    const data: any = i.actions.map((a) => {
                        var roleIsActive: boolean = a.roleIsActive;
                        if (a.action === action) {
                            roleIsActive = status;
                        }
                        return {
                            ...a,
                            roleIsActive,
                        };
                    });
                    dataOriginPermission.push({
                        ...i,
                        actions: data,
                    });
                    return {
                        ...i,
                        actions: data,
                    };
                }
                dataOriginPermission.push(i);
                return i;
            });
            renderData(dataOriginPermission);
            setOriginPermission(dataOriginPermission);
        }
        setEditable(true);
    };

    const HandleEditPermission = async () => {
        try {
            setIsLoading(true);
            const message = await UserService.putPermission(originPermission);
            Message.success({ text: message });
            const data = await UserService.getPermission();
            setOriginPermission(data);
            renderData(data);
            setEditable(false);
            setIsLoading(false);
        } catch (error) {}
    };

    const handlePageChange = (page: number) => {
        setPage(page);
        setLoading(true);
    };

    const handlePerPageChange = (perPage: number) => {
        setPageSize(perPage);
        setPage(1);
        setLoading(true);
    };

    const toggleOpenModal = () => {
        setIsModal(!isModal);
    };

    const handleModal = async () => {
        const dataStep: number[] = [];
        dataCheck.forEach((item) => dataStep.push(item.waUserId));
        const value: IValueDepartment = { departmentName: name, members: dataStep };
        setIsLoading(true);
        if (!name.trim()) {
            Message.error({ text: "Please enter department name!" });
            setIsLoading(false);
        } else if (dataCheck.length === 0) {
            Message.error({ text: "Please select a member!" });
            setIsLoading(false);
        } else {
            if (dataEdit && dataEdit?.departmentId) {
                try {
                    const message = await UserService.editDepartment(value, dataEdit?.departmentId);
                    Message.success({ text: message });
                    const dataDepartmentStep = await UserService.getDepartment();
                    await setDataDepartment(dataDepartmentStep);
                } catch (error) {}
            } else {
                try {
                    const message = await UserService.createDepartment(value);
                    Message.success({ text: message });
                    const dataDepartmentStep = await UserService.getDepartment();
                    await setDataDepartment(dataDepartmentStep);
                } catch (error) {}
            }
            toggleOpenModal();
            setIsLoading(false);
        }
    };

    const onChangeSearchMember = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timeout.current);
        timeout.current = setTimeout(async () => {
            const dataDepartmentStep = await UserService.getUser(1, 10, e.target.value, true);
            setDataUser(dataDepartmentStep.data);
        }, 1000);
    };

    const defaultChecked = (id: number) => {
        const dataStep = dataCheck.findIndex((item: any) => item.waUserId === id);
        if (dataStep !== -1) {
            return true;
        }
        return false;
    };

    const handleScroll = async (e: any) => {
        setIsLoadingDepartment(true);
        const element = e.currentTarget;
        const sum = element.scrollHeight - element.scrollTop - element.offsetHeight;
        if (sum < 1) {
            if (parseInt(param.page) + 1 <= param.pages) {
                const res: any = await UserService.getUser(parseInt(param.page) + 1, parseInt(param.row));
                const data = dataUser.concat(res.data);
                await setDataUser(data);
                await setParam({ ...param, page: (parseInt(param.page) + 1).toString(), pages: res.pages });
                await reRender();
            }
        }
        await setIsLoadingDepartment(false);
    };

    const onChange = (item: IAdminUser) => {
        const dataStep = dataCheck;
        const indexCheck = dataCheck.findIndex((items) => items.waUserId === item.waUserId);
        if (indexCheck === -1) {
            dataStep.push(item);
            setDataCheck([...dataStep]);
        } else {
            const dataSteps = dataStep.filter((items) => items.waUserId !== item.waUserId);
            setDataCheck(dataSteps);
        }
    };

    const deleteMembers = (id: number) => {
        const dataStep = dataCheck.filter((item) => item.waUserId !== id);
        setDataCheck(dataStep);
    };

    const reRender = () => {
        return (
            <>
                <Input
                    className="mb-1 text-gray-600 bg-white px-4 ant-input border rounded-xl h-10 w-[300px]"
                    placeholder="Enter department name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <div className="font-bold text-lg mb-1 text-blue-700">Members</div>
                <div className="grid grid-cols-4">
                    <div className="col-span-2 border-[1px] border-l-[0px]">
                        <Input
                            className="my-1 h-10 w-[300px] text-gray-600 bg-white px-4 ant-input border rounded-xl"
                            placeholder="Search Member"
                            onChange={onChangeSearchMember}
                        />
                    </div>
                    <div className="col-span-2 mb-2 h-full w-full border-b-[1px] border-t-[1px]">
                        <div className="ml-2 h-full">
                            <div className="grid grid-flow-col h-full">
                                <div className="col-span-6 flex h-full ">
                                    <div className="font-bold text-base mb-1 flex items-center">Selected</div>
                                </div>
                                <div className="col-span-6 flex justify-end mr-12 items-center">{dataCheck.length}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4">
                    <div
                        className="col-span-2 overflow-scroll border-[1px] border-l-[0px]"
                        style={{ height: "300px" }}
                        onScroll={handleScroll}
                    >
                        <div className="mt-2 ml-2">
                            <Spin spinning={isLoadingDepartment}>
                                {dataUser &&
                                    dataUser.map((item, index) => {
                                        return (
                                            <div key={item?.id}>
                                                <div className="grid grid-flow-col mb-3">
                                                    <div className="col-span-6 flex">
                                                        <img
                                                            className="rounded-full object-cover h-8 w-8"
                                                            src={item?.imageUrl}
                                                            alt=""
                                                        ></img>
                                                        <div className="ml-2 text-lg flex items-center">{`${item?.firstName} ${item?.lastName}`}</div>
                                                    </div>
                                                    <div className="col-span-6 flex justify-end mr-4">
                                                        <Checkbox
                                                            checked={defaultChecked(item.waUserId)}
                                                            onChange={() => onChange(item)}
                                                        ></Checkbox>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </Spin>
                        </div>
                    </div>
                    <div
                        className="col-span-2 overflow-y-scroll border-[1px] border-r-[0px]"
                        style={{ height: "300px" }}
                    >
                        <div className="mt-2 ml-2">
                            {dataCheck &&
                                dataCheck.map((item: any, index) => {
                                    return (
                                        <div key={item?.id + "dataCheck"}>
                                            <div className="grid grid-flow-col mb-3">
                                                <div className="col-span-6 flex">
                                                    <img
                                                        className="rounded-full object-cover object-center h-8 w-8"
                                                        src={item?.imageUrl}
                                                        alt=""
                                                    ></img>
                                                    <div className="ml-2 text-lg flex items-center">{`${item?.firstName} ${item?.lastName}`}</div>
                                                </div>
                                                <div className="col-span-6 flex justify-end mr-4 items-center cursor-pointer">
                                                    <i
                                                        className="las la-times-circle"
                                                        style={{ fontSize: "20px" }}
                                                        onClick={() => {
                                                            deleteMembers(item?.waUserId);
                                                        }}
                                                    ></i>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const handleAfterClose = async () => {
        try {
            setDataEdit(undefined);
            setDataCheck([]);
            setName("");
            const dataUserStep = await UserService.getUser(1, 10);
            await setDataUser(dataUserStep.data);
        } catch (error) {}
    };

    return (
        <Page title="Roles">
            <div className="pb-10">
                <Breadcrumb title="Roles" breadcrumbs={BREAD_CRUMBS} />
                <Modal
                    afterClose={() => handleAfterClose()}
                    centered={true}
                    maskClosable={false}
                    destroyOnClose={true}
                    open={isModal}
                    title={<p className="font-bold text-lg">Add</p>}
                    onCancel={toggleOpenModal}
                    width={900}
                    footer={
                        <div className="flex justify-end gap-x-2">
                            <ModalButton title="Cancel" type={"button"} btnType="cancel" onClick={toggleOpenModal} />
                            <ModalButton title="Save" type={"button"} btnType="save" onClick={handleModal} />
                        </div>
                    }
                >
                    {reRender()}
                </Modal>
                <Department
                    loading={loading}
                    dataDepartment={dataDepartment}
                    columns={Columns({ handleArchiveDepartment, handleEdit, handleRestoreDepartment })}
                    page={page}
                    page_size={page_size}
                    handlePageChange={handlePageChange}
                    handlePerPageChange={handlePerPageChange}
                    toggleOpenModal={toggleOpenModal}
                ></Department>
                <Spin spinning={isLoading}>
                    <div className="p-4 rounded-lg shadow bg-gray-50 col-span-2 row-span-2 grid">
                        <div className="grid grid-cols-12">
                            <h3 className="col-span-4">{""}</h3>
                            <h3 className="text-blue-500 font-extrabold text-lg col-span-2">Administrator</h3>
                            <h3 className="text-blue-500 font-extrabold text-lg col-span-2">Manager</h3>
                            <h3 className="text-blue-500 font-extrabold text-lg col-span-2">Staff Level 1</h3>
                            <h3 className="text-blue-500 font-extrabold text-lg col-span-2">Staff Level 2</h3>
                        </div>
                        <h1 className="text-lg">
                            <strong>Dashboard</strong>
                        </h1>
                        {data?.dashboard && (
                            <div className="bg-white mt-2.5">
                                {data?.dashboard.map((item) => {
                                    return (
                                        <CheckBoxPermission
                                            item={item}
                                            onCheckPermission={onCheckPermission}
                                        ></CheckBoxPermission>
                                    );
                                })}
                            </div>
                        )}

                        <h1 className="text-lg mt-6">
                            <strong>Request Management</strong>
                        </h1>
                        {data?.requestManagement && (
                            <div className="bg-white mt-2.5">
                                {data?.requestManagement.map((item) => {
                                    return (
                                        <CheckBoxPermission
                                            item={item}
                                            onCheckPermission={onCheckPermission}
                                        ></CheckBoxPermission>
                                    );
                                })}
                            </div>
                        )}

                        <h1 className="text-lg mt-6">
                            <strong>Merchant</strong>
                        </h1>
                        {data?.merchant && (
                            <div className="bg-white mt-2.5">
                                {data?.merchant.map((item) => {
                                    return (
                                        <CheckBoxPermission
                                            item={item}
                                            onCheckPermission={onCheckPermission}
                                        ></CheckBoxPermission>
                                    );
                                })}
                            </div>
                        )}
                        <h1 className="text-lg mt-6">
                            <strong>Consumer</strong>
                        </h1>
                        {data?.consumer && (
                            <div className="bg-white mt-2.5">
                                {data?.consumer.map((item) => {
                                    return (
                                        <CheckBoxPermission
                                            item={item}
                                            onCheckPermission={onCheckPermission}
                                        ></CheckBoxPermission>
                                    );
                                })}
                            </div>
                        )}

                        <h1 className="text-lg mt-6">
                            <strong>Gift Card</strong>
                        </h1>
                        {data?.giftCard && (
                            <div className="bg-white mt-2.5">
                                {data?.giftCard.map((item) => {
                                    return (
                                        <CheckBoxPermission
                                            item={item}
                                            onCheckPermission={onCheckPermission}
                                        ></CheckBoxPermission>
                                    );
                                })}
                            </div>
                        )}

                        <h1 className="text-lg mt-6">
                            <strong>Pricing Plan</strong>
                        </h1>
                        {data?.pricingPlan && (
                            <div className="bg-white mt-2.5">
                                {data?.pricingPlan.map((item) => {
                                    return (
                                        <CheckBoxPermission
                                            item={item}
                                            onCheckPermission={onCheckPermission}
                                        ></CheckBoxPermission>
                                    );
                                })}
                            </div>
                        )}

                        <h1 className="text-lg mt-6">
                            <strong>Account</strong>
                        </h1>
                        {data?.account && (
                            <div className="bg-white mt-2.5">
                                {data?.account.map((item) => {
                                    return (
                                        <CheckBoxPermission
                                            item={item}
                                            onCheckPermission={onCheckPermission}
                                        ></CheckBoxPermission>
                                    );
                                })}
                            </div>
                        )}

                        <h1 className="text-lg mt-6">
                            <strong>Report</strong>
                        </h1>
                        {data?.report && (
                            <div className="bg-white mt-2.5">
                                {data?.report.map((item) => {
                                    return (
                                        <CheckBoxPermission
                                            item={item}
                                            onCheckPermission={onCheckPermission}
                                        ></CheckBoxPermission>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <Button
                        title="Save"
                        onClick={HandleEditPermission}
                        btnType="ok"
                        moreClass="mt-5"
                        disabled={!editable}
                    />
                </Spin>
            </div>
        </Page>
    );
};

export default Roles;
