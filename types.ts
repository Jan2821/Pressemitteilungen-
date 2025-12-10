export interface PressReleaseData {
  headline: string;
  subheadline: string;
  city: string;
  date: string;
  body: string;
  aboutCompany: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

export enum GeneratorType {
  HEADLINE = 'HEADLINE',
  BODY = 'BODY',
  ABOUT = 'ABOUT',
  IMPROVE = 'IMPROVE'
}

export interface AIRequest {
  type: GeneratorType;
  context: string;
  currentText?: string;
}