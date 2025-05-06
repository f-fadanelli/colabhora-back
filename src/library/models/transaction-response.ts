export interface TransactionSuccess {
    success: true;
    message: string;
    id: number;
  }
  
  export interface TransactionError {
    success: false;
    message: string;
    error: string;
  }
  
  export type TransactionResult = TransactionSuccess | TransactionError;
  