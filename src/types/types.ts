interface IReservation {
  id: number;
  activityId: number;
  startTime: string;
  partySize: number;
  userWithRolesUsername: string;
  customerName: string;
  customerPhone: string;
}

// Interface for the Activity superclass
interface IActivity {
  id: number;
  name: string;
  capacity: number;
  isReserved: boolean;
  duration: number;
  isClosed: boolean;
  dtype: string;
  type: string;
}

// Interface for the Airhockey subclass
interface IAirhockey extends IActivity {
  tableNumber: number;
}

// Interface for the BowlingLane subclass
interface IBowlingLane extends IActivity {
  laneNumber: number;
  childFriendly: boolean;
}

// Interface for the DiningTable subclass
interface IDiningTable extends IActivity {
  diningTableNumber: number;
}

interface ISchedule {
  id: number;
  employeeId: number;
  startTime: string;
  endTime: string;
}

interface IEmployee {
  id: number;
  emp_type: string;
  image_url: string;
  initials: string;
  name: string;
  schedule: ISchedule[];
}

//PRODUCT
interface IProductDTO {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export type { IReservation, IActivity, IAirhockey, IBowlingLane, IDiningTable, ISchedule, IEmployee, IProductDTO };
