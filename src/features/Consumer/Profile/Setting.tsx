import Button from "components/Button";
import Message from "components/Message";
import IConsumer from "interfaces/IConsumer";
import React, { useEffect, useState } from "react";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import ConsumerService from "services/ConsumerService";
interface IProps {
    consumer?: IConsumer;
    loadData: () => void;
}
const Setting: React.FC<IProps> = ({ consumer, loadData }) => {
    const [limitAmount, setLimitAmount] = useState<string>("");

    useEffect(() => {
        if (consumer) {
            setLimitAmount(consumer.limitAmount);
        }
    }, [consumer]);

    const handleSubmit = async () => {
        const params: Partial<IConsumer> = {
            ...consumer,
            limitAmount: limitAmount,
        };
        if (consumer) {
            try {
                const message = await ConsumerService.editUser(consumer?.userId, params);
                Message.success({ text: message });
                loadData();
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="p-4 bg-gray-50 shadow rounded-xl">
            <div className="font-bold text-lg mb-4 text-blue-500">Daily transactions limit</div>
            <div className="grid grid-cols-12 mb-4">
                <div className="col-span-12">
                    <div className="text-sm font-semibold mb-2">
                        The NailSoftPay system will aleat any user and prevent any use involved monetary transfer or
                        transfers that are :
                    </div>
                </div>
                <div className="text-sm mb-4 w-full col-span-12">
                    <ol className="list-decimal list-inside">
                        <li>More than $10000 in total from either cash-in orr cash-out</li>
                        <li>Is con ducted by the same person</li>
                        <li>Is conducted on the same bussiness day</li>
                    </ol>
                </div>
                <div className="col-span-6">
                    <label htmlFor="limitAmount" title="Limit">
                        Limit
                    </label>
                    <div className="relative flex items-center mt-1">
                        <div className="h-10 w-20 flex items-center justify-center text-gray-600 px-4 border border-r-0 rounded-l-lg bg-white border-gray-300">
                            $
                        </div>
                        <NumericFormat
                            id="limitAmount"
                            className="w-full text-right h-10 text-gray-600 px-4 border rounded-r-lg bg-white border-gray-300 focus:border-blue-500 focus:shadow focus:shadow-blue-500/30 focus:outline-0 placeholder:font-light placeholder:text-gray-300 max-w-[300px]"
                            value={limitAmount}
                            allowNegative={false}
                            onValueChange={(values: NumberFormatValues) => {
                                setLimitAmount(values.value);
                            }}
                            placeholder="0.00"
                            thousandSeparator=","
                            decimalScale={2}
                            fixedDecimalScale
                        />
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <Button title="Save" btnType="ok" moreClass="max-h-10" onClick={handleSubmit} />
            </div>
        </div>
    );
};

export default Setting;
