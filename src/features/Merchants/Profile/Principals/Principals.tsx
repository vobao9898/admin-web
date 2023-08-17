import IPrincipal from "interfaces/IPrincipal";
import PrincipalDetail from "./PrincipalDetail";
import CreatePrincipal from "./CreatePrincipal";
import Button from "components/Button";
import React, { useState, useEffect } from "react";
import IState from "interfaces/IState";
import StateService from "services/StateService";

interface IProps {
    merchantId: number;
    principals: IPrincipal[];
    handleChange: () => void;
}

const Principals: React.FC<IProps> = ({ merchantId, principals, handleChange }) => {
    const [currentPrincipal, setCurrentPrincipal] = useState<IPrincipal>();
    const [open, setOpen] = useState<boolean>(false);
    const [state, setState] = useState<IState[]>([]);

    useEffect(() => {
        const fetchState = async () => {
            try {
                const data = await StateService.get();
                setState(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchState();
    }, []);

    const toggleShowDetail = (data?: IPrincipal) => {
        setCurrentPrincipal(data);
    };

    const renderPricipals = (principals: IPrincipal[]) => {
        return principals.map((item, index) => (
            <div
                key={item.principalId}
                onClick={() => toggleShowDetail(item)}
                className="w-full rounded-xl px-3 py-2 shadow-sm bg-white mb-3 cursor-pointer"
            >
                {`Principal ${index + 1}`}: {`${item?.firstName} ${item?.lastName}`}
            </div>
        ));
    };

    const toggleOpenModal = () => {
        setOpen((preVal) => !preVal);
    };

    const handleSuccess = () => {
        setOpen(false);
        handleChange();
    };

    const handleSuccessDetail = () => {
        setCurrentPrincipal(undefined);
        handleChange();
    };

    return (
        <>
            {open ? (
                <CreatePrincipal
                    merchantId={merchantId}
                    principals={principals}
                    state={state}
                    onClose={toggleOpenModal}
                    onSuccess={handleSuccess}
                />
            ) : null}
            <div>
                {currentPrincipal ? (
                    <PrincipalDetail
                        merchantId={merchantId}
                        principal={currentPrincipal}
                        onBack={toggleShowDetail}
                        onSuccess={handleSuccessDetail}
                    />
                ) : (
                    <div>
                        {renderPricipals(principals)}
                        <Button onClick={toggleOpenModal} btnType="ok" title="Add principal" />
                    </div>
                )}
            </div>
        </>
    );
};

export default Principals;
