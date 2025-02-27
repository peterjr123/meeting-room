'use client'

import { useEffect, useState } from "react";
import { ReccuringReservationData } from "../lib/data/type";
import { Form, Input, Button, Select, AutoComplete, AutoCompleteProps } from "antd";
import { endTimeDisplayDecode, endTimeDisplayEncode } from "../lib/utils";
import DaySelector from "../ui/common/daySelecter";
import CommonReservationForm from "./commonReservationForm";
const { Item } = Form;
export default function RecurringReservationForm({ onPressSubmit, formValues }
    : {
        onPressSubmit: (formValues: ReccuringReservationData) => void,
        formValues: ReccuringReservationData
    }
) {
    const dayInWeek = (formValues.dayInWeek === "Saturday" || formValues.dayInWeek === "Sunday") ? "" : formValues.dayInWeek
    const recurringFormValues = {
        ...formValues,
        dayInWeek: dayInWeek,
        endTime: endTimeDisplayEncode(formValues.endTime),
    }

    function onFinish(formValues: ReccuringReservationData) {
        console.log(formValues)
        onPressSubmit({
            ...formValues,
            participants: formValues.participants.map((participant) => participant.at(1) as string),
            endTime: endTimeDisplayDecode(formValues.endTime)
        })
    }

    return (
        <CommonReservationForm formValues={recurringFormValues} onFinish={onFinish}>
            <Item label="choose day" name="dayInWeek">
                <DaySelector value={formValues.dayInWeek} />
            </Item>
        </CommonReservationForm>
    )
}
