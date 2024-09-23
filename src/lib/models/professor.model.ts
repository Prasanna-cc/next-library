export interface IProfessorBase {
  name: string;
  email: string;
  department: string;
  shortBio: string | null; // Optional
  eventLink: string | null; // Optional
}

export interface IProfessor extends IProfessorBase {
  id: number;
}
