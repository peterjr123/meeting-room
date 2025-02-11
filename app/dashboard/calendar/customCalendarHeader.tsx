import React from 'react';
import dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

import { Calendar, Col, Radio, Row, Select, theme, Typography } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayLocaleData from 'dayjs/plugin/localeData';

dayjs.extend(dayLocaleData);

const CustomCalendarHeader = function({ value, type, onChange, onTypeChange, onChangeMode, displayMode }: {value: Dayjs, type: any, onChange: any, onTypeChange: any, onChangeMode: any, displayMode: any}) {
    const start = 0;
    const end = 12;
    const monthOptions = [];

    let current = value.clone();
    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i++) {
      current = current.month(i);
      months.push(localeData.monthsShort(current));
    }

    for (let i = start; i < end; i++) {
      monthOptions.push(
        <Select.Option key={i} value={i} className="month-item">
          {months[i]}
        </Select.Option>,
      );
    }

    const year = value.year();
    const month = value.month();
    const options = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>,
      );
    }
    return (
      <div style={{ padding: 8 }}>
        <Row gutter={8}>
          <Col>
            <Radio.Group
              size="small"
              onChange={(e) => { 
                onChangeMode(e.target.value);
            }}
              value={displayMode}
              defaultValue="week"
            >
              <Radio.Button value="week">This Week</Radio.Button>
              <Radio.Button value="month">Month</Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Select
              size="small"
              popupMatchSelectWidth={false}
              className="my-year-select"
              value={year}
              onChange={(newYear) => {
                onChangeMode("month");
                const now = value.clone().year(newYear);
                onChange(now);
              }}
            >
              {options}
            </Select>
          </Col>
          <Col>
            <Select
              size="small"
              popupMatchSelectWidth={false}
              value={month}
              onChange={(newMonth) => {
                onChangeMode("month");
                const now = value.clone().month(newMonth);
                onChange(now);
              }}
            >
              {monthOptions}
            </Select>
          </Col>
        </Row>
      </div>
    );
  }

  export default CustomCalendarHeader;