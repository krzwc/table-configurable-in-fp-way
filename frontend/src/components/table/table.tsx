import React, { FunctionComponent, useState, Key } from 'react';
import { Table as AntdTable, Button, Space } from 'antd';
import { SorterResult, TablePaginationConfig, ColumnType } from 'antd/lib/table/interface';

const data: DataItem[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
    },
    {
        key: '4',
        name: 'Jim Red',
        age: 32,
        address: 'London No. 2 Lake Park',
    },
];

interface DataItem {
    key: string;
    name: string;
    age: number;
    address: string;
}

type Filter = Record<string, Key[] | null>;

type Sorter = SorterResult<DataItem> | SorterResult<DataItem>[];

type Column = ColumnType<DataItem>;

export const Table: FunctionComponent = () => {
    const [filteredInfo, setFilteredInfo] = useState<Filter | null>(null);
    const [sortedInfo, setSortedInfo] = useState<Sorter | null>(null);

    const clearFilters = () => {
        setFilteredInfo(null);
    };

    const clearAll = () => {
        setFilteredInfo(null);
        setSortedInfo(null);
    };

    const setAgeSort = () => {
        setSortedInfo({
            order: 'descend',
            columnKey: 'age',
        });
    };
    const handleChange = (pagination: TablePaginationConfig, filters: Filter, sorter: Sorter) => {
        setFilteredInfo(filters);
        setSortedInfo(sorter);
    };

    const columns: Column[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            filters: [
                { text: 'Joe', value: 'Joe' },
                { text: 'Jim', value: 'Jim' },
            ],
            filteredValue: filteredInfo?.name || null,
            onFilter: (value: string | number | boolean, record: DataItem) => record.name.includes(value as string),
            sorter: (a: DataItem, b: DataItem) => a.name.length - b.name.length,
            sortOrder: ((sortedInfo as SorterResult<DataItem>).columnKey === 'name' &&
                (sortedInfo as SorterResult<DataItem>).order) as 'descend' | 'ascend',
            ellipsis: true,
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            sorter: (a: DataItem, b: DataItem) => a.age - b.age,
            sortOrder: ((sortedInfo as SorterResult<DataItem>).columnKey === 'age' &&
                (sortedInfo as SorterResult<DataItem>).order) as 'descend' | 'ascend',
            ellipsis: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            filters: [
                { text: 'London', value: 'London' },
                { text: 'New York', value: 'New York' },
            ],
            filteredValue: filteredInfo?.address || null,
            onFilter: (value: string | number | boolean, record: DataItem) => record.address.includes(value as string),
            sorter: (a: DataItem, b: DataItem) => a.address.length - b.address.length,
            sortOrder: ((sortedInfo as SorterResult<DataItem>).columnKey === 'address' &&
                (sortedInfo as SorterResult<DataItem>).order) as 'descend' | 'ascend',
            ellipsis: true,
        },
    ];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button onClick={setAgeSort}>Sort age</Button>
                <Button onClick={clearFilters}>Clear filters</Button>
                <Button onClick={clearAll}>Clear filters and sorters</Button>
            </Space>
            <AntdTable columns={columns} dataSource={data} onChange={handleChange} />
        </>
    );
};
