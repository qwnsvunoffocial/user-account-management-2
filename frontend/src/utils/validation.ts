import * as yup from 'yup';

export const loginSchema = yup.object({
  username: yup.string().required('Nazwa użytkownika jest wymagana'),
  password: yup.string().required('Hasło jest wymagane'),
});

export const registerSchema = yup.object({
  username: yup.string()
    .min(3, 'Nazwa użytkownika musi mieć co najmniej 3 znaki')
    .max(50, 'Nazwa użytkownika może mieć maksymalnie 50 znaków')
    .required('Nazwa użytkownika jest wymagana'),
  email: yup.string()
    .email('Podaj prawidłowy adres email')
    .required('Email jest wymagany'),
  password: yup.string()
    .min(8, 'Hasło musi mieć co najmniej 8 znaków')
    .matches(/[0-9]/, 'Hasło musi zawierać co najmniej jedną cyfrę')
    .matches(/[A-Z]/, 'Hasło musi zawierać co najmniej jedną wielką literę')
    .required('Hasło jest wymagane'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Hasła muszą być takie same')
    .required('Potwierdzenie hasła jest wymagane'),
});

export const editUserSchema = yup.object({
  username: yup.string()
    .min(3, 'Nazwa użytkownika musi mieć co najmniej 3 znaki')
    .max(50, 'Nazwa użytkownika może mieć maksymalnie 50 znaków'),
  email: yup.string().email('Podaj prawidłowy adres email'),
  password: yup.string()
    .optional()
    .test('password-strength', 'Hasło musi mieć min. 8 znaków, cyfrę i wielką literę', (value) => {
      if (!value || value === '') return true;
      return value.length >= 8 && /[0-9]/.test(value) && /[A-Z]/.test(value);
    }),
});
