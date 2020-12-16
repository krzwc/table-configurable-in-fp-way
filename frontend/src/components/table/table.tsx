import React, { FunctionComponent } from 'react';
import { Table as AntdTable } from 'antd';
import { ColumnType, CompareFn, SortOrder } from 'antd/lib/table/interface';
import { Task } from 'common/helpers';
import { compose, uniq, map, prop } from 'ramda';

interface DataItem {
    key: string;
    name: string;
    age: number;
    address: string;
}

type Column = ColumnType<DataItem>;

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
    filters?: any;
    onFilter?: any;
    sorter?: CompareFn<DataItem>;
    sortDirections?: SortOrder[];
}

const invokableCompose = compose as any;

const makeFilterable = ({ data, columns }: TableDataAndColumns) => ({
    data,
    columns: columns.map((column) => ({
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
    })),
});

const makeSortable = ({ data, columns }: TableDataAndColumns) => ({
    data,
    columns: columns.map((column) => ({
        ...column,
        sorter: (recordA: DataItem, recordB: DataItem) =>
            typeof recordA[column.title as keyof DataItem] === 'number'
                ? Number(recordA[column.title as keyof DataItem]) - Number(recordB[column.title as keyof DataItem])
                : String(recordA[column.title as keyof DataItem]).length -
                  String(recordB[column.title as keyof DataItem]).length,
        sortDirections: ['descend', 'ascend'] as SortOrder[],
    })),
});

export const Table: FunctionComponent = () => {
    return dataTask.fork(
        console.error,
        compose(
            ({ columns, data }) => <AntdTable columns={columns} dataSource={data} />,
            // eslint-disable-next-line no-console
            // console.log,
            makeSortable,
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
