import React, { FunctionComponent } from 'react';
import { Table as AntdTable } from 'antd';
import { ColumnType } from 'antd/lib/table/interface';
import { Task } from 'common/helpers';
import { compose, uniq, map, prop } from 'ramda';

interface DataItem {
    key: string;
    name: string;
    age: number;
    address: string;
}

type Column = ColumnType<DataItem>;

/* const columns: Column[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        filters: [
            {
                text: 'Joe',
                value: 'Joe',
            },
            {
                text: 'Jim',
                value: 'Jim',
            },
        ],
        onFilter: (value, record) => record.name.indexOf(String(value)) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
    },
    {
        title: 'Age',
        dataIndex: 'age',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
    },
    {
        title: 'Address',
        dataIndex: 'address',
        filters: [
            {
                text: 'London',
                value: 'London',
            },
            {
                text: 'New York',
                value: 'New York',
            },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.address.indexOf(String(value)) === 0,
        sorter: (a, b) => a.address.length - b.address.length,
        sortDirections: ['descend', 'ascend'],
    },
]; */

const data: DataItem[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'Orlando No. 1 Lake Park',
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
const dataTask = Task.of(data);

const isStringArray = (array: string[] | number[]): array is string[] => {
    return (array as string[]).every((item) => typeof item === 'string');
};

const getFilterValues = (arr: string[] | number[]) =>
    isStringArray(arr) ? arr.map((item) => item.split(' ')[0]) : arr;

interface TableDataAndColumns {
    data: DataItem[];
    columns: Column[];
}

const invokableCompose = compose as any;

const makeFilterable = ({ data, columns }: TableDataAndColumns) => {
    return columns.map((column) => ({
        ...column,
        filters: invokableCompose(
            map((filter) => ({ text: filter, value: filter })),
            uniq,
            getFilterValues,
            (data: DataItem[], column: Column) => {
                return map(prop(column.title), data);
            },
        )(data, column),
        onFilter: (value: string | number | boolean, record: DataItem) => {
            return typeof value === 'number'
                ? record[column.title as keyof DataItem] === value
                : typeof value === 'string'
                ? String(record[column.title as keyof DataItem]).startsWith(value)
                : false;
        },
    }));
};
/* const makeSortable = () => {}; */

export const Table: FunctionComponent = () => {
    return dataTask.fork(
        console.error,
        compose(
            (columns) => <AntdTable columns={columns} dataSource={data} />,
            // eslint-disable-next-line no-console
            // console.log,
            makeFilterable,
            (data: DataItem[]) => ({
                columns: Object.keys(data[0])
                    .filter((key) => key !== 'key')
                    .map((key) => ({
                        title: key,
                        dataIndex: key,
                    })),
                data,
            }),
        ),
    );
};
