interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

export declare interface Transaction {
  transaction_id: string;
  transaction_date_time: string;
  buyer_name: string;
  transaction_amount: string;
  plate_number: string;
  copra_weight: number;
  payment_method: string;
  status: string;
}
export declare interface GoogleInputProps {
  icon: React.ReactNode;
  containerStyles?: string;
  initialLocation?: string;
  handlePress: () => void;
  textInputBackgroundColor?: string;
}
