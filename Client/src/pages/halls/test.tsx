// pages/booking/index.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import SeatMap from "../../../components/SeatMap";
import { Seat, SeatStatus } from "../../../types";
import Head from "next/head";

const generateSeats = (): Seat[] => {
  const rows = ["A", "B", "C", "D", "E", "F", "G"];
  const seatsPerRow = 12;
  const vipRows = 2;
  const goldRows = 3;

  return rows.flatMap((row, rowIndex) =>
    Array.from({ length: seatsPerRow }, (_, i) => {
      const seatNumber = i + 1;
      let type: "VIP" | "GOLD" | "STANDARD";
      let price: number;

      if (rowIndex < vipRows) {
        type = "VIP";
        price = 150;
      } else if (rowIndex < vipRows + goldRows) {
        type = "GOLD";
        price = 100;
      } else {
        type = "STANDARD";
        price = 50;
      }

      // Randomly book some seats (20% chance)
      const status: SeatStatus = Math.random() < 0.2 ? "booked" : "available";

      return {
        id: `${row}${seatNumber}`,
        type,
        price,
        status,
        row,
        number: seatNumber,
      };
    })
  );
};

export default function BookingPage() {
  const router = useRouter();
  const [seats, setSeats] = useState<Seat[]>(() => generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  const handleSelectSeat = (seat: Seat) => {
    if (seat.status === "booked") return;

    const updatedSeats = seats.map((s) => {
      if (s.id === seat.id) {
        const newStatus: SeatStatus =
          s.status === "selected" ? "available" : "selected";
        return { ...s, status: newStatus };
      }
      return s;
    });

    setSeats(updatedSeats);
    setSelectedSeats(updatedSeats.filter((s) => s.status === "selected"));
  };

  const handleCheckout = () => {
    // In a real app, you would save the selection and navigate to checkout
    router.push({
      pathname: "/checkout",
      query: { seats: selectedSeats.map((s) => s.id).join(",") },
    });
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <>
      <Head>
        <title>Book Your Seats | Theatre Name</title>
        <meta
          name="description"
          content="Select your preferred seats for the show"
        />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Seats</h1>
          <p className="text-gray-600 mt-2">
            Select your preferred seats from the map below
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* <SeatMap seats={seats} onSelect={handleSelectSeat} /> */}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Your Selection</h2>

            {selectedSeats.length > 0 ? (
              <>
                <ul className="space-y-3 mb-6">
                  {selectedSeats.map((seat) => (
                    <li
                      key={seat.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium">Seat {seat.id}</span>
                        <span className="text-sm text-gray-500 block capitalize">
                          {seat.type.toLowerCase()}
                        </span>
                      </div>
                      <span className="font-medium">${seat.price}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t pt-4 space-y-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${totalPrice}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Continue to Checkout
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No seats selected yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Click on available seats to add them to your selection
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
