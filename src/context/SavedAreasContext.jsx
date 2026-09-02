/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const initialSavedAreas = [
  { id: "area-1", name: "Home", category: "residential", thana: "Dhanmondi", address: "Road 9/A, Dhanmondi R/A", safetyScore: 92, recentStatus: "Road 27 transformer repaired. All streets well lit.", notificationsEnabled: true, position: [23.7458, 90.3713] },
  { id: "area-2", name: "Tech Office", category: "work", thana: "Gulshan", address: "Gulshan Avenue, Gulshan 2 Circle", safetyScore: 84, recentStatus: "VIP motorcade traffic slowdown near DCC market.", notificationsEnabled: true, position: [23.7928, 90.4141] },
  { id: "area-3", name: "Dhaka University Campus", category: "campus", thana: "Shahbagh", address: "Curzon Hall & TSC Area", safetyScore: 78, recentStatus: "Gathering near Shahbagh intersection; detour recommended.", notificationsEnabled: true, position: [23.7326, 90.3943] },
  { id: "area-4", name: "Parents' Residence", category: "family", thana: "Uttara", address: "Sector 4, Road 11, Uttara", safetyScore: 88, recentStatus: "No active incidents in the last 24 hours.", notificationsEnabled: true, position: [23.8738, 90.3978] },
];

const SavedAreasContext = createContext(null);

export function SavedAreasProvider({ children }) {
  const [savedAreas, setSavedAreas] = useState(initialSavedAreas);
  return <SavedAreasContext.Provider value={{ savedAreas, setSavedAreas }}>{children}</SavedAreasContext.Provider>;
}

export function useSavedAreas() {
  const context = useContext(SavedAreasContext);
  if (!context) throw new Error("useSavedAreas must be used within SavedAreasProvider");
  return context;
}
