import { Select, Space } from 'antd';
import React, { useState } from 'react';
import type { DatePickerProps, TimePickerProps } from 'antd';
import { DatePicker, TimePicker } from 'antd';

interface DropdownData {
    value:string,
    label:string
}

const { Option } = Select;

type PickerType = 'time' | 'date';

export const CommonDropdown = ({setDropdownData}: {setDropdownData: (data: DropdownData) => void}) => {

    const [type, setType] = useState<PickerType>('time');
    const PickerWithType = ({type,onChange,}: {type: PickerType;onChange: TimePickerProps['onChange'] | DatePickerProps['onChange'];}) => {
        if (type === 'time') return <TimePicker onChange={onChange} />;
        if (type === 'date') return <DatePicker onChange={onChange} />;
        return <DatePicker picker={type} onChange={onChange} />;
    };
    
    return (
        <Space>
            <Select value={type} onChange={setType}>
                <Option value="time">Time</Option>
                <Option value="date">Date</Option>
                <Option value="week">Week</Option>
                <Option value="month">Month</Option>
            </Select>
            <PickerWithType type={type} onChange={(value) => console.log(value)} />
        </Space>
    )
}