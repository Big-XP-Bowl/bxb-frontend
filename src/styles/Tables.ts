import styled from 'styled-components';

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const TableLarge = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: #333;
`;

const TableSmall = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: #333;
`;

const TableHeader = styled.thead`
  background-color: #f2f2f2;
  font-weight: bold;
`;

const TableData = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

export { TableWrapper, TableLarge, TableSmall, TableHeader, TableData, TableRow};