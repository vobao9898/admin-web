import classNames from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import { Collapse, Popover } from "antd";
import { MENUS } from "contants/menu";
import { useUser } from "hooks/useUser";
import { IGlobalUser } from "context/Reducer";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./index.css";

const Menu = ({ isCollapsed = false }) => {
    const { userGlobal } = useUser();

    const navigate = useNavigate();

    const location = useLocation();

    const isHasAccess = (user: IGlobalUser, roles?: string[]) => {
        if (!roles) return true;
        return user && user.userAdmin && user.userAdmin.roleName && roles.find((x) => x === user.userAdmin.roleName);
    };

    const handleNavigate = (path?: string) => {
        if (path) navigate(path);
    };

    return (
        <PerfectScrollbar className="menu relative h-[calc(100vh-5rem)]">
            <ul>
                {userGlobal &&
                    MENUS.map((item, index) => {
                        if (!item.child) {
                            if (!isHasAccess(userGlobal, item.roles)) {
                                return null;
                            }
                            return (
                                <li
                                    key={item.key}
                                    className={classNames("flex items-center h-11 m-3 px-2 cursor-pointer", {
                                        "bg-white text-blue-500 rounded-2xl": location.pathname === item.path,
                                        "text-cyan-blue": location.pathname !== item.path,
                                    })}
                                >
                                    <i
                                        className={classNames("text-3xl", item.icon)}
                                        onClick={() => handleNavigate(item.path)}
                                    />
                                    <span
                                        onClick={() => handleNavigate(item.path)}
                                        className={classNames(
                                            "ml-2.5 transition-all duration-300 ease-in-out font-bold text-sm leading-none",
                                            {
                                                "opacity-100": !isCollapsed,
                                                "opacity-0 text-[0] ml-0": isCollapsed,
                                                hidden: isCollapsed,
                                            }
                                        )}
                                    >
                                        {item.name}
                                    </span>
                                </li>
                            );
                        } else {
                            if (!isHasAccess(userGlobal, item.roles)) {
                                return null;
                            }
                            return isCollapsed ? (
                                <Popover
                                    placement="right"
                                    trigger={"hover"}
                                    content={
                                        <>
                                            {item.child.map((subItem, index) => (
                                                <li
                                                    key={subItem.key}
                                                    className="child-item py-2 cursor-pointer"
                                                    onClick={() => handleNavigate(subItem.path)}
                                                >
                                                    {subItem.name}
                                                </li>
                                            ))}
                                        </>
                                    }
                                >
                                    <li className="flex items-center justify-center h-11 m-3 px-2 cursor-pointer">
                                        <i className={classNames("text-3xl block text-cyan-blue", item.icon)} />
                                    </li>
                                </Popover>
                            ) : (
                                <li key={item.key} className="my-3">
                                    <Collapse
                                        accordion
                                        bordered={false}
                                        expandIconPosition="right"
                                        className="bg-blue-100"
                                    >
                                        <Collapse.Panel
                                            key={index}
                                            showArrow={!isCollapsed}
                                            header={
                                                <div
                                                    onClick={() => handleNavigate(item.path)}
                                                    className={classNames("flex items-center text-gray-500", {
                                                        "justify-center": isCollapsed,
                                                    })}
                                                >
                                                    <i
                                                        className={classNames("text-3xl block", item.icon, {
                                                            "ml-1": !isCollapsed,
                                                        })}
                                                    />
                                                    <span
                                                        className={classNames(
                                                            "pl-2.5 transition-all duration-300 ease-in-out font-bold",
                                                            {
                                                                "opacity-100": !isCollapsed,
                                                                "opacity-0 text-[0]": isCollapsed,
                                                            }
                                                        )}
                                                    >
                                                        {item.name}
                                                    </span>
                                                </div>
                                            }
                                        >
                                            <ul>
                                                {item.child.map((subItem, index) => (
                                                    <li
                                                        key={subItem.key}
                                                        onClick={() => handleNavigate(subItem.path)}
                                                        className="child-item py-2 cursor-pointer"
                                                    >
                                                        {subItem.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </Collapse.Panel>
                                    </Collapse>
                                </li>
                            );
                        }
                    })}
            </ul>
        </PerfectScrollbar>
    );
};
export default Menu;
