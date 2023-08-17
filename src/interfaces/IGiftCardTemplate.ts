interface IGiftCardTemplate {
    giftCardTemplateId: number;
    giftCardTemplateName: string;
    fileId: number;
    createdDate: Date;
    isDisabled: number;
    giftCardType: string;
    isConsumer: number;
    userId: number;
    imageUrl: string;
}

export default IGiftCardTemplate;
