import { RHFRadioGroup, RHFTextField } from "components/Form";
import { MECHANT_BUSINESS_QUESTIONS } from "contants";
import { useForm } from "react-hook-form";
import { BusinessInfo } from "dtos/ICreateMerchant";
import { FC } from "react";
import Button from "components/Button";

type FormInputs = {
    quesOneIsAccept: boolean;
    quesOneQuestion: string;
    quesOneDesc: string;

    quesTwoIsAccept: boolean;
    quesTwoQuestion: string;
    quesTwoDesc: string;

    quesThreeIsAccept: boolean;
    quesThreeQuestion: string;
    quesThreeDesc: string;

    quesFourIsAccept: boolean;
    quesFourQuestion: string;
    quesFourDesc: string;

    quesFiveIsAccept: boolean;
    quesFiveQuestion: string;
    quesFiveDesc: string;
};

interface IProps {
    business?: BusinessInfo;
    onSubmitBusiness: (data: BusinessInfo) => void;
}

const Business: FC<IProps> = ({ business, onSubmitBusiness }) => {
    const { control, handleSubmit } = useForm<FormInputs>({
        mode: "onBlur",
        defaultValues: {
            quesOneIsAccept: business ? business.question1.isAccept : false,
            quesOneQuestion: business ? business.question1.question : MECHANT_BUSINESS_QUESTIONS[0].question,
            quesOneDesc: business ? business.question1.desc : "",

            quesTwoIsAccept: business ? business.question2.isAccept : false,
            quesTwoQuestion: business ? business.question2.question : MECHANT_BUSINESS_QUESTIONS[1].question,
            quesTwoDesc: business ? business.question2.desc : "",

            quesThreeIsAccept: business ? business.question3.isAccept : false,
            quesThreeQuestion: business ? business.question3.question : MECHANT_BUSINESS_QUESTIONS[2].question,
            quesThreeDesc: business ? business.question3.desc : "",

            quesFourIsAccept: business ? business.question4.isAccept : false,
            quesFourQuestion: business ? business.question4.question : MECHANT_BUSINESS_QUESTIONS[3].question,
            quesFourDesc: business ? business.question4.desc : "",

            quesFiveIsAccept: business ? business.question5.isAccept : false,
            quesFiveQuestion: business ? business.question5.question : MECHANT_BUSINESS_QUESTIONS[4].question,
            quesFiveDesc: business ? business.question5.desc : "",
        },
    });

    const onSubmit = (data: FormInputs) => {
        const business: BusinessInfo = {
            question1: {
                isAccept: data.quesOneIsAccept,
                question: data.quesOneQuestion,
                desc: data.quesOneDesc,
            },
            question2: {
                isAccept: data.quesTwoIsAccept,
                question: data.quesTwoQuestion,
                desc: data.quesTwoDesc,
            },
            question3: {
                isAccept: data.quesThreeIsAccept,
                question: data.quesThreeQuestion,
                desc: data.quesThreeDesc,
            },
            question4: {
                isAccept: data.quesFourIsAccept,
                question: data.quesFourQuestion,
                desc: data.quesFourDesc,
            },
            question5: {
                isAccept: data.quesFiveIsAccept,
                question: data.quesFiveQuestion,
                desc: data.quesFiveDesc,
            },
        };
        onSubmitBusiness(business);
    };

    return (
        <div>
            <div className="font-bold text-lg mb-4 text-blue-500">Business Information</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-x-5 gap-y-2 grid-cols-12">
                    <div className="col-span-12 sm:col-span-12 lg:col-span-6">
                        <div className="flex flex-col gap-y-4">
                            <p className="text-sm leading-5.5 text-black">{MECHANT_BUSINESS_QUESTIONS[0].question}</p>
                            <RHFRadioGroup<FormInputs>
                                showError={false}
                                control={control}
                                name={"quesOneIsAccept"}
                                options={MECHANT_BUSINESS_QUESTIONS[0].answers}
                            />
                            <RHFTextField control={control} name="quesOneDesc" placeholder="Processor" />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-12 lg:col-span-6">
                        <div className="flex flex-col gap-y-4">
                            <p className="text-sm leading-5.5 text-black">{MECHANT_BUSINESS_QUESTIONS[1].question}</p>
                            <RHFRadioGroup<FormInputs>
                                showError={false}
                                control={control}
                                name={"quesTwoIsAccept"}
                                options={MECHANT_BUSINESS_QUESTIONS[1].answers}
                            />
                            <RHFTextField control={control} name="quesTwoDesc" placeholder="Processor" />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-12 lg:col-span-6">
                        <div className="flex flex-col gap-y-4">
                            <p className="text-sm leading-5.5 text-black">{MECHANT_BUSINESS_QUESTIONS[2].question}</p>
                            <RHFRadioGroup<FormInputs>
                                showError={false}
                                control={control}
                                name={"quesThreeIsAccept"}
                                options={MECHANT_BUSINESS_QUESTIONS[2].answers}
                            />
                            <RHFTextField control={control} name="quesThreeDesc" placeholder="Processor" />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-12 lg:col-span-6">
                        <div className="flex flex-col gap-y-4">
                            <p className="text-sm leading-5.5 text-black">{MECHANT_BUSINESS_QUESTIONS[3].question}</p>
                            <RHFRadioGroup<FormInputs>
                                showError={false}
                                control={control}
                                name={"quesFourIsAccept"}
                                options={MECHANT_BUSINESS_QUESTIONS[3].answers}
                            />
                            <RHFTextField control={control} name="quesFourDesc" placeholder="Processor" />
                        </div>
                    </div>
                    <div className="col-span-12 sm:col-span-12 lg:col-span-6">
                        <div className="flex flex-col gap-y-4">
                            <p className="text-sm leading-5.5 text-black">{MECHANT_BUSINESS_QUESTIONS[4].question}</p>
                            <RHFRadioGroup<FormInputs>
                                showError={false}
                                control={control}
                                name={"quesFiveIsAccept"}
                                options={MECHANT_BUSINESS_QUESTIONS[4].answers}
                            />
                            <RHFTextField control={control} name="quesFiveDesc" placeholder="Processor" />
                        </div>
                    </div>
                    <div className="col-span-12">
                        <Button type="submit" title="Next" btnType="ok" />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Business;
