export interface TransferRequest {
  note: string;
  type: number;
  items: any[];
}

export interface TransferRequestApproval {
  stockstransferid: string;
  items: any[];
}
