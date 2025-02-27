'use client'

import React, { useReducer } from "react";
import { Button, Table } from "antd";

import { compareTime, converToDuration } from "@/app/lib/utils";
import { isTimeBetweenIncludeEdge } from "@/app/lib/utils";
import { SelectedTableData, TableReservedData, TimeString } from "@/app/lib/data/type";
import { convertToDatasource, getTableColumns } from "@/app/lib/data/utils";

// 예약 데이터
type SelectedCell = {
  time: TimeString | "initialValue",
  room: string | "initialValue",
}
type CellStatus = {
  selectedStartCell: SelectedCell,
  selectedEndCell: SelectedCell,
  hoveringCell: SelectedCell,
}
const initialValue: SelectedCell = {
  time: "initialValue",
  room: "initialValue",
}
const initialCellStatus: CellStatus = {
  selectedStartCell: { ...initialValue },
  selectedEndCell: { ...initialValue },
  hoveringCell: { ...initialValue },
}

export default function CustomTable({ onSelectReservation, reservedData, meetingRooms }:
  {
    onSelectReservation: (data: SelectedTableData) => void,
    reservedData: TableReservedData[],
    meetingRooms: string[]
  }
) {
  const [cellState, dispatch] = useReducer(cellStateReducer, initialCellStatus);
  // 시간대 선택이 완료된 경우에 true
  const isOnReservationStage = () => {
    if (cellState.selectedEndCell.room === initialValue.room)
      return false;
    return true;
  }

  // Table에 출력되는 cell
  function TableCell({ children, time, room, reserved }:
    { children: React.ReactNode, time: TimeString, room: string, reserved: boolean }) {
    const onSelectTime = (e: any) => {
      // 이미 예약된 시간 위에 클릭하는 경우
      if (isClickOnReservedCell(reservedData, time, room))
        return;

      // 시작 시간과 종료 시간을 모두 선택한 경우
      if (isValidReservation(cellState.selectedStartCell, { time: time, room: room }, reservedData)) {
        dispatch({
          type: 'confirm_reservation_time',
          time: time,
          room: room,
        });
        onSelectReservation({
          startTime: cellState.selectedStartCell.time as TimeString,
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
        onSelectReservation({
          startTime: time,
          endTime: undefined,
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

      <div className={`${bgColor} min-w-4 min-h-6 z-20 hover:bg-gray-300`}
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
      dataSource={convertToDatasource(reservedData, meetingRooms)}
      columns={getTableColumns(TableCell, meetingRooms)}
      pagination={false}
      bordered
      scroll={{ x: "max-content" }} // 가로 스크롤 추가
    />
  );
}


// reducer

type Action =
  ({ type: 'confirm_reservation_time' }
    | { type: 'set_reservation_start_time' }
    | { type: 'on_hovering' }) & SelectedCell

function cellStateReducer(state: CellStatus, action: Action) {
  switch (action.type) {
    case 'confirm_reservation_time': {
      return {
        ...state,
        selectedEndCell: { time: action.time, room: action.room },
        hoveringCell: { time: action.time, room: action.room }
      }
    }
    case 'set_reservation_start_time': {
      return {
        ...state,
        selectedEndCell: { ...initialValue },
        selectedStartCell: { time: action.time, room: action.room }
      }
    }
    case 'on_hovering': {
      return {
        ...state,
        hoveringCell: { time: action.time, room: action.room }
      }
    }
  }
}

// utility functions

const isClickOnReservedCell = (reservedData: TableReservedData[], time: TimeString, room: string): boolean => {
  return reservedData.some((data) => {
    return (data.room === room && isTimeBetweenIncludeEdge(data.startTime, data.duration, time))
  });
}


const isValidReservation = (startCell: SelectedCell, endCell: SelectedCell, reservedData: TableReservedData[]) => {
  // 1. 시작 시간보다 뒤에 있는 경우
  // 2. 시작 시간과 동일한 room인 경우
  if (startCell.room === endCell.room && compareTime(startCell.time as TimeString, endCell.time as TimeString) < 0) {
    // 3. 다른 reservation time과 겹치지 않는 경우
    if (!isOverlapReservedData(startCell, endCell, reservedData)) {
      return true;
    }
  }
  return false;
}

// reservedData의 startTime이 startCell과 endCell 사이에 있는가?
// reservedData의 duration을 고려하지 않아도 문제 없음. (문제가 발생하도록 startCell과 endCell을 선택하지 못하므로)
const isOverlapReservedData = (startCell: SelectedCell, endCell: SelectedCell, reservedData: TableReservedData[]): boolean => {
  return reservedData.some((data) => {
    if (startCell.room !== data.room)
      return false;

    const duration = converToDuration(startCell.time, endCell.time);
    return isTimeBetweenIncludeEdge(startCell.time, duration, data.startTime);
  });
}

const selectBgColor = (reserved: boolean, cellState: CellStatus, currentTime: TimeString, current_room: string) => {
  let bgColor;
  if (reserved === true) {
    // 예약 cell : green
    bgColor = "bg-green-300";
  }
  // 현재 시간 이전 cell: gray
  else if ((cellState.selectedStartCell.time === currentTime && cellState.selectedStartCell.room === current_room)
    || (cellState.selectedEndCell.time === currentTime && cellState.selectedEndCell.room === current_room)
  ) {
    // 선택된 start 또는 end cell : blue
    bgColor = "bg-blue-300";
  }
  else if (cellState.selectedStartCell.room === current_room &&
    // selected cell 보다는 늦고, hovering cell 보다는 빠른 시간
    // cell between: 옅은 blue
    ((compareTime(currentTime, cellState.selectedStartCell.time as TimeString) > 0) && (compareTime(currentTime, cellState.hoveringCell.time as TimeString) < 0))
  ) {
    bgColor = "bg-blue-200";
  }
  else {
    bgColor = "";
  }
  return bgColor;
}


