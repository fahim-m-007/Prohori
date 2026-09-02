/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

export const initialReports = [
  {
    id: "rep-1", title: "Major road accident involving two buses", category: "Road accident", severity: "high", thana: "Dhanmondi", location: "Satmasjid Road, near Dhanmondi 27 intersection", time: "12 min ago", timestamp: "2:55 PM", description: "A collision between two passenger buses has severely blocked southbound traffic. Police and ambulance on scene. Expect 30+ min delay.", upvotes: 28, userVoted: null, flagged: false, status: "verified", position: [23.7465, 90.3742],
    comments: [{ author: "Tanvir H.", time: "8m ago", text: "Satmasjid road is locked. Take Road 8A instead." }, { author: "Nusrat J.", time: "3m ago", text: "Ambulance just arrived, clearing one lane." }],
  },
  {
    id: "rep-2", title: "Heavy knee-level waterlogging & sewer backup", category: "Waterlogging", severity: "caution", thana: "Mirpur", location: "Mirpur 10 roundabout to Kazipara", time: "24 min ago", timestamp: "2:43 PM", description: "Water accumulation over 1.5 feet deep. Multiple CNGs and motorbikes stalled in the middle of the road. Open manhole flagged with red flag.", upvotes: 45, userVoted: null, flagged: false, status: "verified", position: [23.8067, 90.3688],
    comments: [{ author: "Shakil A.", time: "15m ago", text: "Avoid Mirpur 10 circle completely if driving sedan." }],
  },
  {
    id: "rep-3", title: "Severe traffic disruption & standstill gridlock", category: "Traffic disruption", severity: "caution", thana: "Shahbagh", location: "Shahbagh Intersection towards TSC", time: "41 min ago", timestamp: "2:15 PM", description: "Heavy congestion causing vehicular gridlock towards TSC and Bangla Motor. Diversions active via High Court road.", upvotes: 38, userVoted: null, flagged: false, status: "verified", position: [23.7381, 90.3956], comments: [],
  },
  {
    id: "rep-4", title: "Theft & attempted motorbike bag snatching", category: "Theft", severity: "high", thana: "Mohammadpur", location: "Beribadh Embankment Footbridge", time: "48 min ago", timestamp: "2:08 PM", description: "Two men on a dark red pulsar bike attempted to snatch a bag from a rickshaw commuter. Neighborhood volunteers chased them away.", upvotes: 52, userVoted: null, flagged: false, status: "verified", position: [23.7512, 90.3578],
    comments: [{ author: "Ahsan K.", time: "30m ago", text: "Volunteers are now stationed at the footbridge corner." }],
  },
  {
    id: "rep-5", title: "Faulty electrical transformer sparking hazard", category: "Other", severity: "caution", thana: "Gulshan", location: "Road 103, Gulshan 2", time: "1 hr ago", timestamp: "1:45 PM", description: "Sparks dropping over parked cars. DESCO helpline contacted and team dispatched. Area temporarily cordoned off with yellow tape.", upvotes: 19, userVoted: null, flagged: false, status: "verified", position: [23.7945, 90.4149], comments: [],
  },
];

const ReportsContext = createContext(null);

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState(initialReports);
  return <ReportsContext.Provider value={{ reports, setReports }}>{children}</ReportsContext.Provider>;
}

export function useReports() {
  const context = useContext(ReportsContext);
  if (!context) throw new Error("useReports must be used within ReportsProvider");
  return context;
}
