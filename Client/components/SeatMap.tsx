import React, { useEffect, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Plus,
  Minus,
  RefreshCw,
} from "lucide-react";

interface Seat {
  id: number;
  name: string;
  state: number; // 0=available, 1=booked, 2=unavailable
  type_id: number; // For seat pricing/category
}

interface SeatMap2Props {
  seats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  selectedSeats: Seat[];
  TYPE_COLORS: { id: number; value: string; name: string; price: number }[];
}

const colors = [
  "#805AD5", // Purple
  "#F6AD55", // Orange
  "#ECC94B", // Yellow
  "#48BB78", // Green
  "#4299E1", // Blue
  "#F56565", // Red
  "#9F7AEA", // Lavender
  "#ED64A6", // Pink
  "#38B2AC", // Teal
  "#667EEA", // Indigo
  "#F97316", // Orange-red
];

const SeatMap: React.FC<SeatMap2Props> = ({
  seats = [],
  onSeatSelect,
  selectedSeats = [],
  TYPE_COLORS = [],
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [mTypes, setMTypes] = useState<any>([]);
  const transformComponentRef = React.useRef<ReactZoomPanPinchRef | null>(null);

  // Generate sample seats if none provided (for demonstration)
  const getSeats = () => {
    if (seats && seats.length > 0) return seats;

    // Generate sample seats for demonstration
    const sampleSeats: Seat[] = [];
    const sections = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "_A",
      "_B",
      "_C",
    ];
    const rows = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    let id = 1;
    sections.forEach((section) => {
      // Different configurations based on section
      let maxRows = 7;
      let seatsPerRow = 15;

      if (section === "C") {
        maxRows = 11;
        seatsPerRow = 20;
      } else if (section === "F") {
        maxRows = 3;
        seatsPerRow = 14;
      } else if (section === "B") {
        // Modified for wider back section
        maxRows = 2;
        seatsPerRow = 30; // Wider to span the entire theater width
      }

      for (let r = 0; r < maxRows; r++) {
        // Vary seat counts for more realistic theater layout
        let actualSeatsInRow = seatsPerRow;

        // For back section, keep consistent width
        if (section !== "B") {
          actualSeatsInRow =
            section === "C"
              ? seatsPerRow
              : Math.max(8, seatsPerRow - Math.floor(r / 2));
        }

        for (let s = 1; s <= actualSeatsInRow; s++) {
          // Generate seat with appropriate type based on location
          let type_id = 1; // Default type

          if (section === "L" || section === "R") {
            if (r < 2) type_id = 2; // Purple
            else if (r < 4) type_id = 3; // Orange
            else type_id = 4; // Yellow
          } else if (section === "C") {
            if (r < 7) type_id = 1; // Black
            else type_id = 3; // Orange
          } else if (section === "F") {
            type_id = 5; // Yellow (VIP front)
          } else if (section === "B") {
            type_id = 6; // Green (back)
          }

          // Create some patterns of booked seats
          const isBooked =
            (r % 3 === 0 && s % 5 === 0) ||
            (r % 5 === 0 && s % 4 === 0) ||
            (section === "C" && r === 3 && s > 5 && s < 15);

          sampleSeats.push({
            id: id++,
            name: `${section}${rows[r]}${s}`,
            state: isBooked ? 1 : 0, // Some seats booked in patterns
            type_id,
          });
        }
      }
    });

    return sampleSeats;
  };

  useEffect(() => {
    setMTypes([]);
    TYPE_COLORS.forEach((color, index) => {
      let temp = color;
      setMTypes((prev: any) => [
        ...prev,
        {
          id: temp.id,
          value: colors[index],
          name: temp.name,
          price: temp.price,
        },
      ]);
    });
  }, [TYPE_COLORS]);

  // Get color for a seat based on its properties
  const getSeatColor = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    const isHovered = hoveredSeat?.id === seat.id;

    if (isSelected) {
      return "#1976D2"; // Blue for selected
    } else if (seat.state === 1) {
      return "#757575"; // Grey for booked
    } else if (seat.state === 2) {
      return "#424242"; // Dark grey for unavailable
    } else {
      // Available seats colored by type_id
      const typeColor = mTypes.find(
        (color: any) => color.id === seat.type_id
      )?.value;
      return isHovered ? "#90CAF9" : typeColor || "#4CAF50";
    }
  };

  // Handle seat click
  const handleSeatClick = (seat: Seat) => {
    if (seat.state === 0) {
      // Only allow selection of available seats
      onSeatSelect(seat);
    }
  };

  // Group seats by section and row
  const groupedSeats = React.useMemo(() => {
    const grouped: Record<string, Record<string, Seat[]>> = {};
    const allSeats = getSeats();

    allSeats.forEach((seat) => {
      const section = seat.name.charAt(0);
      const row = seat.name.charAt(1);

      if (!grouped[section]) {
        grouped[section] = {};
      }

      if (!grouped[section][row]) {
        grouped[section][row] = [];
      }

      grouped[section][row].push(seat);
    });

    // Sort seats within each row
    Object.keys(grouped).forEach((section) => {
      Object.keys(grouped[section]).forEach((row) => {
        grouped[section][row].sort((a, b) => {
          const aNum = parseInt(a.name.slice(2));
          const bNum = parseInt(b.name.slice(2));
          return aNum - bNum;
        });
      });
    });

    return grouped;
  }, [seats]);

  // Calculate seat size
  const seatSize = 20;
  const seatSpacing = 4;

  return (
    <>
      <div className="flex flex-wrap justify-center items-center mb-8 gap-2">
        {mTypes.map((type: any, idx: number) => (
          <div
            key={idx}
            className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            <div
              style={{ backgroundColor: type.value }}
              className="flex flex-col items-center p-2 rounded-lg shadow-lg text-center"
            >
              <span className="text-sm font-semibold text-white mb-0.5">
                {type.name}
              </span>
              <span className="text-base font-bold text-white">
                {type.price} KD
              </span>
            </div>
            <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      <div dir="rtl" className="flex flex-col items-center w-full">
        <div
          className="w-full bg-white md:p-4 rounded-lg overflow-hidden"
          style={{ height: "500px" }}
        >
          <TransformWrapper
            ref={transformComponentRef}
            initialScale={0.1}
            minScale={0.08}
            maxScale={3}
            centerOnInit={true}
            limitToBounds={false}
            smooth={true}
            wheel={{ step: 0.05 }}
            pinch={{ step: 5 }}
          >
            {({ zoomIn, zoomOut, resetTransform, setTransform, instance }) => (
              <>
                {/* Custom controls */}
                <div className=" top-4 left-4 z-10 flex gap-2 bg-complement-color bg-opacity-70 rounded-lg p-2">
                  <button
                    onClick={() => zoomIn(0.2)}
                    className="bg-main-color hover:bg-opacity-80 active:bg-opacity-100 transition-all rounded-lg p-2 text-complement-color"
                    aria-label="Zoom in"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => zoomOut(0.2)}
                    className="bg-main-color hover:bg-opacity-80 active:bg-opacity-100 transition-all rounded-lg p-2 text-complement-color"
                    aria-label="Zoom out"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => resetTransform()}
                    className="bg-main-color hover:bg-opacity-80 active:bg-opacity-100 transition-all rounded-lg p-2 text-complement-color"
                    aria-label="Reset view"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    className="flex justify-center items-center absolute"
                    style={{
                      transform: "translate(-50%, -50%)",
                      left: "50%",
                      top: "50%",
                    }}
                  >
                    {/* STAGE SECTION */}
                    <div className="flex justify-center items-center rotate-90">
                      <div className="bg-gray-700 py-3 px-16 text-center rounded">
                        <div className="text-white font-bold text-2xl">
                          المسرح
                        </div>
                        <div className="text-white  text-xl">STAGE</div>
                      </div>
                    </div>
                    {/* MAIN CENTER SECTION */}
                    <div className="flex flex-col items-between justify-between w-full ">
                      {/* TOP*/}
                      <div className="flex justify-center items-end w-full mb-12  gap-10">
                        {/* Right 1 (A,j) */}
                        <div className="pb-6">
                          <div className="mb-3">
                            {Object.keys(groupedSeats.j || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`j${row}`}
                                  className="flex justify-around px-2"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.j[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="">
                            {Object.keys(groupedSeats.A || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`A${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.A[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Right 2 (B,C,k) */}
                        <div>
                          <div className="flex flex-col gap-2">
                            {Object.keys(groupedSeats.k || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`k${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.k[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className=" my-7">
                            {Object.keys(groupedSeats.C || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`C${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.C[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="">
                            {Object.keys(groupedSeats.B || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`B${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.B[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Right 3 (D,E,l) */}
                        <div>
                          <div className="flex flex-col gap-2">
                            {Object.keys(groupedSeats.l || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`l${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.l[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className=" my-7">
                            {Object.keys(groupedSeats.E || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`E${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.E[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="">
                            {Object.keys(groupedSeats.D || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`D${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.D[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Right 4 (F,m) */}
                        <div className="pb-6">
                          <div className="mb-3">
                            {Object.keys(groupedSeats.m || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`m${row}`}
                                  className="flex justify-around px-2"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.m[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="">
                            {Object.keys(groupedSeats.F || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`F${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.F[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Right 5 (H,n) */}
                        <div className="flex flex-col self-start pt-8">
                          <div className="mb-8 skew-x-12">
                            {Object.keys(groupedSeats.n || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`n${row}`}
                                  className="flex justify-end px-2"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.n[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="rotate-180">
                            {Object.keys(groupedSeats.H || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`H${row}`}
                                  className="flex justify-end "
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.H[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      {/* Center */}
                      <div className="flex flex-col justify-center items-start w-full">
                        {/* First row */}
                        <div className="flex justify-around w-full">
                          {/*  (Y,f) */}
                          <div className="-rotate-90">
                            <div className="rotate-180">
                              {Object.keys(groupedSeats.Y || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`Y${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.Y[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                            <div className="mt-6">
                              {Object.keys(groupedSeats.f || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`f${row}`}
                                    className="flex justify-around px-2"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.f[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-b-lg transition-colors"
                                        style={{
                                          width: `${seatSize + 3}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                          {/*  (b) */}
                          <div className="-rotate-90 -ml-20 ">
                            <div className="">
                              {Object.keys(groupedSeats.b || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`b${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.b[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                          {/*  (e) */}
                          <div className="-rotate-90 ml-44">
                            <div className="">
                              {Object.keys(groupedSeats.e || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`e${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.e[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                        {/* Second row */}
                        <div className="flex justify-around w-full">
                          {/*  (X,h) */}
                          <div className="-rotate-90">
                            <div className="rotate-180">
                              {Object.keys(groupedSeats.X || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`X${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.X[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                            <div className="mt-6">
                              {Object.keys(groupedSeats.h || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`h${row}`}
                                    className="flex justify-around px-2"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.h[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-b-lg transition-colors"
                                        style={{
                                          width: `${seatSize + 3}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                          {/*  (a) */}
                          <div className="-rotate-90  -ml-20 ">
                            <div className="">
                              {Object.keys(groupedSeats.a || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`a${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.a[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                          {/*  (e) */}
                          <div className="-rotate-90 flex items-end pb-12  ml-44">
                            <div className="">
                              {Object.keys(groupedSeats.d || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`d${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.d[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                        {/* third row */}
                        <div className="flex justify-around w-full">
                          {/*  (W,i) */}
                          <div className="-rotate-90">
                            <div className="rotate-180">
                              {Object.keys(groupedSeats.W || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`W${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.W[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                            <div className="mt-6">
                              {Object.keys(groupedSeats.i || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`i${row}`}
                                    className="flex justify-around px-2"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.i[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-b-lg transition-colors"
                                        style={{
                                          width: `${seatSize + 3}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                          {/*  (Z) */}
                          <div className="-rotate-90  -ml-20 ">
                            <div className="">
                              {Object.keys(groupedSeats.Z || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`Z${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.Z[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                          {/*  (c) */}
                          <div className="-rotate-90  ml-44">
                            <div className="">
                              {Object.keys(groupedSeats.c || {})
                                .sort()
                                .map((row, rowIndex) => (
                                  <div
                                    key={`c${row}`}
                                    className="flex justify-end"
                                    style={{
                                      marginBottom: `${seatSpacing}px`,
                                      transform: `translateY(${
                                        rowIndex * 3
                                      }px) perspective(300px) rotateX(${
                                        5 + rowIndex * 0.5
                                      }deg)`,
                                    }}
                                  >
                                    {groupedSeats.c[row].map((seat) => (
                                      <div
                                        key={seat.id}
                                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                        style={{
                                          width: `${seatSize}px`,
                                          height: `${seatSize}px`,
                                          backgroundColor: getSeatColor(seat),
                                          margin: `3px ${seatSpacing / 2}px`,
                                          border:
                                            "1px solid rgba(255,255,255,0.2)",
                                          boxShadow:
                                            hoveredSeat?.id === seat.id
                                              ? "0 0 5px rgba(255,255,255,0.5)"
                                              : "none",
                                        }}
                                        onClick={() => handleSeatClick(seat)}
                                        onMouseEnter={() =>
                                          setHoveredSeat(seat)
                                        }
                                        onMouseLeave={() =>
                                          setHoveredSeat(null)
                                        }
                                        title={`${seat.name} - ${
                                          seat.state === 1
                                            ? "Booked"
                                            : seat.state === 2
                                            ? "Unavailable"
                                            : "Available"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* BOTTOM*/}
                      <div className="flex justify-center items-start w-full mb-12 gap-8">
                        {/* Right 1 (V,_A) */}
                        <div className="">
                          <div className="">
                            {Object.keys(groupedSeats.V || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`V${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.V[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="mt-16">
                            {Object.keys(groupedSeats.j || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`j${row}`}
                                  className="flex justify-around px-2"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.j[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Right 2 (_C,U,z) */}
                        <div>
                          {/* _C */}
                          <div className="">
                            {Object.keys(groupedSeats.B || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`B${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.B[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className=" my-7">
                            {Object.keys(groupedSeats.U || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`U${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.U[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="flex flex-col gap-2 pt-3">
                            {Object.keys(groupedSeats.z || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`z${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.z[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Right 3 (_B,T,y) */}
                        <div>
                          {/* _B */}
                          <div className="">
                            {Object.keys(groupedSeats.D || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`D${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.D[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className=" my-7">
                            {Object.keys(groupedSeats.T || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`T${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.T[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="flex flex-col gap-2 pt-3">
                            {Object.keys(groupedSeats.y || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`y${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.y[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Right 4 (S,x) */}
                        <div>
                          <div className="">
                            {Object.keys(groupedSeats.S || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`S${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.S[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="mt-16">
                            {Object.keys(groupedSeats.x || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`x${row}`}
                                  className="flex justify-around px-2"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.x[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Right 5 (H,n) */}
                        <div className="flex flex-col self-end pt-8">
                          <div className="">
                            {Object.keys(groupedSeats.H || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`H${row}`}
                                  className="flex justify-start "
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.H[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="mt-8 -skew-x-12 rotate-180">
                            {Object.keys(groupedSeats.n || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`n${row}`}
                                  className="flex justify-start px-2"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.n[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* MAIN LEFT SECTION */}
                    <div className="flex flex-col justify-center items-center h-full w-full">
                      {/* top*/}
                      <div className="flex flex-row items-end justify-start w-full gap-20 -mr-28 -rotate-45">
                        {/* Left-Top 1 (I,o) */}
                        <div className="">
                          <div className="flex flex-col gap-2">
                            {Object.keys(groupedSeats.o || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`o${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.o[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className=" mt-10  rotate-180">
                            {Object.keys(groupedSeats.I || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`I${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.I[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Left-Top 2 (K,q) */}
                        <div className="">
                          <div className="flex flex-col gap-2">
                            {Object.keys(groupedSeats.o || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`o${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.o[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className=" mt-10  rotate-180">
                            {Object.keys(groupedSeats.I || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`I${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.I[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      {/* Center*/}
                      <div className="flex flex-col justify-center items-end w-full ">
                        {/* Left 1 (q,K) */}
                        <div className="flex flex-col items-end justify-start -rotate-90 -ml-10">
                          <div className="mb-8  rotate-180">
                            {Object.keys(groupedSeats.q || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`q${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.q[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="rotate-180">
                            {Object.keys(groupedSeats.K || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`K${row}`}
                                  className="flex justify-start "
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.K[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Left 2 (A,j) */}
                        <div className=" -rotate-90">
                          <div className="mb-3">
                            {Object.keys(groupedSeats.r || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`r${row}`}
                                  className="flex justify-around px-2"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.r[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="">
                            {Object.keys(groupedSeats.L || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`L${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.L[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Left 3 (A,j) */}
                        <div className=" -rotate-90">
                          <div className="mb-3">
                            {Object.keys(groupedSeats.r || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`r${row}`}
                                  className="flex justify-around px-2"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.r[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="">
                            {Object.keys(groupedSeats.L || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`L${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.L[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                        {/* Left 4 (t,N) */}
                        <div className="flex flex-col items-end justify-start -rotate-90 -ml-10">
                          <div className="mb-8  rotate-180">
                            {Object.keys(groupedSeats.t || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`t${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.t[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className="rotate-180">
                            {Object.keys(groupedSeats.N || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`N${row}`}
                                  className="flex justify-end "
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.N[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                      {/* Bottom*/}
                      <div className="flex flex-row items-start justify-end w-full gap-20 -mr-28  -rotate-[135deg]">
                        {/* Left-Top 1 (I,o) */}
                        <div className="">
                          <div className="flex flex-col gap-2">
                            {Object.keys(groupedSeats.o || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`o${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.o[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className=" mt-10  rotate-180">
                            {Object.keys(groupedSeats.I || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`I${row}`}
                                  className="flex justify-start"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.I[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Left-Top 2 (Q,v) */}
                        <div className="">
                          <div className="flex flex-col gap-2">
                            {Object.keys(groupedSeats.v || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`v${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.v[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                          <div className=" mt-10  rotate-180">
                            {Object.keys(groupedSeats.I || {})
                              .sort()
                              .map((row, rowIndex) => (
                                <div
                                  key={`I${row}`}
                                  className="flex justify-end"
                                  style={{
                                    marginBottom: `${seatSpacing}px`,
                                    transform: `translateY(${
                                      rowIndex * 3
                                    }px) perspective(300px) rotateX(${
                                      5 + rowIndex * 0.5
                                    }deg)`,
                                  }}
                                >
                                  {groupedSeats.I[row].map((seat) => (
                                    <div
                                      key={seat.id}
                                      className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                                      style={{
                                        width: `${seatSize}px`,
                                        height: `${seatSize}px`,
                                        backgroundColor: getSeatColor(seat),
                                        margin: `3px ${seatSpacing / 2}px`,
                                        border:
                                          "1px solid rgba(255,255,255,0.2)",
                                        boxShadow:
                                          hoveredSeat?.id === seat.id
                                            ? "0 0 5px rgba(255,255,255,0.5)"
                                            : "none",
                                      }}
                                      onClick={() => handleSeatClick(seat)}
                                      onMouseEnter={() => setHoveredSeat(seat)}
                                      onMouseLeave={() => setHoveredSeat(null)}
                                      title={`${seat.name} - ${
                                        seat.state === 1
                                          ? "Booked"
                                          : seat.state === 2
                                          ? "Unavailable"
                                          : "Available"
                                      }`}
                                    />
                                  ))}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        {/* Mobile-friendly instruction */}
        <div className="mt-2 text-sm text-gray-500 flex items-center justify-center gap-2">
          <span className="hidden md:inline">Drag to pan</span>
          <span className="hidden md:inline">•</span>
          <span>Pinch or scroll to zoom</span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
            <span className="text-sm text-gray-700">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
            <span className="text-sm text-gray-700">Booked</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-700 mr-2"></div>
            <span className="text-sm text-gray-700">Unavailable</span>
          </div>

          {/* Color legend for seat types */}
          {mTypes.map((color: any) => (
            <div key={color.id} className="flex items-center">
              <div
                className="w-4 h-4 rounded-full mr-2"
                style={{ backgroundColor: color.value }}
              ></div>
              <span className="text-sm text-gray-700">{color.name}</span>
            </div>
          ))}
        </div>

        {/* Seat count info */}
        <div className="mt-4 text-sm text-gray-600">
          {selectedSeats.length > 0 ? (
            <span>
              Selected seats: {selectedSeats.map((s) => s.name).join(", ")}
            </span>
          ) : (
            <span>No seats selected</span>
          )}
        </div>
      </div>
    </>
  );
};

export default SeatMap;
