import React from 'react';
import { Table,Tag } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

interface DataType {
  key: React.Key;
  srno:number;
  datetime: string;
  sensorValue: number;
  alertType: string;
}

const columns: TableColumnsType<DataType> = [
  
    {
        title: 'Sr.no',
        dataIndex: 'srno',
    },  
    {
        title: 'Datetime',
        dataIndex: 'createdAt',
    },
    {
        title: 'Sensor Value',
        dataIndex: 'soil_sensor',
        // defaultSortOrder: 'ascend',
        sorter: (a, b) => a.sensorValue - b.sensorValue,
    },
    {
        title: 'Alert Type',
        dataIndex: 'alertType',
        render: (_, { alertType }) => (
            <>
                <Tag color={alertType.toLowerCase() == 'low' ? 'green' : alertType == 'medium' ? 'orange' : 'red'}>
                    {alertType.toUpperCase()}
                </Tag>
            </>
          ),
    },
];


const CustomTable = ({data}:{data:DataType[]}) => {

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <Table
            columns={columns}
            dataSource={data}
            onChange={onChange}
            showSorterTooltip={{ target: 'sorter-icon' }}
            className='custom-table'
            pagination={{
                pageSize:5
            }}
        />
    )
  
};

export default CustomTable;