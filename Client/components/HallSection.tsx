import { useState } from "react";
import SeatMap from "./SeatMap";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";
import SeatMap2 from "./SeatMap2";
import SeatMap3 from "./SeatMap3";
import SeatMap4 from "./SeatMap4";
import SeatMapKing from "./SeatMapKing";

interface Seat {
  id: number;
  name: string;
  state: number;
  type_id: number;
  section?: string;
  row?: number;
  seatNumber?: number;
}

interface Type {
  id: number;
  name: string;
  price: number;
  color: string;
}

interface HallSectionProps {
  number: number;
  types: Type[];
  seats: Seat[];
}
const allColors = [
  "#B7791F", // Gold
];
function HallSection({ number, types, seats }: HallSectionProps) {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSeatSelect = (seat: Seat) => {
    setSelectedSeats((prev) => {
      const isSelected = prev.find((s) => s.id === seat.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== seat.id);
      }
      const seatType = types.find((type) => type.id === seat.type_id);
      return [
        ...prev,
        {
          id: seat.id,
          name: seat.name,
          state: seat.state,
          type_id: seat.type_id,
          section: seat.section,
          row: seat.row,
          seatNumber: seat.seatNumber,
          price: seatType?.price,
          color: seatType?.color,
          type_name: seatType?.name,
        },
      ];
    });
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      const seatType = types.find((type) => type.id === seat.type_id);
      return total + (seatType?.price || 0);
    }, 0);
  };

  const getTypeColors = (types: Type[]) => {
    const colors: any = [];
    types.forEach((type) => {
      colors.push({
        id: type.id,
        value: allColors[0],
        name: type.name,
        price: type.price,
      });
    });
    return colors;
  };

  // Process seats data for SeatMap2 if it's number 2
  const processSeatsForMap2 = (seats: Seat[]) => {
    if (number !== 2) return seats;

    return seats.map((seat) => {
      // Parse the seat name to extract section, row, and seat number
      // Format example: "L2-5" for Section L, Row 2, Seat 5
      const nameParts = seat.name.match(/([A-Z])(\d+)-(\d+)/);

      if (nameParts) {
        return {
          ...seat,
          section: nameParts[1],
          row: parseInt(nameParts[2]),
          seatNumber: parseInt(nameParts[3]),
        };
      }

      // Fallback to legacy format parsing if needed
      // Format example: "LA1" for Section L, Row A, Seat 1
      const legacyParts = seat.name.match(/([A-Z])([A-Z])(\d+)/);
      if (legacyParts) {
        // Convert letter row to number (A=1, B=2, etc.)
        const rowNumber = legacyParts[2].charCodeAt(0) - 64;

        return {
          ...seat,
          section: legacyParts[1],
          row: rowNumber,
          seatNumber: parseInt(legacyParts[3]),
        };
      }

      return seat;
    });
  };

  // Process the seats based on the hall section number
  const processedSeats = processSeatsForMap2(seats);

  if (number == 1) {
    return (
      <div className="my-10 px-4 sm:px-10 md:px-20 lg:px-32">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-200">
              Select Your Seats
            </h2>
            <p className="text-gray-400">Choose from available seats below</p>
          </div>

          <SeatMap
            TYPE_COLORS={getTypeColors(types)}
            seats={processedSeats}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
          />

          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-200">
                  Selected Seats
                </h3>
                <p className="text-gray-400 mt-1">
                  {selectedSeats.length > 0
                    ? selectedSeats.map((seat) => seat.name).join(", ")
                    : "No seats selected"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Total Price</p>
                <p className="text-2xl font-bold text-gray-200">
                  KD {getTotalPrice()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("selectedSeats");
                localStorage.setItem(
                  "selectedSeats",
                  JSON.stringify(selectedSeats)
                );

                router.push("/checkout");
              }}
              disabled={selectedSeats.length === 0}
              className={`w-full mt-6 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg
                ${
                  selectedSeats.length > 0
                    ? "bg-main-color hover:bg-secondary-color"
                    : "bg-gray-600 cursor-not-allowed"
                } text-complement-color  font-semibold transition-colors duration-200`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (number === 2) {
    return (
      <div className="my-10 px-4 sm:px-10 md:px-20 lg:px-32">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-200">
              Select Your Seats
            </h2>
            <p className="text-gray-400">Choose from available seats below</p>
          </div>

          <SeatMap2
            TYPE_COLORS={getTypeColors(types)}
            seats={processedSeats}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
          />

          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-200">
                  Selected Seats
                </h3>
                <p className="text-gray-400 mt-1">
                  {selectedSeats.length > 0
                    ? selectedSeats.map((seat) => seat.name).join(", ")
                    : "No seats selected"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Total Price</p>
                <p className="text-2xl font-bold text-gray-200">
                  ${getTotalPrice()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("selectedSeats");
                localStorage.setItem(
                  "selectedSeats",
                  JSON.stringify(selectedSeats)
                );

                router.push("/checkout");
              }}
              disabled={selectedSeats.length === 0}
              className={`w-full mt-6 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg
                ${
                  selectedSeats.length > 0
                    ? "bg-main-color hover:bg-secondary-color"
                    : "bg-gray-600 cursor-not-allowed"
                } text-complement-color  font-semibold transition-colors duration-200`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (number == 3) {
    return (
      <div className="my-10 px-4 sm:px-10 md:px-20 lg:px-32">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-200">
              Select Your Seats
            </h2>
            <p className="text-gray-400">Choose from available seats below</p>
          </div>

          <SeatMap3
            TYPE_COLORS={getTypeColors(types)}
            seats={processedSeats}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
          />

          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-200">
                  Selected Seats
                </h3>
                <p className="text-gray-400 mt-1">
                  {selectedSeats.length > 0
                    ? selectedSeats.map((seat) => seat.name).join(", ")
                    : "No seats selected"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Total Price</p>
                <p className="text-2xl font-bold text-gray-200">
                  KD {getTotalPrice()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("selectedSeats");
                localStorage.setItem(
                  "selectedSeats",
                  JSON.stringify(selectedSeats)
                );

                router.push("/checkout");
              }}
              disabled={selectedSeats.length === 0}
              className={`w-full mt-6 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg
                ${
                  selectedSeats.length > 0
                    ? "bg-main-color hover:bg-secondary-color"
                    : "bg-gray-600 cursor-not-allowed"
                } text-complement-color  font-semibold transition-colors duration-200`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (number == 4) {
    return (
      <div className="my-10 px-4 sm:px-10 md:px-20 lg:px-32">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-200">
              Select Your Seats
            </h2>
            <p className="text-gray-400">Choose from available seats below</p>
          </div>

          <SeatMap4
            TYPE_COLORS={getTypeColors(types)}
            seats={processedSeats}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
          />

          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-200">
                  Selected Seats
                </h3>
                <p className="text-gray-400 mt-1">
                  {selectedSeats.length > 0
                    ? selectedSeats.map((seat) => seat.name).join(", ")
                    : "No seats selected"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Total Price</p>
                <p className="text-2xl font-bold text-gray-200">
                  KD {getTotalPrice()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("selectedSeats");
                localStorage.setItem(
                  "selectedSeats",
                  JSON.stringify(selectedSeats)
                );

                router.push("/checkout");
              }}
              disabled={selectedSeats.length === 0}
              className={`w-full mt-6 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg
                ${
                  selectedSeats.length > 0
                    ? "bg-main-color hover:bg-secondary-color"
                    : "bg-gray-600 cursor-not-allowed"
                } text-complement-color  font-semibold transition-colors duration-200`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else if (number == 5) {
    return (
      <div className="my-10 px-4 sm:px-10 md:px-20 lg:px-32">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-200">
              Select Your Seats
            </h2>
            <p className="text-gray-400">Choose from available seats below</p>
          </div>

          <div className="flex flex-wrap justify-center items-center mb-8 gap-2">
            {types.map((type, idx) => (
              <div
                key={idx}
                className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div
                  style={{ backgroundColor: type.color }}
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

          <SeatMapKing
            TYPE_COLORS={getTypeColors(types)}
            seats={processedSeats}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
          />

          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-200">
                  Selected Seats
                </h3>
                <p className="text-gray-400 mt-1">
                  {selectedSeats.length > 0
                    ? selectedSeats.map((seat) => seat.name).join(", ")
                    : "No seats selected"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Total Price</p>
                <p className="text-2xl font-bold text-gray-200">
                  KD {getTotalPrice()}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("selectedSeats");
                localStorage.setItem(
                  "selectedSeats",
                  JSON.stringify(selectedSeats)
                );

                router.push("/checkout");
              }}
              disabled={selectedSeats.length === 0}
              className={`w-full mt-6 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg
                ${
                  selectedSeats.length > 0
                    ? "bg-main-color hover:bg-secondary-color"
                    : "bg-gray-600 cursor-not-allowed"
                } text-complement-color  font-semibold transition-colors duration-200`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else return <p className="text-main-color p-4 font-bold">Hall Not Found</p>;
}

export default HallSection;
