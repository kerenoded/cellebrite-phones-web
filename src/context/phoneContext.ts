import { PhoneEntities } from './../models/Phone';
import { createContext } from "react";

export type PhoneContent = {
    phoneCollection: PhoneEntities
    colors: string[]
    actionMade: (action: string, value: any) => void
  }

export const PhonesContext = createContext<PhoneContent>({phoneCollection: new PhoneEntities([], 0), colors: [], actionMade: () => {}});