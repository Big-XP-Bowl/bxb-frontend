interface IReservation {
  id: number;
  activity: IActivity;
  startTime: string;
  partySize: number;
  userWithRoles: string;
  customerName: string;
  customerPhone: string;
  created: string;
  edited: string;
}

// Interface for the Activity superclass
interface IActivity {
  id: number;
  name: string;
  capacity: number;
  isReserved: boolean;
  duration: number;
  closed: boolean;
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

export type { IReservation, IActivity, IAirhockey, IBowlingLane, IDiningTable };
