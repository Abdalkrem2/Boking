import React, { useEffect, useRef, useState } from "react";

interface Seat {
  id: number;
  name: string;
  state: number;
  type_id: number;
}

interface SeatMap2Props {
  seats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  selectedSeats: Seat[];
  TYPE_COLORS: { id: number; value: string; name: string; price: number }[];
}

const colors = ["#EF0444", "#EC4899", "#ECC94B", "#48BB78", "#8F8FF6"];

const SeatMap4: React.FC<SeatMap2Props> = ({
  seats = [],
  onSeatSelect,
  selectedSeats = [],
  TYPE_COLORS = [],
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [mTypes, setMTypes] = useState<any>([]);
  const [scale, setScale] = useState(0.35);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

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
      "Q",
      "R",
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

  // Handle mouse wheel zoom
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.2, scale + delta), 1.5);
    setScale(newScale);
  };

  // Handle touch zoom
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setStartPosition({ x: distance, y: 0 });
    } else if (e.touches.length === 1) {
      setIsDragging(true);
      setStartPosition({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      const delta = (distance - startPosition.x) * 0.005;
      const newScale = Math.min(Math.max(0.2, scale + delta), 1.5);
      setScale(newScale);
      setStartPosition({ x: distance, y: 0 });
    } else if (isDragging) {
      setPosition({
        x: e.touches[0].clientX - startPosition.x,
        y: e.touches[0].clientY - startPosition.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Handle mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners
  useEffect(() => {
    const mapElement = mapRef.current;
    if (mapElement) {
      mapElement.addEventListener("wheel", handleWheel, { passive: false });
      mapElement.addEventListener("touchstart", handleTouchStart);
      mapElement.addEventListener("touchmove", handleTouchMove);
      mapElement.addEventListener("touchend", handleTouchEnd);

      return () => {
        mapElement.removeEventListener("wheel", handleWheel);
        mapElement.removeEventListener("touchstart", handleTouchStart);
        mapElement.removeEventListener("touchmove", handleTouchMove);
        mapElement.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [scale, position, isDragging, startPosition]);

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

  const handleSeatClick = (seat: Seat) => {
    if (seat.state === 0) {
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

  const seatSize = 24;
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
      <div
        dir="rtl"
        className="flex flex-col items-center w-full"
        ref={containerRef}
      >
        <div className="w-full bg-gray-900 p-2 md:p-4 rounded-lg overflow-hidden h-60">
          <div
            ref={mapRef}
            className="relative w-full h-full flex justify-center items-center cursor-move"
            style={{
              overflow: "hidden",
              touchAction: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              className="min-w-full"
              style={{
                minWidth: "800px",
                paddingBottom: "20px",
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: "center center",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            >
              {/* Stage */}
              <div className="flex justify-center mb-8">
                <div className="bg-gray-700 py-3 px-16 w-4/5 text-center rounded">
                  <div className="text-white font-bold">المسرح</div>
                  <div className="text-white text-sm">STAGE</div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                {/* Main theater sections */}
                <div className="flex justify-center w-full mb-12 gap-20">
                  {/* Left section */}
                  <div className="mx-4">
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
                        </div>
                      ))}
                  </div>

                  {/* Right section */}
                  <div className="mx-4">
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
                        </div>
                      ))}
                  </div>
                </div>
              </div>
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
          {mTypes.map((color: any) => (
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
    </>
  );
};

export default SeatMap4;
