export interface Issue {
  id: number;
  identifier: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done' | 'cancelled';
  priority: 'none' | 'urgent' | 'high' | 'medium' | 'low';
  assignee: string | null;
  labels: string[];
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateIssuePayload = {
  title: string;
  description?: string;
  status?: Issue['status'];
  priority?: Issue['priority'];
  assignee?: string | null;
  labels?: string[];
  due_date?: string | null;
};

export type UpdateIssuePayload = Partial<CreateIssuePayload>;
