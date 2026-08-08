import React from 'react';
import { Input, Select, Space } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Search } = Input;

export const SearchBar = ({ 
  placeholder = 'Search mentors, alumni, events, or jobs...', 
  onSearch, 
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = 'Filter Category',
  style = {}
}) => {
  return (
    <div style={{ display: 'flex', gap: '12px', width: '100%', flexWrap: 'wrap', ...style }}>
      <Search
        placeholder={placeholder}
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={onSearch}
        style={{ flex: 1, minWidth: '240px' }}
      />
      {filterOptions.length > 0 && (
        <Select
          placeholder={
            <span>
              <FilterOutlined style={{ marginRight: '6px' }} />
              {filterPlaceholder}
            </span>
          }
          size="large"
          allowClear
          onChange={onFilterChange}
          style={{ minWidth: '180px' }}
          options={filterOptions}
        />
      )}
    </div>
  );
};
