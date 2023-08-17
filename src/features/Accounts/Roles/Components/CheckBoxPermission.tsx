import { Checkbox } from "antd";
import IActions from "interfaces/IActions";
import React from "react";

interface IProps {
    item: IActions;
    onCheckPermission: (status: boolean, action: string, roleID: number) => void;
}

const CheckBoxPermission: React.FC<IProps> = ({ item, onCheckPermission }) => {
    return (
        <div className="grid grid-cols-12 px-2 py-2 border-b-[#f0f0f0] border-b-[1px]" key={item.actionId}>
            <div className="col-span-4 text-3.5 flex items-center">{item.name}</div>
            <div className="text-blue-500 font-extrabold text-lg col-span-2">
                <Checkbox
                    checked={item.adminstrator}
                    onChange={(e) => {
                        onCheckPermission(e.target.checked, item.action, 1);
                    }}
                />
            </div>
            <div className="text-blue-500 font-extrabold text-lg col-span-2">
                <Checkbox
                    checked={item.manager}
                    onChange={(e) => {
                        onCheckPermission(e.target.checked, item.action, 2);
                    }}
                />
            </div>
            <div className="text-blue-500 font-extrabold text-lg col-span-2">
                <Checkbox
                    checked={item.staff1}
                    onChange={(e) => {
                        onCheckPermission(e.target.checked, item.action, 3);
                    }}
                />
            </div>
            <div className="text-blue-500 font-extrabold text-lg col-span-2">
                <Checkbox
                    checked={item.staff2}
                    onChange={(e) => {
                        onCheckPermission(e.target.checked, item.action, 4);
                    }}
                />
            </div>
        </div>
    );
};

export default CheckBoxPermission;
