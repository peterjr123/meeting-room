import React, { useState } from "react";
import { Table } from "antd";
import { convertToDatasource, getTableColumns } from "../../lib/data";
import { compareTime } from "@/app/lib/utils";

// 예약 데이터
const reservations = [
  { room: "room1", start: "10:00", duration: 30 }, // 10:00 ~ 10:30 (3열 병합)
  { room: "room2", start: "10:20", duration: 40 }, // 10:20 ~ 11:00 (4열 병합)
  { room: "room3", start: "10:40", duration: 30 }, // 10:40 ~ 11:10 (3열 병합, 11:00 이후는 표시되지 않음)
  { room: "room1", start: "11:00", duration: 20 }, // 11:00 ~ 11:20 (2열 병합)
];

type SelectedCell = {
  time: string,
  room: string,
}
const initialValue = {
  time: "initialValue",
  room: "initialValue",
}
export default function CustomTable({ setReservationInfo }) {
  // is cell selected(clicked) by user?
  const [selectedStartCell, setSelectedStartCell] = useState<SelectedCell>(initialValue);
  const [selectedEndCell, setSelectedEndCell] = useState<SelectedCell>(initialValue);
  const [hoveringCell, setHoveringCell] = useState<SelectedCell>(initialValue);

  const isOnReservationStage = () => {
    if (selectedEndCell.room === initialValue.room)
      return false;
    return true;
  }

  // Table에 출력되는 cell
  function CellComponent({ children, time, room, reserved }:
    { children: React.ReactNode, time: string, room: string, reserved: boolean }) {

    const onSelectTime = () => {
      // 시작 시간과 종료 시간을 모두 선택한 경우
      if (isValidReservation(selectedStartCell, { time: time, room: room })) {
        setSelectedEndCell({
          time: time,
          room: room
        });
        setHoveringCell({
          time: time,
          room: room,
        })
        setReservationInfo({
          startTime: selectedStartCell.time,
          endTime: time,
          room: room
        });
      }
      // 처음 선택 또는 다른 cell로 시작 시간을 변경
      else {
        setSelectedStartCell({
          time: time,
          room: room,
        });
        setSelectedEndCell({
          ...initialValue
        })
        setReservationInfo({
          startTime: time,
          endTime: "please select on table",
          room: room
        })
      }
    }
    const onHoverIn = () => {
      if (isOnReservationStage())
        return;
      setHoveringCell({
        time: time,
        room: room,
      })
    }
    const onHoverOut = () => {
      console.log("hover out");
    }

    const onFocusOut = () => {
      console.log("on Focus Out!!")
    }

    let bgColor;
    if (reserved === true) {
      // 예약 cell : green
      bgColor = "bg-green-300";
    }
    else if ((selectedStartCell.time === time && selectedStartCell.room === room)
      || (selectedEndCell.time === time && selectedEndCell.room === room)
    ) {
      // 선택된 start 또는 end cell : blue
      bgColor = "bg-blue-300";
    }
    else if (selectedStartCell.room === room &&
      // selected cell 보다는 늦고, hovering cell 보다는 빠른 시간
      // cell between: 옅은 blue
      ((compareTime(time, selectedStartCell.time) > 0) && (compareTime(time, hoveringCell.time) < 0))
    ) {
      bgColor = "bg-blue-200"; 
    }
    else {
      bgColor = "";
    }

    return (
      <div className={`${bgColor} min-w-4 min-h-6 hover:bg-gray-300`}
        tabIndex={0}
        onClick={onSelectTime}
        onBlur={() => {console.log("out")}}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
      >
        {children}
      </div>
    );
  }

  return (
    <Table
      dataSource={convertToDatasource(reservations)}
      columns={getTableColumns(CellComponent)}
      pagination={false}
      bordered
      scroll={{ x: "max-content" }} // 가로 스크롤 추가
    />
  );
}


const isValidReservation = (startCell: SelectedCell, endCell: SelectedCell) => {
  // 1. 시작 시간보다 뒤에 있는 경우
  // 2. 시작 시간과 동일한 room인 경우
  // TODO: 3. 다른 reservation time과 겹치지 않는 경우
  if (startCell.room === endCell.room && compareTime(startCell.time, endCell.time) < 0) {
    return true;
  }

  return false;
}