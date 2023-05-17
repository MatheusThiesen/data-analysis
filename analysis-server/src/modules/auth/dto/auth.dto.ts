import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { RegExHelper } from '../../../helpers/regex.helper';

export class AuthSignUpDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password)
  senha: string;

  @IsNotEmpty()
  cnpj: string;

  @IsNotEmpty()
  nome: string;

  @IsNotEmpty()
  razaoSocial: string;

  @IsNotEmpty()
  nomeFantasia: string;
}
export class AuthSignInDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password)
  senha: string;
}
