import { useState } from 'react';
import { Calendar, Users, Plus, Minus, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const availableRooms = [
  {
    id: 1,
    name: 'Beach Facing Room',
    image: 'https://images.unsplash.com/photo-1612807493760-2b5ec3b5af8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWFjaCUyMGZhY2luZyUyMHJvb218ZW58MXx8fHwxNzYyNDEwOTUwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Cozy and elegant room with a stunning lake view. Includes a private bathroom, comfortable queen-size bed, and complimentary Wi-Fi, perfect...',
    price: 100,
    maxGuests: 6,
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Family Suite',
    image: 'https://images.unsplash.com/photo-1706347042234-896cb09ed1a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBob3RlbCUyMHN1aXRlfGVufDF8fHx8MTc2MjQwOTk2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Spacious family accommodation with separate bedrooms, living area, and premium amenities for the perfect family getaway...',
    price: 180,
    maxGuests: 4,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Standard Room',
    image: 'https://images.unsplash.com/photo-1648383228240-6ed939727ad6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZGFyZCUyMGhvdGVsJTIwcm9vbXxlbnwxfHx8fDE3NjI0MTA5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Comfortable and affordable room featuring modern amenities, perfect for couples or solo travelers...',
    price: 75,
    maxGuests: 2,
    rating: 4.3,
  },
];

type BookedRoom = {
  roomId: number;
  occupants: number;
  stayDates: string;
};

export function Booking() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookedRooms, setBookedRooms] = useState<BookedRoom[]>([]);
  const [clientName, setClientName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+265');

  const addRoom = (roomId: number) => {
    const room = availableRooms.find((r) => r.id === roomId);
    if (room) {
      setBookedRooms([
        ...bookedRooms,
        {
          roomId,
          occupants: 1,
          stayDates: '',
        },
      ]);
    }
  };

  const removeRoom = (index: number) => {
    setBookedRooms(bookedRooms.filter((_, i) => i !== index));
  };

  const updateOccupants = (index: number, change: number) => {
    const newBookedRooms = [...bookedRooms];
    const room = availableRooms.find((r) => r.id === newBookedRooms[index].roomId);
    if (room) {
      const newOccupants = newBookedRooms[index].occupants + change;
      if (newOccupants >= 1 && newOccupants <= room.maxGuests) {
        newBookedRooms[index].occupants = newOccupants;
        setBookedRooms(newBookedRooms);
      }
    }
  };

  const updateStayDates = (index: number, dates: string) => {
    const newBookedRooms = [...bookedRooms];
    newBookedRooms[index].stayDates = dates;
    setBookedRooms(newBookedRooms);
  };

  const calculateTotal = () => {
    return bookedRooms.reduce((sum, bookedRoom) => {
      const room = availableRooms.find((r) => r.id === bookedRoom.roomId);
      return sum + (room?.price || 0);
    }, 0);
  };

  const handleBooking = () => {
    if (bookedRooms.length === 0) {
      alert('Please add at least one room to your booking');
      return;
    }
    if (!clientName || !emailAddress) {
      alert('Please fill in your contact information');
      return;
    }
    alert('Booking confirmed! Thank you for choosing Anake Lodge.');
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full mb-4">
            Booking
          </div>
          <h2 className="mb-4 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
            Book Your Stay
          </h2>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-64 px-4 py-3 rounded-lg border-2 border-slate-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none bg-white"
          >
            <option value="All">All</option>
            <option value="Beach Facing">Beach Facing</option>
            <option value="Family">Family</option>
            <option value="Standard">Standard</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Rooms */}
          <div className="lg:col-span-2 space-y-6">
            {availableRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-72 h-64 md:h-auto flex-shrink-0">
                    <ImageWithFallback
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-slate-900 mb-1" style={{ fontFamily: 'Changa One, cursive' }}>
                          Room {room.id}
                        </h3>
                        <h4 className="text-slate-900 mb-2" style={{ fontFamily: 'Changa One, cursive' }}>
                          {room.name}
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            bookedRooms.some((b) => b.roomId === room.id)
                              ? 'bg-red-100 text-red-600'
                              : 'bg-green-100 text-green-600'
                          }`}
                        >
                          {bookedRooms.some((b) => b.roomId === room.id) ? 'Booked' : ''}
                        </span>
                        <button
                          onClick={() => {}}
                          className="text-green-600 hover:text-green-700 underline"
                        >
                          View details
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-4">{room.description}</p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-slate-600">{room.name} • Max {room.maxGuests} guests</span>
                    </div>

                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(room.rating) ? 'text-yellow-400' : 'text-slate-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-slate-600">({room.rating})</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-green-600" style={{ fontFamily: 'Changa One, cursive', fontSize: '1.5rem' }}>
                          ${room.price}
                        </span>
                        <span className="text-slate-600">/ night</span>
                      </div>
                      <button
                        onClick={() => addRoom(room.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        Book this Room
                      </button>
                    </div>
                  </div>
                </div>

                {/* Booked Room Details */}
                {bookedRooms
                  .map((bookedRoom, index) => ({ ...bookedRoom, index }))
                  .filter((br) => br.roomId === room.id)
                  .map((bookedRoom) => (
                    <div
                      key={bookedRoom.index}
                      className="border-t border-slate-200 p-6 bg-green-50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
                          Booking Details
                        </h5>
                        <button
                          onClick={() => removeRoom(bookedRoom.index)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-700 mb-2">Stay Dates:</label>
                          <input
                            type="text"
                            placeholder="Select date range"
                            value={bookedRoom.stayDates}
                            onChange={(e) => updateStayDates(bookedRoom.index, e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 mb-2"># Occupants:</label>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => updateOccupants(bookedRoom.index, -1)}
                              className="w-10 h-10 rounded-lg bg-white border-2 border-slate-300 hover:border-green-500 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              value={bookedRoom.occupants}
                              readOnly
                              className="w-20 px-4 py-2 rounded-lg border border-slate-300 text-center"
                            />
                            <button
                              onClick={() => updateOccupants(bookedRoom.index, 1)}
                              className="w-10 h-10 rounded-lg bg-white border-2 border-slate-300 hover:border-green-500 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-slate-600">Total:</span>
                        <span className="text-green-600" style={{ fontFamily: 'Changa One, cursive', fontSize: '1.25rem' }}>
                          $ {room.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <h3 className="mb-6 text-slate-900" style={{ fontFamily: 'Changa One, cursive' }}>
                Booked Rooms
              </h3>

              {bookedRooms.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-500">No booked rooms.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                    {bookedRooms.map((bookedRoom, index) => {
                      const room = availableRooms.find((r) => r.id === bookedRoom.roomId);
                      return (
                        <div key={index} className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-slate-900">{room?.name}</div>
                            <div className="text-sm text-slate-500">
                              {bookedRoom.occupants} guest{bookedRoom.occupants > 1 ? 's' : ''}
                            </div>
                          </div>
                          <div className="text-slate-900">${room?.price}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mb-6 pb-6 border-b border-slate-200">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-600">Total:</span>
                      <span className="text-green-600" style={{ fontFamily: 'Changa One, cursive', fontSize: '1.5rem' }}>
                        $ {calculateTotal()}
                      </span>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-slate-700 mb-2">Client Name</label>
                      <input
                        type="text"
                        placeholder="Enter client name"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-2">Phone Number</label>
                      <div className="flex gap-2">
                        <select
                          value={countryCode}
                          onChange={(e) => setCountryCode(e.target.value)}
                          className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-900 text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                        >
                          <option value="+265">+265</option>
                          <option value="+1">+1</option>
                          <option value="+44">+44</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="Phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg transition-colors"
                  >
                    Complete Booking
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
