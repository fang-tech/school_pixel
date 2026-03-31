export interface Submission {
  id: number;
  username: string;
  message: string;
  config: string; // JSON string of the chibi maker configuration
  image: string; // base64 data URL of the chibi canvas
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SubmitPayload {
  username: string;
  message: string;
  config: object;
  image: string;
}

export type ReviewAction = 'approved' | 'rejected';
