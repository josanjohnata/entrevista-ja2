import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const { colors } = theme;

export const PageWrapper = styled.main`
  background-color: ${colors.neutral[100] || '#F8F7F4'};
  padding: 3rem 2rem;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Hero = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: ${colors.primary};
  }
  p {
    font-size: 1.125rem;
    color: ${colors.text};
    margin-top: 0.5rem;
  }
`;

export const FilterContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  align-items: flex-end;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  label {
    font-weight: 500;
    font-size: 0.875rem;
    color: ${colors.text};
  }
`;

export const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
`;

export const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%;
  background-size: 0.65em auto;
`;

export const SearchButton = styled.button`
  background-color: ${colors.primary.main};
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${colors.primary.light};
  }
`;

export const ListingsSection = styled.section`
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

export const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

export const JobCard = styled.a`
  background-color: white;
  text-decoration: none;
  color: inherit;
  border: 1px solid '#DBDBD4';
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
`;

export const JobTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  min-height: 3.5rem;
`;

export const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${colors.text};
`;

export const CompanyInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  img {
    width: 40px;
    height: 40px;
    border-radius: 4px;
    object-fit: contain;
    border: 1px solid #eee;
  }
  .company-details {
    display: flex;
    flex-direction: column;
  }
  .company-name {
    font-weight: 600;
  }
  .company-location {
    font-size: 0.875rem;
    color: ${colors.text};
  }
`;

export const LoadingState = styled.p`
  text-align: center;
  padding: 4rem;
  font-size: 1.25rem;
`;

export const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
`;

export const PageButton = styled.button`
  background-color: white;
  color: ${colors.primary.main};
  border: 1px solid ${colors.primary.main};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover:not(:disabled) {
    background-color: ${colors.primary.light};
    color: white;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
