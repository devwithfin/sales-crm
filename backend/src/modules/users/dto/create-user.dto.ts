export class CreateUserDto {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
  department?: string;
  status?: string;
}
