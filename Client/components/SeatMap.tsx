import React, { useEffect, useRef, useState } from "react";
import { Square } from "lucide-react";

interface Seat {
  id: number;
  name: string;
  state: number;
  type_id: number;
}

interface SeatMapProps {
  seats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  selectedSeats: Seat[];
  TYPE_COLORS: { id: number; value: string }[];
}

const SEAT_SIZE = 30;
const SEAT_SPACING = 10;

const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  onSeatSelect,
  selectedSeats,
  TYPE_COLORS,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [dimensions, setDimensions] = useState({ rows: 0, cols: 0 });

  // Helper function to get row and number from seat name (e.g., "A1" -> { row: 0, number: 1 })
  const getRowAndNumber = (name: string) => {
    try {
      const row = name.charAt(0).toUpperCase().charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, etc.
      const number = parseInt(name.slice(1)) - 1; // "1" -> 0, "2" -> 1, etc.
      return { row, number };
    } catch (error) {
      console.error("Error parsing seat name:", name);
      return { row: 0, number: 0 };
    }
  };

  // Calculate canvas dimensions based on seats
  useEffect(() => {
    if (!seats || seats.length === 0) return;

    let maxRow = 0;
    let maxCol = 0;

    seats.forEach((seat) => {
      if (!seat.name) return;
      const { row, number } = getRowAndNumber(seat.name);
      maxRow = Math.max(maxRow, row);
      maxCol = Math.max(maxCol, number);
    });

    setDimensions({
      rows: maxRow + 1,
      cols: maxCol + 1,
    });
  }, [seats]);

  const drawSeat = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    seat: Seat
  ) => {
    ctx.beginPath();
    ctx.rect(x, y, SEAT_SIZE, SEAT_SIZE);

    // Color scheme based on seat state
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      ctx.fillStyle = "#1976D2"; // Blue for selected
    } else if (seat.state === 1) {
      ctx.fillStyle = "#757575"; // Gray for booked
    } else if (seat.state === 2) {
      ctx.fillStyle = "#424242"; // Dark gray for unavailable
    } else {
      // Available seats - color based on type
      ctx.fillStyle =
        TYPE_COLORS.find((color) => color.id === seat.type_id)?.value ||
        "#4CAF50"; // Default green
    }

    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw seat name
    // ctx.fillStyle = "#fff";
    // ctx.font = "11px Arial";
    // ctx.fillText(seat.name, x + SEAT_SIZE / 1.25, y + SEAT_SIZE / 1.5);
  };

  const drawSeatMap = () => {
    const canvas = canvasRef.current;
    if (!canvas || !seats || seats.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Update canvas size based on dimensions
    const canvasWidth = Math.max(
      800,
      (dimensions.cols + 2) * (SEAT_SIZE + SEAT_SPACING)
    );
    const canvasHeight = Math.max(
      500,
      (dimensions.rows + 3) * (SEAT_SIZE + SEAT_SPACING)
    );
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw screen
    const screenWidth = Math.min(canvas.width - 600, 600);
    ctx.fillStyle = "#424242";
    ctx.fillRect((canvas.width - screenWidth) / 2, 20, screenWidth, 25);
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.fillText("STAGE", canvas.width / 2, 37);

    // Draw seats
    seats.forEach((seat) => {
      if (!seat.name) return;
      const { row, number } = getRowAndNumber(seat.name);
      const x = 50 + number * (SEAT_SIZE + SEAT_SPACING);
      const y = 60 + row * (SEAT_SIZE + SEAT_SPACING);

      const isHovered: any = hoveredSeat?.id === seat.id;
      drawSeat(ctx, x, y, seat); //here
    });
  };

  useEffect(() => {
    drawSeatMap();
  }, [seats, selectedSeats, hoveredSeat, dimensions]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !seats) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    seats.forEach((seat) => {
      if (!seat.name) return;
      const { row, number } = getRowAndNumber(seat.name);
      const seatX = 50 + number * (SEAT_SIZE + SEAT_SPACING);
      const seatY = 60 + row * (SEAT_SIZE + SEAT_SPACING);

      if (
        x >= seatX &&
        x <= seatX + SEAT_SIZE &&
        y >= seatY &&
        y <= seatY + SEAT_SIZE &&
        seat.state === 0 // Only allow selecting available seats
      ) {
        onSeatSelect(seat);
      }
    });
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas || !seats) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    let foundHoveredSeat = null;
    seats.forEach((seat) => {
      if (!seat.name) return;
      const { row, number } = getRowAndNumber(seat.name);
      const seatX = 50 + number * (SEAT_SIZE + SEAT_SPACING);
      const seatY = 60 + row * (SEAT_SIZE + SEAT_SPACING);

      if (
        x >= seatX &&
        x <= seatX + SEAT_SIZE &&
        y >= seatY &&
        y <= seatY + SEAT_SIZE
      ) {
        foundHoveredSeat = seat;
      }
    });

    setHoveredSeat(foundHoveredSeat);
  };

  // Group seats by type for the legend
  const seatTypes = Array.from(new Set(seats.map((seat) => seat.type_id)));

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="w-full max-w-[800px] bg-gray-800 p-4 rounded-lg overflow-auto">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          className="border border-gray-700 rounded-lg w-full"
          style={{ minWidth: "100%", height: "auto" }}
        />
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <Square className="w-4 h-4 text-blue-600 bg-blue-600" />
          <span className="text-gray-300">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <Square className="w-4 h-4 text-gray-500 bg-gray-500" />
          <span className="text-gray-300">Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <Square className="w-4 h-4 text-gray-700 bg-gray-700" />
          <span className="text-gray-300">Unavailable</span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
