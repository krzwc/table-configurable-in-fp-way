import React, { FunctionComponent } from 'react';
import { Table } from 'components/table';
import 'antd/dist/antd.css';

export const App: FunctionComponent = () => {
    return (
        <div className="app">
            <Table />
        </div>
    );
};
