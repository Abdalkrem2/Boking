import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/router";
import Arena from "./Arena";
import { IoIosArrowForward } from "react-icons/io";

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
function ArenaSection({ number, types, seats }: HallSectionProps) {
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
      <div className="relative sm:px-10 md:px-20 lg:px-32">
        <div className="">
          <Arena
            TYPE_COLORS={getTypeColors(types)}
            seats={processedSeats}
            onSeatSelect={handleSeatSelect}
            selectedSeats={selectedSeats}
          />
        </div>
        {selectedSeats.length > 0 && (
          <div
            dir="ltr"
            className="fixed bottom-7 left-1/2 transform -translate-x-1/2 w-full flex justify-center items-center"
          >
            <div
              onClick={() => {
                localStorage.removeItem("selectedSeats");
                localStorage.setItem(
                  "selectedSeats",
                  JSON.stringify(selectedSeats)
                );

                router.push("/checkout");
              }}
              className={`cursor-pointer w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 flex items-center justify-between py-2 px-4 shadow-lg rounded-3xl bg-blue-700 hover:bg-blue-600 text-white  font-semibold transition-colors duration-200`}
            >
              <span>
                Checkout <b>{getTotalPrice()} KD</b>
              </span>
              <span>
                <IoIosArrowForward className="w-5 h-5" />
              </span>
            </div>
          </div>
        )}
      </div>
    );
  } else return <p className="text-main-color p-4 font-bold">Hall Not Found</p>;
}

export default ArenaSection;
