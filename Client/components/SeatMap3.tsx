import React, { useEffect, useRef, useState } from "react";

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
  TYPE_COLORS: { id: number; value: string; name: string }[];
}

const SeatMap3: React.FC<SeatMap2Props> = ({
  seats = [],
  onSeatSelect,
  selectedSeats = [],
  TYPE_COLORS = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(0.75);

  // Generate sample seats if none provided (for demonstration)
  const getSeats = () => {
    if (seats && seats.length > 0) return seats;

    // Generate sample seats for demonstration
    const sampleSeats: Seat[] = [];
    const sections = ["L", "C", "R", "F", "B", "P", "Q"];
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

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

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
      const typeColor = TYPE_COLORS.find(
        (color) => color.id === seat.type_id
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

  // Determine the scale factor based on container width
  const scale = Math.max(0.5, Math.min(1, containerWidth / 1000)) * zoomLevel;

  // Calculate seat size based on scale
  const seatSize = Math.max(16, Math.round(20 * scale));
  const seatSpacing = Math.max(2, Math.round(4 * scale));

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center w-full"
      ref={containerRef}
    >
      {/* Zoom controls */}
      <div className="mb-2 flex justify-end w-full">
        <button
          onClick={handleZoomOut}
          className=" text-complement-color bg-white px-3 py-1  hover:bg-gray-200 text-xl font-bold"
        >
          -
        </button>
        <button
          onClick={handleZoomIn}
          className=" text-complement-color bg-white px-3 py-1  hover:bg-gray-200 ml-px text-xl font-bold"
        >
          +
        </button>
      </div>

      <div className="w-full bg-gray-900 p-2 md:p-4 rounded-lg overflow-hidden">
        <div
          className="relative w-full"
          style={{ overflowX: "auto", overflowY: "hidden" }}
        >
          <div
            className="min-w-full"
            style={{
              minWidth: "800px",
              paddingBottom: "20px",
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center top",
            }}
          >
            {/* Back section (moved to top of the layout) */}

            {/* Stage */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-700 py-3 px-16 w-4/5 text-center rounded">
                <div className="text-white font-bold">المسرح</div>
                <div className="text-white text-sm">STAGE</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              {/* Main theater sections */}
              <div className="flex justify-center w-full mb-12 gap-2">
                <div className="mx-4 skew-x-12">
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
                        <div className="text-xs text-gray-400 mr-2">{row}</div>
                        {groupedSeats.L[row].map((seat) => (
                          <div
                            key={seat.id}
                            className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                            style={{
                              width: `${seatSize}px`,
                              height: `${seatSize}px`,
                              backgroundColor: getSeatColor(seat),
                              margin: `0 ${seatSpacing / 2}px`,
                              border: "1px solid rgba(255,255,255,0.2)",
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
                        <div className="text-xs text-gray-400 ml-2">{row}</div>
                      </div>
                    ))}
                </div>
                {/* Center section */}
                <div className="mx-4">
                  {Object.keys(groupedSeats.C || {})
                    .sort()
                    .map((row, rowIndex) => (
                      <div
                        key={`C${row}`}
                        className="flex justify-center"
                        style={{
                          marginBottom: `${seatSpacing}px`,
                          transform: `translateY(${
                            rowIndex * 3
                          }px) perspective(300px) rotateX(${
                            5 + rowIndex * 0.5
                          }deg)`,
                        }}
                      >
                        <div className="text-xs text-gray-400 mr-2">{row}</div>
                        {groupedSeats.C[row].map((seat) => (
                          <div
                            key={seat.id}
                            className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                            style={{
                              width: `${seatSize}px`,
                              height: `${seatSize}px`,
                              backgroundColor: getSeatColor(seat),
                              margin: `0 ${seatSpacing / 2}px`,
                              border: "1px solid rgba(255,255,255,0.2)",
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
                        <div className="text-xs text-gray-400 ml-2">{row}</div>
                      </div>
                    ))}
                </div>

                {/* Right section */}
                <div className="mx-4 -skew-x-12">
                  {Object.keys(groupedSeats.R || {})
                    .sort()
                    .map((row, rowIndex) => (
                      <div
                        key={`R${row}`}
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
                        <div className="text-xs text-gray-400 mr-2">{row}</div>
                        {groupedSeats.R[row].map((seat) => (
                          <div
                            key={seat.id}
                            className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                            style={{
                              width: `${seatSize}px`,
                              height: `${seatSize}px`,
                              backgroundColor: getSeatColor(seat),
                              margin: `0 ${seatSpacing / 2}px`,
                              border: "1px solid rgba(255,255,255,0.2)",
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
                        <div className="text-xs text-gray-400 ml-2">{row}</div>
                      </div>
                    ))}
                </div>
              </div>
              {/* Front section */}
              <div className="mx-4 my-10">
                <div className="text-sm text-gray-500 text-center mb-1">
                  Front Section
                </div>
                {Object.keys(groupedSeats.F || {})
                  .sort()
                  .map((row, rowIndex) => (
                    <div
                      key={`F${row}`}
                      className="flex justify-center"
                      style={{
                        marginBottom: `${seatSpacing}px`,
                        transform: `translateY(${
                          rowIndex * 3
                        }px) perspective(300px) rotateX(${
                          5 + rowIndex * 0.5
                        }deg)`,
                      }}
                    >
                      <div className="text-xs text-gray-400 mr-2">{row}</div>
                      {groupedSeats.F[row].map((seat) => (
                        <div
                          key={seat.id}
                          className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                          style={{
                            width: `${seatSize}px`,
                            height: `${seatSize}px`,
                            backgroundColor: getSeatColor(seat),
                            margin: `0 ${seatSpacing / 2}px`,
                            border: "1px solid rgba(255,255,255,0.2)",
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
                      <div className="text-xs text-gray-400 ml-2">{row}</div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex justify-center w-full mt-5 gap-2">
              <div className="mx-4 skew-x-12">
                {Object.keys(groupedSeats.Q || {})
                  .sort()
                  .map((row, rowIndex) => (
                    <div
                      key={`Q${row}`}
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
                      <div className="text-xs text-gray-400 mr-2">{row}</div>
                      {groupedSeats.Q[row].map((seat) => (
                        <div
                          key={seat.id}
                          className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                          style={{
                            width: `${seatSize}px`,
                            height: `${seatSize}px`,
                            backgroundColor: getSeatColor(seat),
                            margin: `0 ${seatSpacing / 2}px`,
                            border: "1px solid rgba(255,255,255,0.2)",
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
                      <div className="text-xs text-gray-400 ml-2">{row}</div>
                    </div>
                  ))}
              </div>
              {/* Center section */}
              <div className="mx-4">
                {Object.keys(groupedSeats.B || {})
                  .sort()
                  .map((row, rowIndex) => (
                    <div
                      key={`B${row}`}
                      className="flex justify-center"
                      style={{
                        marginBottom: `${seatSpacing}px`,
                        transform: `translateY(${
                          rowIndex * 3
                        }px) perspective(300px) rotateX(${
                          5 + rowIndex * 0.5
                        }deg)`,
                      }}
                    >
                      <div className="text-xs text-gray-400 mr-2">{row}</div>
                      {groupedSeats.B[row].map((seat) => (
                        <div
                          key={seat.id}
                          className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                          style={{
                            width: `${seatSize}px`,
                            height: `${seatSize}px`,
                            backgroundColor: getSeatColor(seat),
                            margin: `0 ${seatSpacing / 2}px`,
                            border: "1px solid rgba(255,255,255,0.2)",
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
                      <div className="text-xs text-gray-400 ml-2">{row}</div>
                    </div>
                  ))}
              </div>

              {/* Right section */}
              <div className="mx-4 -skew-x-12">
                {Object.keys(groupedSeats.P || {})
                  .sort()
                  .map((row, rowIndex) => (
                    <div
                      key={`P${row}`}
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
                      <div className="text-xs text-gray-400 mr-2">{row}</div>
                      {groupedSeats.P[row].map((seat) => (
                        <div
                          key={seat.id}
                          className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                          style={{
                            width: `${seatSize}px`,
                            height: `${seatSize}px`,
                            backgroundColor: getSeatColor(seat),
                            margin: `0 ${seatSpacing / 2}px`,
                            border: "1px solid rgba(255,255,255,0.2)",
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
                      <div className="text-xs text-gray-400 ml-2">{row}</div>
                    </div>
                  ))}
              </div>
            </div>
            {/* <div className="mb-12">
              <div className="text-sm text-gray-500 text-center mb-1">
                Back Section
              </div>
              {Object.keys(groupedSeats.B || {})
                .sort()
                .map((row, rowIndex) => (
                  <div
                    key={`B${row}`}
                    className="flex justify-center"
                    style={{
                      marginBottom: `${seatSpacing}px`,
                      transform: `perspective(300px) rotateX(${
                        15 + rowIndex
                      }deg)`,
                    }}
                  >
                    <div className="text-xs text-gray-400 mr-2">{row}</div>
                    {groupedSeats.B[row].map((seat) => (
                      <div
                        key={seat.id}
                        className="flex items-center justify-center cursor-pointer rounded-full transition-colors"
                        style={{
                          width: `${seatSize}px`,
                          height: `${seatSize}px`,
                          backgroundColor: getSeatColor(seat),
                          margin: `0 ${seatSpacing / 2}px`,
                          border: "1px solid rgba(255,255,255,0.2)",
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
                    <div className="text-xs text-gray-400 ml-2">{row}</div>
                  </div>
                ))}
            </div> */}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-6 justify-center">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          <span className="text-sm text-gray-300">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gray-500 mr-2"></div>
          <span className="text-sm text-gray-300">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gray-700 mr-2"></div>
          <span className="text-sm text-gray-300">Unavailable</span>
        </div>

        {/* Color legend for seat types */}
        {TYPE_COLORS.map((color) => (
          <div key={color.id} className="flex items-center">
            <div
              className="w-4 h-4 rounded-full mr-2"
              style={{ backgroundColor: color.value }}
            ></div>
            <span className="text-sm text-gray-300">{color.name}</span>
          </div>
        ))}
      </div>

      {/* Seat count info */}
      <div className="mt-4 text-sm text-gray-400">
        {selectedSeats.length > 0 ? (
          <span>
            Selected seats: {selectedSeats.map((s) => s.name).join(", ")}
          </span>
        ) : (
          <span>No seats selected</span>
        )}
      </div>
    </div>
  );
};

export default SeatMap3;
