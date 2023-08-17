interface IPaymentData {
    message: string;
    transaction_type: string;
    transaction_id: string;
    method: string;
    card_type: string;
    validation_status: string;
    transaction_status: string;
    card_number: string;
    ext_date: string;
    name_on_card: string;
}

export default IPaymentData;
