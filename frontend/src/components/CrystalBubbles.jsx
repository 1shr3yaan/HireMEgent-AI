
import "./CrystalBubbles.css";

const bubbles = [
  { size: 100, left: "5%", delay: "0s", duration: "18s" },
  { size: 55, left: "18%", delay: "3s", duration: "21s" },
  { size: 145, left: "32%", delay: "1s", duration: "24s" },
  { size: 75, left: "48%", delay: "5s", duration: "19s" },
  { size: 120, left: "63%", delay: "2s", duration: "23s" },
  { size: 65, left: "78%", delay: "6s", duration: "20s" },
  { size: 155, left: "90%", delay: "4s", duration: "25s" },
  { size: 45, left: "25%", delay: "8s", duration: "17s" },
  { size: 90, left: "72%", delay: "9s", duration: "22s" },
  { size: 60, left: "42%", delay: "7s", duration: "19s" },
];

export default function CrystalBubbles() {
  return (
    <div className="crystal-background">
      {bubbles.map((bubble, index) => (
        <div
          key={index}
          className="crystal-bubble"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: bubble.left,
            animationDelay: `${bubble.delay}, ${index * -0.7}s`,
            animationDuration: `${bubble.duration}, 3.5s`,
          }}
        />
      ))}
    </div>
  );
}
