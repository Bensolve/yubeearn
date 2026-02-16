export interface User {
  uid: string;
  email: string;
  userType: 'earner' | 'creator';
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

// Component Types
export interface TestimonialCardProps {
  initial: string;
  name: string;
  location: string;
  quote: string;
  hoursGained: string;
  colorFrom: string;
  colorTo: string;
  borderColor: string;
  bgColor: string;
}

export interface StatCardProps {
  number: string;
  label: string;
  colorFrom: string;
  colorTo: string;
  textColor: string;
}

export interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

export interface FAQItemProps {
  question: string;
  answer: string;
}

export interface SectionContainerProps {
  children: React.ReactNode;
  bgColor?: string;
  title?: string;
  subtitle?: string;
}

export interface NavbarProps {
  logo?: string;
  loginHref?: string;
  signupHref?: string;
}