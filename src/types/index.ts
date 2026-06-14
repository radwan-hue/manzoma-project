export interface Complaint {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'student' | 'staff' | 'faculty';
  category: string;
  subject: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}

export type ComplaintType = 'student' | 'staff' | 'faculty';
