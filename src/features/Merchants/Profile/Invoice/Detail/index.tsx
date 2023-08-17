import { Popconfirm } from "antd";
import Button from "components/Button";
import IInvoice from "interfaces/IInvoice";
import moment from "moment";

interface IProps {
    dataDetail: IInvoice;
    onRefundInvoice: (value: IInvoice) => void;
    onBack: () => void;
}

const Detail: React.FC<IProps> = ({ dataDetail, onRefundInvoice, onBack }) => {
    return (
        <div>
            <div className="grid grid-cols-2 gap-3">
                <strong className="text-lg mb-5">Invoice #{dataDetail?.code}</strong>
                <div className="justify-self-end">
                    {dataDetail?.status === "paid" && (
                        <Popconfirm
                            placement="left"
                            title={
                                <div>
                                    <strong>Refund Confirmation</strong>
                                    <div>Are you sure you want to refund this invoice?</div>
                                </div>
                            }
                            icon={
                                <i className="las la-question-circle text-2xl text-yellow-500 absolute -top-0.5 -left-1" />
                            }
                            onConfirm={() => onRefundInvoice(dataDetail)}
                            okText={"Ok"}
                            cancelText={"Cancel"}
                        >
                            <Button title="REFUND" btnType="ok" moreClass="mr-5" />
                        </Popconfirm>
                    )}
                    <Button title="BACK" btnType="cancel" onClick={onBack} moreClass="mr-5" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <h1>
                        <strong className="text-base">Invoice Details</strong>
                    </h1>
                    <div className="p-5 rounded-lg bg-gray-50	mt-2">
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Invoice ID</p>
                            <p className="w-2/5">
                                <strong>#{dataDetail?.code}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Date</p>
                            <p className="w-2/5">
                                <strong>{moment(dataDetail?.createdDate).format("MM/DD/YYYY")}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Time</p>
                            <p className="w-2/5">
                                <strong>{moment(dataDetail?.createdDate).format("hh:mm A")}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Customer</p>
                            <p className="w-2/5">
                                <strong>{dataDetail?.user?.firstName + " " + dataDetail?.user?.lastName}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Phone</p>
                            <p className="w-2/5">
                                <strong>{dataDetail?.user?.phone}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Status</p>
                            <p className="w-2/5">
                                <strong>{dataDetail?.status}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Payment method</p>
                            <p className="w-2/5">
                                <strong>{dataDetail?.paymentMethod}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Total amount</p>
                            <p className="w-2/5">
                                <strong>${dataDetail?.total}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Created by</p>
                            <p className="w-2/5">
                                <strong>{dataDetail?.createdBy}</strong>
                            </p>
                        </div>
                        <div className="flex items-center py-2">
                            <p className="w-3/5">Modified by</p>
                            <p className="w-2/5">
                                <strong>{dataDetail?.modifiedBy}</strong>
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h1>
                        <strong className="text-base">Basket</strong>
                    </h1>
                    <div className="p-5 rounded-lg bg-gray-50	mt-2">
                        <div className="flex flex-row border-b mt-2 p-2">
                            <div className="basis-1/3">
                                <strong>Description</strong>
                            </div>
                            <div className="basis-1/6">
                                <strong>Price</strong>
                            </div>
                            <div className="basis-1/3">
                                <strong>Qty</strong>
                            </div>
                            <div className="basis-1/6">
                                <strong>Total</strong>
                            </div>
                        </div>

                        {dataDetail?.basket?.extras &&
                            dataDetail?.basket?.extras.map((item, index) => (
                                <div key={index} className="flex flex-row border-b mt-2 p-2">
                                    <div className="basis-1/3">
                                        <strong>{item?.extraName}</strong>
                                    </div>
                                    <div className="basis-1/6">
                                        <strong>${item?.price}</strong>
                                    </div>
                                    <div className="basis-1/3">
                                        <strong>{item?.quantity ? item?.quantity : "1"}</strong>
                                    </div>
                                    <div className="basis-1/6">
                                        <strong>
                                            {item?.quantity
                                                ? (parseFloat(item?.price) * item?.quantity).toLocaleString("en-US", {
                                                      style: "currency",
                                                      currency: "USD",
                                                  })
                                                : "$" + item?.price}
                                        </strong>
                                    </div>
                                </div>
                            ))}

                        {dataDetail?.basket?.giftCards &&
                            dataDetail?.basket?.giftCards.map((item: any, index) => (
                                <div key={index} className="flex flex-row border-b mt-2 p-2">
                                    <div className="basis-1/3">
                                        <strong>{item?.name}</strong>
                                    </div>
                                    <div className="basis-1/6">
                                        <strong>${item?.price}</strong>
                                    </div>
                                    <div className="basis-1/3">
                                        <strong>{item?.quantity ? item?.quantity : "1"}</strong>
                                    </div>
                                    <div className="basis-1/6">
                                        <strong>
                                            {item?.quantity
                                                ? (item?.price * item?.quantity).toLocaleString("en-US", {
                                                      style: "currency",
                                                      currency: "USD",
                                                  })
                                                : "$" + item?.price}
                                        </strong>
                                    </div>
                                </div>
                            ))}

                        {dataDetail?.basket?.products &&
                            dataDetail?.basket?.products.map((item: any, index) => (
                                <div key={index} className="flex flex-row border-b mt-2 p-2">
                                    <div className="basis-1/3">
                                        <strong>{item?.productName}</strong>
                                    </div>
                                    <div className="basis-1/6">
                                        <strong>${item?.price}</strong>
                                    </div>
                                    <div className="basis-1/3">
                                        <strong>{item?.quantity ? item?.quantity : "1"}</strong>
                                    </div>
                                    <div className="basis-1/6">
                                        <strong>
                                            {item?.quantity
                                                ? (item?.price * item?.quantity).toLocaleString("en-US", {
                                                      style: "currency",
                                                      currency: "USD",
                                                  })
                                                : "$" + item?.price}
                                        </strong>
                                    </div>
                                </div>
                            ))}

                        {dataDetail?.basket?.services &&
                            dataDetail?.basket?.services.map((item: any, index) => (
                                <div key={index} className="flex flex-row border-b mt-2 p-2">
                                    <div className="basis-1/3">
                                        <strong>{item?.serviceName}</strong>
                                    </div>
                                    <div className="basis-1/6">
                                        <strong>${item?.price}</strong>
                                    </div>
                                    <div className="basis-1/3">
                                        <strong>{item?.quantity ? item?.quantity : "1"}</strong>
                                    </div>
                                    <div className="basis-1/6">
                                        <strong>
                                            {item?.quantity
                                                ? (item?.price * item?.quantity).toLocaleString("en-US", {
                                                      style: "currency",
                                                      currency: "USD",
                                                  })
                                                : "$" + item?.price}
                                        </strong>
                                    </div>
                                </div>
                            ))}

                        <div className="flex flex-row mt-2 p-2">
                            <div className="basis-5/6">Subtotal</div>
                            <div className="basis-1/6">
                                <strong className="text-green-600">${dataDetail?.subTotal}</strong>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 p-2">
                            <div className="basis-5/6">Tip</div>
                            <div className="basis-1/6">
                                <strong className="text-green-600">${dataDetail?.tipAmount}</strong>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 p-2">
                            <div className="basis-5/6">Discount</div>
                            <div className="basis-1/6">
                                <strong className="text-green-600">${dataDetail?.discount}</strong>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 p-2">
                            <div className="basis-5/6">Tax</div>
                            <div className="basis-1/6">
                                <strong className="text-green-600">${dataDetail?.tax}</strong>
                            </div>
                        </div>

                        <div className="flex flex-row mt-2 p-2">
                            <div className="basis-5/6">
                                <strong>Total</strong>
                            </div>
                            <div className="basis-1/6">
                                <strong className="text-green-600">${dataDetail?.total}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h1>
                        <strong className="text-base">History</strong>
                    </h1>
                    <div className="p-5 rounded-lg bg-gray-50	mt-2">
                        {dataDetail?.history &&
                            dataDetail?.history.map((item, index) => (
                                <div key={index} className="flex items-center py-2">
                                    <p className="w-2/5">{moment(item?.createdAt).format("MM/DD/YYYY hh:mm A")}</p>
                                    <p className="w-3/5">
                                        <strong>{item?.message}</strong>
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Detail;
