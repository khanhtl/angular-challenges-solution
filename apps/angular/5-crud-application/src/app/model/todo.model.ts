export interface Todo {
  title: string;
  userId: number;
  id: number;
}

export interface Status {
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export interface TodoStatus {
  [key: Todo['id']]: Status;
}

export interface TodoState {
  isLoaded: boolean;
  data: Todo[];
}
