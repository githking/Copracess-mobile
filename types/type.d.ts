export interface SplashScreenProps {
  onFinish: () => void;
}
interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

export interface ScreenHeaderBtnProps {
  iconUrl: ImageSourcePropType;
  handlePress: () => void;
  width?: number;
  height?: number;
}

export interface CustomHeaderProps {
  notificationCount: number;
  onNotificationPress: () => void;
  onProfilePress: () => void;
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

export interface SearchInputProps {
  initialQuery?: string;
  icon: ImageSourcePropType;
  handlePress: () => void;
}

export interface addFABProps {
  onPress: () => void;
}

export interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
}
interface TransactionCardProps {
  transaction: Transaction;
  isEditMode: boolean;
  onPress: () => void;
}

export interface FilterModalProps {
  visible: boolean;
  onApplyFilters: (filters: {
    selectedPeriod: string;
    startDate: Date;
    endDate: Date;
    selectedStatus: string[];
  }) => void;
  onClose: () => void;
}

export interface Filters {
  selectedPeriod: string;
  startDate: Date;
  endDate: Date;
  selectedStatus: string[];
}

export interface UpdateTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: (updatedTransaction: Transaction) => void;
  transaction: Transaction | null;
}
