export interface User {
  email: string;
  uid: string;
}



export interface Task {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  rewardPoints: number;
  ownerId: string;
}