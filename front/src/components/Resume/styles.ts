import styled from 'styled-components';

export const ResumeFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const Card = styled.div`
  background: ${({ theme }) => theme?.colors?.background || '#ffffff'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e0e0e0'};
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme?.colors?.border || '#e0e0e0'};
  flex-wrap: wrap;
  gap: 0.75rem;
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#333333'};
  margin: 0;
`;

export const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormFieldFullWidth = styled(FormField)`
  grid-column: 1 / -1;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ListItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  width: 100%;
  min-width: 0;
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  color: ${({ theme }) => theme?.colors?.text.secondary || '#666666'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme?.colors?.background.secondary || '#f5f5f5'};
    color: ${({ theme }) => theme?.colors?.error.main || '#dc3545'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ExperienceItem = styled.div`
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e0e0e0'};
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme?.colors?.text || '#333333'};
    margin: 0;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }

  label {
    margin: 0;
    cursor: pointer;
    font-size: 0.875rem;
  }
`;

export const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AddButtonText = styled.span`
  @media (max-width: 640px) {
    display: none;
  }
`;

export const AddButtonIcon = styled.span`
  display: flex;
  align-items: center;
  
  @media (max-width: 640px) {
    margin-right: 0 !important;
  }
`;

