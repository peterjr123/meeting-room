import RecurringReservationForm from "@/app/form/recurringReservationForm";
import ReservationForm from "@/app/form/reservationForm";
import { ReccuringReservationData, ReservationFormData, ReservationRequestData } from "@/app/lib/data/type";
import { getDayInWeek } from "@/app/lib/utils";
import { Card } from "antd";
import { Dayjs } from "dayjs";
import { useState } from "react";


const tabList = [
    {
        key: 'onetime',
        tab: 'One Time Reservation',
    },
    {
        key: 'recur',
        tab: 'Recurring Reservation',
    },
];

export default function FormCard({ reservationInfo, onSubmitReservation, selectedDate }:
    { reservationInfo: ReservationFormData, onSubmitReservation: (value: ReservationFormData | ReccuringReservationData, type: "onetime" | "recur") => void, selectedDate: Dayjs }
) {
    const [activeTab, setActiveTab] = useState<"onetime" | "recur">("onetime");
    function onTabChange(tab: string) {
        setActiveTab(tab as "onetime" | "recur")
    }

    function onSubmitOnetime(formData: ReservationFormData) {
        onSubmitReservation(formData, "onetime");
    }

    function onSubmitRecur(formData: ReccuringReservationData) {
        onSubmitReservation(formData, "recur");
    }


    const contentList: Record<string, React.ReactNode> = {
        onetime: <ReservationForm formValues={reservationInfo} onPressSubmit={onSubmitOnetime}></ReservationForm>,
        recur: <RecurringReservationForm formValues={convertToRecurringFormat(reservationInfo, selectedDate)} onPressSubmit={onSubmitRecur}></RecurringReservationForm>
    }

    return (
        <Card
            tabList={tabList}
            activeTabKey={activeTab}
            onTabChange={onTabChange}
        >
            {contentList[activeTab]}
        </Card>
    );
}

function convertToRecurringFormat(data: ReservationFormData, selectedDate: Dayjs): ReccuringReservationData {
    return {
        id: -1,
        userId: -1,
        dayInWeek: getDayInWeek(selectedDate),
        ...data
    }
} 