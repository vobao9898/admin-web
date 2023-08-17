import React from "react";
import { useNavigate } from "react-router-dom";

interface IBreadCrumb {
    path?: string;
    name: string;
}

interface IProps {
    title: string;
    breadcrumbs: IBreadCrumb[];
}

const Breadcrumb: React.FC<IProps> = ({ title = "", breadcrumbs = [] }) => {
    const navigate = useNavigate();

    const handleClick = (path?: string) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <div className="mb-5 p-4 shadow rounded-xl bg-gray-50 flex items-center justify-between">
            <h2 className="text-black text-2xl font-bold">{title}</h2>
            <div className="flex items-center">
                <p className="cursor-pointer text-md font-bold text-black">App</p>
                {breadcrumbs?.map((item, index) => {
                    return (
                        <div key={index} className="flex items-center">
                            <i className="las la-angle-right px-1"></i>
                            <p
                                className={`cursor-pointer text-md font-bold ${
                                    index === breadcrumbs?.length - 1 ? "text-blue-500" : "text-black"
                                }`}
                                onClick={() => {
                                    handleClick(item.path);
                                }}
                            >
                                {item.name}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Breadcrumb;
