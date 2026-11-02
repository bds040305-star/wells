export const asset = `${import.meta.env.BASE_URL}design/assets/`;
export const vegetables = [
  { name: "상추", english: "LETTUCE", image: "lettuce.png" },
  { name: "루꼴라", english: "ARUGULA", image: "arugula.png" },
  { name: "청경채", english: "BOK CHOY", image: "bok-choy.png" },
];
// Outline icons redrawn from the supplied icon sheet (24-unit SVG grid).
const paths = {
  arrow: "M5 19 19 5M5 5h14v14",
  menu: "M5 8h14M5 16h9",
  close: "m6 6 12 12M18 6 6 18",
  back: "m14 6-6 6 6 6",
  bulb: "M9 18v-3.3C9 12.5 6.5 11.2 6.5 8a5.5 5.5 0 0 1 11 0c0 3.2-2.5 4.5-2.5 6.7V18H9Zm0 3h6M12 17V9M12 1v1M3 5l1.5 1M21 5l-1.5 1",
  touch: "M8 12V5a1.8 1.8 0 0 1 3.6 0v6l1-1a1.7 1.7 0 0 1 2.7 1l.6-.5a1.7 1.7 0 0 1 2.7 1.2l.3-.2a1.7 1.7 0 0 1 2.5 1.9L19 21H10l-6-7a1.8 1.8 0 0 1 2.5-2.5L8 13M10 1V0M18 3l1.5-1.5M3 5l1 1",
  temperature: "M9 14V5a2.5 2.5 0 0 1 5 0v9a4.5 4.5 0 1 1-5 0ZM11.5 7v10M18 5h3M18 8h2M18 11h3",
  air: "M2 6q2.5-2.5 5 0t5 0 5 0 5 0M2 12q2.5-2.5 5 0t5 0 5 0 5 0M2 18q2.5-2.5 5 0t5 0 5 0 5 0",
  bell: "M6 17h12l-1.5-2V9a4.5 4.5 0 0 0-9 0v6L6 17ZM10 20h4M12 3v1",
  pot: "M5 15h14l-2.5 7h-9L5 15ZM12 15V9M12 10C5 11 3 6 3 3c7 0 9 3 9 7ZM12 8c0-5 3-7 9-7 0 6-3 9-9 9",
  door: "M3 3h18v17H3V3ZM6 6h12v11H6V6ZM9 22h6M12 20v2M16 10v3",
  power: "M12 2v10M6.5 4.5a9 9 0 1 0 11 0",
  leaf: "M12 22v-9M12 16C5 16 2 10 2 4c7 0 10 4 10 9M12 13c0-5 3-9 10-9 0 7-4 11-10 12M6 9l6 7M18 9l-6 7",
  sun: "M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2 2M17.8 17.8l2 2M4.2 19.8l2-2M17.8 6.2l2-2",
  lock: "M8 10V6a4 4 0 0 1 8 0v4M6 10h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2ZM12 14v4M11 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0",
  timer: "M12 4a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM9 1h6M12 1v3M12 7v6l4 2M19 4l2 2",
  headset: "M4 12V9a8 8 0 0 1 16 0v3M4 9H3a3 3 0 0 0 0 6h1V9ZM20 9h1a3 3 0 0 1 0 6h-1V9ZM20 15v2c0 3-4 4-7 4M10 21h3M8 11h.01M12 11h.01M16 11h.01",
  message: "M2 3h20v15h-8l-4 4v-4H2V3Z",
  tools: "M14 10a5 5 0 0 1 6-7l-3 3 1 3 3 1 3-3a5 5 0 0 1-7 6L7 23l-4-4L14 8M7 10 3 6l-1-4 4 1 4 4M8 9l3 3M14 15l7 7 2-2-7-7M17 17l3 3",
  user: "M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM4 22v-3a8 8 0 0 1 16 0v3",
  water: "M12 2c-2 5-7 9-7 13a7 7 0 0 0 14 0c0-4-5-8-7-13Z",
};
export function Icon({ name, size = 24, ...props }) {
  return <svg width={size} height={size} viewBox="-1 -1 26 26" fill="none"
    stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true" focusable="false" data-icon={name} {...props}>
    <path d={paths[name] || paths.leaf} />
    {name === "message" && <text x="12" y="12.6" textAnchor="middle" fill="currentColor" stroke="none" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="500">1:1</text>}
  </svg>;
}
export function SocialIcon({ name, size = 18 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-icon={name.toLowerCase()}>
    {name === "YouTube" && <path fill="currentColor" fillRule="evenodd" d="M4 5h16a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Zm6 4v6l6-3-6-3Z" />}
    {name === "Instagram" && <g fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></g>}
    {name === "Facebook" && <path fill="currentColor" d="M14 23V13h3.4l.5-4H14V6.5c0-1.2.4-2 2-2h2V1.1A24 24 0 0 0 15.2 1C12.3 1 10 2.8 10 6.1V9H7v4h3v10h4Z" />}
  </svg>;
}

export function Brand() {
  return <span className="brand">wells</span>;
}
export function Action({ children, onClick, light = false, ...props }) {
  return (
    <button
      className={`action ${light ? "action-light" : ""}`}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      <Icon name="arrow" size={20} />
    </button>
  );
}
