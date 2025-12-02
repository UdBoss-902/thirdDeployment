// src/components/ForecastCard.tsx
import { motion } from "framer-motion";

interface Props {
  day: string;
  temp: number;
  description: string;
}

export default function ForecastCard({ day, temp, description }: Props) {
  return (
    <motion.div
      className="forecast-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3>{day}</h3>
      <p style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>{temp}°C</p>
      <p style={{ textTransform: "capitalize" }}>{description}</p>
    </motion.div>
  );
}
