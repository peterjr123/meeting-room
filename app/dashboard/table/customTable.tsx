import React, { useReducer, useState } from "react";
import { Table } from "antd";
import { convertToDatasource, getTableColumns } from "../../lib/data/tableData";
import { compareTime } from "@/app/lib/utils";
import { ReservationInfo } from "@/app/dashboard/reservation";
import { TableReservationData } from "@/app/lib/data/reservationData";
// 예약 데이터
type SelectedCell = {
  time: string,
  room: string,
}
type CellStatus = {
  selectedStartCell: SelectedCell,
  selectedEndCell: SelectedCell,
  hoveringCell: SelectedCell,
}
const initialValue = {
  time: "initialValue",
  room: "initialValue",
}
const initialCellStatus: CellStatus = {
    selectedStartCell: {...initialValue},
    selectedEndCell: {...initialValue},
    hoveringCell: {...initialValue},
}

export default function CustomTable({ setReservationInfo, reservedData }:
  {setReservationInfo: React.Dispatch<React.SetStateAction<ReservationInfo>>, 
    reservedData: TableReservationData[] }
) {
  const [cellState, dispatch] = useReducer(cellStateReducer, initialCellStatus);

  // 시간대 선택이 완료된 경우에 true
  const isOnReservationStage = () => {
    if (cellState.selectedEndCell.room === initialValue.room)
      return false;
    return true;
  }

  // Table에 출력되는 cell
  function CellComponent({ children, time, room, reserved }:
    { children: React.ReactNode, time: string, room: string, reserved: boolean }) {

    const onSelectTime = () => {
      // 시작 시간과 종료 시간을 모두 선택한 경우
      if (isValidReservation(cellState.selectedStartCell, { time: time, room: room })) {
        dispatch({
          type: 'confirm_reservation_time',
          time: time,
          room: room,
        });
        setReservationInfo({
          startTime: cellState.selectedStartCell.time,
          endTime: time,
          room: room
        });
      }
      // 처음 선택 또는 다른 cell로 시작 시간을 변경
      else {
        dispatch({
          type: 'set_reservation_start_time',
          time: time,
          room: room,
        });
        setReservationInfo({
          startTime: time,
          endTime: "please select on table",
          room: room
        })
      }
    }
    const onHoverIn = () => {
      if (!isOnReservationStage()) {
        dispatch({
          type: 'on_hovering',
          time: time,
          room: room,
        })
      }
    }

    const bgColor = selectBgColor(reserved, cellState, time, room);

    return (
      <div className={`${bgColor} min-w-4 min-h-6 hover:bg-gray-300`}
        tabIndex={0}
        onClick={onSelectTime}
        onMouseEnter={onHoverIn}
      >
        {children}
      </div>
    );
  }

  return (
    <Table
      dataSource={convertToDatasource(reservedData)}
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


const selectBgColor = (reserved: boolean, cellState: CellStatus, currentTime: string, current_room: string) => {
  let bgColor;
    if (reserved === true) {
      // 예약 cell : green
      bgColor = "bg-green-300";
    }
    else if ((cellState.selectedStartCell.time === currentTime && cellState.selectedStartCell.room === current_room)
      || (cellState.selectedEndCell.time === currentTime && cellState.selectedEndCell.room === current_room)
    ) {
      // 선택된 start 또는 end cell : blue
      bgColor = "bg-blue-300";
    }
    else if (cellState.selectedStartCell.room === current_room &&
      // selected cell 보다는 늦고, hovering cell 보다는 빠른 시간
      // cell between: 옅은 blue
      ((compareTime(currentTime, cellState.selectedStartCell.time) > 0) && (compareTime(currentTime, cellState.hoveringCell.time) < 0))
    ) {
      bgColor = "bg-blue-200"; 
    }
    else {
      bgColor = "";
    }
    return bgColor;
}


type Action = 
  ({ type: 'confirm_reservation_time' }
  | { type: 'set_reservation_start_time' }
  | { type: 'on_hovering' }) & SelectedCell

function cellStateReducer(state: CellStatus, action: Action) {
  switch(action.type) {
    case 'confirm_reservation_time': {
      return {
        ...state, 
        selectedEndCell: {time: action.time, room: action.room},
        hoveringCell: {time: action.time, room: action.room}
      }
    }
    case 'set_reservation_start_time': {
      return {
        ...state, 
        selectedEndCell: {...initialValue},
        selectedStartCell: {time: action.time, room: action.room}
      }
    }
    case 'on_hovering': {
      return {
        ...state,
        hoveringCell: {time: action.time, room: action.room}
      }
    }
  }
}