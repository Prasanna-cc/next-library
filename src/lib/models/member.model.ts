export interface IMemberBase {
  name: string;
  age: number;
  email: string;
  phoneNumber: string;
  address: string;
  password: string;
  role: "user" | "admin";
}

export interface IMember extends IMemberBase {
  id: number;
  status: "verified" | "banned";
}

export interface IMemberDetails extends Omit<IMember, "password" | "status"> {}
