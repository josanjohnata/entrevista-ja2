import React, { useState } from 'react';
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import * as S from './styles';

const ADMIN_EMAILS = ['josanjohnata@gmail.com', 'edhurabelo@gmail.com'];

interface CreateUserFormData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  planExpirationDate: string;
}

export const CreateUserForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    password: '',
    displayName: '',
    role: UserRole.BASIC_PLAN,
    planExpirationDate: '',
  });

  const isAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email);

  if (!isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      
      const response = await fetch(`${backendUrl}/admin/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: currentUser?.email,
          email: formData.email,
          password: formData.password,
          displayName: formData.displayName,
          role: formData.role,
          planExpirationDate: formData.planExpirationDate || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao criar usuário');
      }

      toast.success(`Usuário ${formData.email} criado com sucesso!`);
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        displayName: '',
        role: UserRole.BASIC_PLAN,
        planExpirationDate: '',
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar usuário. Tente novamente.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <S.CreateUserContainer>
      <S.CreateUserHeader>
        <UserPlus size={24} />
        <S.CreateUserTitle>Criar Novo Usuário</S.CreateUserTitle>
      </S.CreateUserHeader>

      <S.CreateUserForm onSubmit={handleSubmit}>
        <S.FormGroup>
          <S.Label htmlFor="email">Email *</S.Label>
          <S.Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="usuario@exemplo.com"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="password">Senha *</S.Label>
          <S.PasswordInputWrapper>
            <S.Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
            />
            <S.PasswordToggleButton
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </S.PasswordToggleButton>
          </S.PasswordInputWrapper>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="displayName">Nome *</S.Label>
          <S.Input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            required
            placeholder="Nome completo"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="role">Plano/Role *</S.Label>
          <S.Select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value={UserRole.BASIC_PLAN}>Plano Básico</option>
            <option value={UserRole.MONTHLY_PLAN}>Plano Mensal</option>
            <option value={UserRole.QUARTERLY_PLAN}>Plano Trimestral</option>
            <option value={UserRole.RECRUITER}>Recrutador</option>
          </S.Select>
        </S.FormGroup>

        <S.FormGroup>
          <S.Label htmlFor="planExpirationDate">Data de Expiração (Opcional)</S.Label>
          <S.Input
            id="planExpirationDate"
            name="planExpirationDate"
            type="date"
            value={formData.planExpirationDate}
            onChange={handleChange}
            placeholder="DD/MM/AAAA"
          />
          <S.HelpText>Deixe em branco para acesso sem expiração</S.HelpText>
        </S.FormGroup>

        <S.SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className="spinner" />
              Criando...
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Criar Usuário
            </>
          )}
        </S.SubmitButton>
      </S.CreateUserForm>
    </S.CreateUserContainer>
  );
};

