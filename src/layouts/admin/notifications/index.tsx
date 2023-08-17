import { Dropdown, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import avatar from "assets/images/avatar.jpeg";
import useUser from "hooks/useUser";
import INotification from "interfaces/INotification";
import moment from "moment";
import UserService from "services/UserService";
import DeleteIcon from "assets/svg/remove";
import Message from "components/Message";

const Notification = () => {
    const { userGlobal } = useUser();
    const [notifications, setNotifications] = useState<INotification[]>();
    const [page, setPage] = useState<number>(1);
    const [page_size] = useState<number>(10);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async (page: number, page_size: number) => {
            try {
                setLoading(true);
                const { data, count } = await UserService.getNotification(page, page_size);
                setNotifications(data);
                setCount(count);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchData(page, page_size);
    }, [userGlobal]);

    const handleClickNotification = async (notification: INotification) => {
        await UserService.deleteNotification(notification.waNotificationId);
        navigate("/request/pending-request/" + notification?.senderId);
    };

    const handleDelete = async (notification: INotification) => {
        try {
            setLoading(true);
            const message = await UserService.deleteNotification(notification?.waNotificationId);
            Message.success({ text: message });
            const newNot: any =
                notifications &&
                notifications?.filter((item) => item?.waNotificationId !== notification?.waNotificationId);
            if (newNot) {
                setNotifications(newNot);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const onScroll = async (event: any) => {
        const target = event.target;
        const sum = target.scrollHeight - target.scrollTop - target.offsetHeight;
        if (notifications && sum === -2 && notifications?.length + 1 < count && !loading) {
            try {
                setLoading(true);
                const { data, count } = await UserService.getNotification(page + 1, page_size);
                if (data.length > 0) {
                    setPage(page + 1);
                    const dataNotificationGlobals = notifications.concat(data);
                    setNotifications(dataNotificationGlobals);
                    setCount(count);
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        }
    };

    return (
        <Dropdown
            trigger={["hover", "click"]}
            overlay={
                <Spin spinning={loading}>
                    <div
                        className="w-[340px] h-[400px] overflow-y-scroll bg-white p-2 shadow-md border-black/10 border rounded-md"
                        onScroll={(e) => onScroll(e)}
                    >
                        <h4 className="font-semibold text-xl py-2 pl-2 border-b">Notifications</h4>
                        <ul>
                            {notifications &&
                                notifications?.map((item, index) => (
                                    <li className="border-b-2 py-2" key={index}>
                                        <div className="flex items-center p-2">
                                            <div className="min-w-[40px] min-h-[40px] max-w-[40px] max-h-40px] rounded-full overflow-hidden mr-4">
                                                <img className="w-full object-cover" src={avatar} alt="notification" />
                                            </div>
                                            <div
                                                className="cursor-pointer"
                                                onClick={() => handleClickNotification(item)}
                                            >
                                                <p className="font-medium text-xs mb-1">{item?.content}</p>
                                                <p className="text-xs">
                                                    {moment(item?.createdDate + "Z").format("MM-DD-YYYY hh:mm A")}
                                                </p>
                                            </div>
                                            <div
                                                className="w-fit ml-auto text-xl cursor-pointer"
                                                onClick={() => handleDelete(item)}
                                            >
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                    </li>
                                ))}
                        </ul>
                    </div>
                </Spin>
            }
            placement="bottomRight"
        >
            <div className="mr-5 relative flex group cursor-pointer">
                <div className="text-white rounded p-0.5 bg-blue-400 absolute -right-1.5 -top-1.5 leading-none text-center pt-1 text-xs group-hover:animate-bounce">
                    {count || 0}
                </div>
                <i className="las la-bell text-4xl text-gray-500" />
            </div>
        </Dropdown>
    );
};

export default Notification;
