import { useDebounce } from '@uidotdev/usehooks';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const getData = async (setMembers) => {
  try {
    const res = await axios.get('http://localhost:4444/members');
    setMembers(res.data);
  } catch (err) {
    console.log('ERROR', err);
  }
};

const DropDownContainer = styled('div')`
  width: 10.5em;
  margin: 0 auto;
  height: 40px;
`;

const DropDownHeader = styled('div')`
  margin-bottom: 0.8em;
  padding: 0.4em 2em 0.4em 1em;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 200;
  font-size: 1.1rem;
  color: black;
  background: #ffffff;
`;

const DropDownListContainer = styled('div')`
  transform: translate(0px, 20px);
`;

const DropDownList = styled('ul')`
  padding: 0;
  margin: 0;
  padding-left: 1em;
  background: #ffffff;
  border: 2px solid #e5e5e5;
  box-sizing: border-box;
  color: black;
  font-size: 1.1rem;
  font-weight: 200;
  &:first-child {
    padding-top: 0.8em;
  }
`;

const ListItem = styled('li')`
  list-style: none;
  margin-bottom: 0.8em;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  padding: 0 5rem;
`;

const FilterBy = styled.div`
  display: flex;
`;

const FilterFor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
`;

const Filters = styled.div`
  display: flex;
  justify-content: flex-start;
  width: calc(100% - 10rem);
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 40%;
  padding-right: 6rem;
`;

const SearchFor = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
`;

const Table = styled.table`
  width: calc(100% - 10rem);
  padding: 0 5rem;
  max-width: 100%;
  background: #fff;
  border-radius: 5px;
  border-collapse: collapse;
  box-shadow: 0px 1px 5px 2px #d3d1d1;
`;

export const Thead = styled.thead`
  background: lightgrey;
`;

const TH = styled.th`
  padding: 0.5rem;
  text-align: center;
`;

const Cell = styled.td`
  padding: 0.5rem;
  text-align: center;
`;

export const SearchBar = ({ onChange }) => (
  <Input type="text" placeholder="filter value" onChange={onChange} />
);
export const FilterSelector = ({ currentValue, onClick }) => {
  const filters = [
    { name: 'none', value: null },
    { name: 'rating', value: 'rating' },
    { name: 'activities', value: 'activities' },
  ];
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <DropDownContainer>
      <DropDownHeader onClick={toggle}>{currentValue ?? 'none'}</DropDownHeader>
      {isOpen && (
        <DropDownListContainer>
          <DropDownList>
            {filters.map((filter, i) => (
              <ListItem
                key={`filter-${filter.name}`}
                onClick={() => {
                  onClick(filter.value);
                  setIsOpen(false);
                }}
              >
                {filter.name}
              </ListItem>
            ))}
          </DropDownList>
        </DropDownListContainer>
      )}
    </DropDownContainer>
  );
};

export const Row = ({ id, age, name, activities, rating }) => (
  <tr key={id}>
    <Cell>{name}</Cell>
    <Cell>{age}</Cell>
    <Cell>{rating}</Cell>
    <Cell>
      {activities.map((activity, i) => (
        <div key={i}>{activity}</div>
      ))}
    </Cell>
  </tr>
);

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState(null); // null or string
  const [filterValue, setFilterValue] = useState(''); // empty string or string
  const [search, setSearch] = useState(''); // empty string or string
  const [filteredMembers, setFilteredMembers] = useState([]);

  const debouncedSearch = useDebounce(search, 500);

  const onSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const onFilterValueChange = (e) => {
    setFilterValue(e.target.value);
  };

  useEffect(() => {
    getData(setMembers);
  }, []);

  useEffect(() => {
    if (debouncedSearch === null) return;
    axios
      .get(`http://localhost:4444/members?query=${debouncedSearch}`)
      .then((res) => setMembers(res.data))
      .catch((err) => console.log('ERROR', err));
  }, [debouncedSearch]);

  useEffect(() => {
    if (!filter || !filterValue) return;
    // find members that match the filter and set it to setFilteredMembers
    const filtered = members.filter((member) => {
      if (filter === 'rating') {
        return member.rating === parseInt(filterValue);
      }
      if (filter === 'activities') {
        // check if the activities array includes a partial match of the filterValue and if so, return the member
        return member.activities.some((activity) =>
          activity.toLowerCase().includes(filterValue.toLowerCase())
        );
      }
      return null;
    });
    setFilteredMembers(filtered);
  }, [filterValue, filter, members]);

  return (
    <Block>
      <h1>My Club's Members</h1>
      <Filters>
        <SearchContainer>
          <SearchFor> Search Name: </SearchFor>
          <SearchBar onChange={onSearchChange} />
        </SearchContainer>
        <FilterBy>
          <FilterFor> Filter by: </FilterFor>
          <FilterSelector currentValue={filter} onClick={setFilter} />
          <SearchBar onChange={onFilterValueChange} />
        </FilterBy>
      </Filters>
      <Table>
        <Thead>
          <tr>
            <TH>Name</TH>
            <TH>Age</TH>
            <TH>Member Rating</TH>
            <TH>Activities</TH>
          </tr>
        </Thead>
        <tbody>
          {filter && filterValue
            ? filteredMembers.map((member) => (
                <Row {...member} key={member.id} />
              ))
            : members.map((member) => <Row {...member} key={member.id} />)}
        </tbody>
      </Table>
    </Block>
  );
};

export default MemberList;
