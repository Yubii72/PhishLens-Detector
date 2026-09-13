import { useLocation } from "wouter";
import { AboutPage } from "./AboutPage";
import { HistoryPage } from "./HistoryPage";
import { ScanPage } from "./ScanPage";

export default function Home() {
  const [location] = useLocation();
  if (location === "/history") return <HistoryPage />;
  if (location === "/about") return <AboutPage />;
  return <ScanPage />;
}