  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import {
    MapPin,
    Calendar,
    Search,
    Star,
    Plane,
    Ticket,
    Gem,
    X,
    Check,
    Clock,
    Users,
    CreditCard,
    Home as HomeIcon,
    Ship,
    User,
    ChevronDown,
  } from "lucide-react";
  import Home2 from "./Home2";
  import Home3 from "./Home3";
  import Activities from "./Activities";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import fer from "../../assets/fer.png";
  import { Label } from "@/components/ui/label";
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { useAuth } from "../../context/AuthContext";
  import { API_BASE_URL } from "../../config/api";

  const heroBackgroundImage =
    "https://images.unsplash.com/photo-1545579133-99bb5ab189bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyb3BpY2FsJTIwaXNsYW5kfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000";

  const RAZORPAY_KEY_ID = "rzp_test_OlyfdB3oCc0K71";

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const customFontStyle = {
    fontFamily: "'Neue Montreal Regular', sans-serif",
    fontWeight: 600,
    fontStyle: "normal",
  };

  const customFontStyle2 = {
    fontFamily: "'Travel October', sans-serif",
    fontWeight: 600,
    fontStyle: "normal",
  };

  const FeatureCard = ({ icon, title, description }) => (
    <div className="flex flex-col items-center md:items-start text-center md:text-left">
      <div className="bg-[#F1F0FE] p-3 rounded-xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </div>
  );

  const Alert = ({ type = "info", message, onClose }) => {
    const colors = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    return (
      <div className={`border rounded-lg p-4 mb-4 ${colors[type]}`}>
        <div className="flex justify-between items-start">
          <p className="text-sm">{message}</p>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 font-bold text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  };

  const LoadingSpinner = ({ size = "md" }) => {
    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    return (
      <div className="flex justify-center items-center">
        <div
          className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]}`}
        ></div>
      </div>
    );
  };

  const ScheduleCard = ({ schedule, passengers, travelDate, onSelectClass }) => {
    const [expanded, setExpanded] = useState(false);

    const calculateDuration = (departure, arrival) => {
      const [depHour, depMin] = departure.split(":").map(Number);
      const [arrHour, arrMin] = arrival.split(":").map(Number);

      let totalMinutes = arrHour * 60 + arrMin - (depHour * 60 + depMin);
      if (totalMinutes < 0) totalMinutes += 24 * 60;

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;

      return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    const journeyDuration = schedule.estimated_duration_minutes
      ? `${Math.floor(schedule.estimated_duration_minutes / 60)}h ${
          schedule.estimated_duration_minutes % 60
        }m`
      : calculateDuration(schedule.departure_time, schedule.arrival_time);

    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow w-full max-w-full">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {schedule.logo_url && (
                  <img
                    src={schedule.logo_url}
                    alt={schedule.operator_name}
                    className="h-12 w-12 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {schedule.operator_name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{schedule.ferry_name}</p>
                </div>
              </div>
              <p className="text-gray-600 mt-3 flex items-center gap-2 flex-wrap">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{schedule.departure_port} → {schedule.arrival_port}</span>
              </p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  Departs: {schedule.departure_time.slice(0, 5)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  Arrives: {schedule.arrival_time.slice(0, 5)}
                </span>
                <span className="font-medium text-blue-600">
                  {journeyDuration}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {schedule.available_seats} seats available
                </span>
                {schedule.operating_days && (
                  <span className="text-xs text-gray-500">
                    Operating: {schedule.operating_days.join(", ")}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right w-full md:w-auto">
              <p className="text-sm text-gray-500">Starting from</p>
              <p className="text-2xl font-bold text-blue-600">
                ₹
                {Math.min(
                  ...schedule.available_classes.map((c) =>
                    parseFloat(c.price_per_seat)
                  )
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {passengers} passenger(s)
              </p>
              <Button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full md:w-auto"
              >
                {expanded ? "Hide Classes" : "View Classes"}
                <ChevronDown
                  className={`ml-2 h-4 w-4 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {expanded && (
            <div className="mt-6 space-y-4 w-full">
              {schedule.available_classes &&
                schedule.available_classes.map((seatClass) => (
                  <div
                    key={seatClass.class_id}
                    className="bg-gray-50 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800">
                        {seatClass.class_name}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Available: {seatClass.available_seats || 0} seats
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {seatClass.amenities &&
                          seatClass.amenities.map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full text-gray-600"
                            >
                              <Check className="h-3 w-3 text-green-500" />
                              {amenity}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          ₹{parseFloat(seatClass.price_per_seat).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                      <Button
                        onClick={() =>
                          onSelectClass(
                            schedule.schedule_id,
                            seatClass,
                            passengers,
                            travelDate,
                            schedule
                          )
                        }
                        disabled={
                          (seatClass.available_seats || 0) < passengers
                        }
                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold w-full md:w-auto"
                      >
                        {(seatClass.available_seats || 0) < passengers
                          ? "Not Available"
                          : "Select Class"}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Booking Modal Component
  const BookingModal = ({
    isOpen,
    onClose,
    scheduleId,
    seatClass,
    passengers,
    travelDate,
    totalAmount,
    schedule,
  }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [passengerDetails, setPassengerDetails] = useState([]);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
      if (isOpen && passengers > 0) {
        setPassengerDetails(
          Array.from({ length: passengers }, () => ({
            full_name: "",
            age: "",
            gender: "Male",
            id_proof_type: "Passport",
            id_proof_number: "",
          }))
        );
      }
    }, [isOpen, passengers]);

    const handlePassengerChange = (index, field, value) => {
      const updated = [...passengerDetails];
      updated[index][field] = value;
      setPassengerDetails(updated);
    };

    const validateForm = () => {
      for (let i = 0; i < passengerDetails.length; i++) {
        const passenger = passengerDetails[i];
        if (!passenger.full_name.trim()) {
          setAlert({ type: "error", message: `Please enter full name for passenger ${i + 1}` });
          return false;
        }
        if (!passenger.age || passenger.age < 1 || passenger.age > 120) {
          setAlert({ type: "error", message: `Please enter valid age for passenger ${i + 1}` });
          return false;
        }
        if (!passenger.id_proof_number.trim()) {
          setAlert({ type: "error", message: `Please enter ID proof number for passenger ${i + 1}` });
          return false;
        }
      }
      return true;
    };

    const handlePayment = async () => {
      if (!validateForm()) return;
      setLoading(true);
      setAlert(null);

      try {
        const bookingResponse = await api.post("/ferry/bookings", {
          schedule_id: scheduleId,
          class_id: seatClass.class_id,
          booking_date: travelDate,
          number_of_passengers: passengers,
          passenger_details: passengerDetails,
          payment_method: "razorpay",
        });

        const { success, data } = bookingResponse.data;
        if (!success || !data || !data.razorpay_order_id) {
          throw new Error(data?.msg || "Failed to initialize booking.");
        }

        const { razorpay_order_id, amount, currency, booking_reference } = data;
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: amount * 100,
          currency: currency || "INR",
          name: "Ferry Booking Service",
          description: `${schedule?.ferry_name || "Ferry"} - ${seatClass.class_name}`,
          order_id: razorpay_order_id,
          handler: async (response) => {
            try {
              const verifyResponse = await api.post("/ferry/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              const { success: verifySuccess, msg: verifyMessage, data: bookingData } = verifyResponse.data;
              if (verifySuccess) {
                setAlert({ type: "success", message: verifyMessage || "Booking confirmed!" });
                setTimeout(() => {
                  window.location.href = `/bookings/${bookingData?.booking_id || booking_reference}`;
                }, 2000);
              } else {
                setAlert({ type: "error", message: verifyMessage || "Payment verification failed." });
              }
            } catch (verificationError) {
              console.error("Verification Error:", verificationError);
              setAlert({
                type: "error",
                message: verificationError.response?.data?.msg || "Error during payment verification.",
              });
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          theme: { color: "#6355B5" },
        };

        if (typeof window.Razorpay === "undefined") {
          setAlert({ type: "error", message: "Razorpay SDK not loaded." });
          setLoading(false);
          return;
        }

        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", (response) => {
          console.error("Razorpay Payment Failed:", response);
          setAlert({
            type: "error",
            message: response.error?.description || "Payment failed.",
          });
        });
        razorpay.open();

      } catch (error) {
        console.error("Booking/Payment Error:", error);
        setAlert({
          type: "error",
          message: error.response?.data?.msg || "Failed to initialize payment.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          style={{ maxWidth: "100%" }}
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              Complete Your Booking
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">
                Booking Summary
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                {schedule && (
                  <>
                    <p>
                      <span className="font-semibold">Ferry:</span> {schedule.ferry_name}
                    </p>
                    <p>
                      <span className="font-semibold">Operator:</span> {schedule.operator_name}
                    </p>
                    <p>
                      <span className="font-semibold">Route:</span> {schedule.departure_port} → {schedule.arrival_port}
                    </p>
                    <p>
                      <span className="font-semibold">Departure:</span> {schedule.departure_time.slice(0, 5)}
                    </p>
                  </>
                )}
                <p>
                  <span className="font-semibold">Date:</span> {travelDate}
                </p>
                <p>
                  <span className="font-semibold">Class:</span> {seatClass?.class_name}
                </p>
                <p>
                  <span className="font-semibold">Passengers:</span> {passengers}
                </p>
                <p className="text-lg font-bold text-gray-800 mt-2">
                  Total: ₹{totalAmount}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-4">
                Passenger Details
              </h3>
              <div className="space-y-4">
                {passengerDetails.map((passenger, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Passenger {index + 1}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`name-${index}`}>Full Name *</Label>
                        <Input
                          id={`name-${index}`}
                          value={passenger.full_name}
                          onChange={(e) => handlePassengerChange(index, 'full_name', e.target.value)}
                          placeholder="Enter full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`age-${index}`}>Age *</Label>
                        <Input
                          id={`age-${index}`}
                          type="number"
                          value={passenger.age}
                          onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                          placeholder="Age"
                          min="1"
                          max="120"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`gender-${index}`}>Gender *</Label>
                        <Select
                          value={passenger.gender}
                          onValueChange={(value) => handlePassengerChange(index, 'gender', value)}
                        >
                          <SelectTrigger id={`gender-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`id-type-${index}`}>ID Proof Type</Label>
                        <Select
                          value={passenger.id_proof_type}
                          onValueChange={(value) => handlePassengerChange(index, 'id_proof_type', value)}
                        >
                          <SelectTrigger id={`id-type-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Passport">Passport</SelectItem>
                            <SelectItem value="Aadhaar">Aadhaar</SelectItem>
                            <SelectItem value="Driving License">Driving License</SelectItem>
                            <SelectItem value="Voter ID">Voter ID</SelectItem>
                            <SelectItem value="PAN Card">PAN Card</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor={`id-number-${index}`}>ID Proof Number *</Label>
                        <Input
                          id={`id-number-${index}`}
                          value={passenger.id_proof_number}
                          onChange={(e) => handlePassengerChange(index, 'id_proof_number', e.target.value)}
                          placeholder="Enter ID proof number"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-800">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold">
                ₹{totalAmount}
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 sm:flex-none"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold flex-1 sm:flex-none"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Pay
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // MAIN HOME COMPONENT
  const Home = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useState({
      from: "",
      to: "",
      date: "",
      adults: 1,
      infants: 0,
    });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [bookingModal, setBookingModal] = useState({
      isOpen: false,
      scheduleId: null,
      seatClass: null,
      passengers: 0,
      travelDate: "",
      totalAmount: 0,
      schedule: null,
    });

    const today = new Date().toISOString().split("T")[0];

    const handleSearch = async () => {
      if (!searchParams.from || !searchParams.to || !searchParams.date) {
        setAlert({
          type: "warning",
          message: "Please fill in all search fields.",
        });
        return;
      }
      if (searchParams.from === searchParams.to) {
        setAlert({
          type: "error",
          message: "Departure and arrival ports cannot be the same.",
        });
        return;
      }

      setLoading(true);
      setAlert(null);
      try {
        const totalPassengers = searchParams.adults + searchParams.infants;
        const params = new URLSearchParams({
          from: searchParams.from,
          to: searchParams.to,
          date: searchParams.date,
          passengers: totalPassengers.toString(),
        });

        const response = await api.get(`/ferry/search?${params.toString()}`);
        
        if (response.data.success) {
          setSearchResults(response.data.data);
          setShowResults(true);
          setTimeout(() => {
            document
              .getElementById("search-results")
              ?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        } else {
          setAlert({
            type: "error",
            message: response.data.msg || "Failed to fetch ferry schedules. Please try again.",
          });
          setSearchResults([]);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setAlert({
          type: "error",
          message:
            error.response?.data?.msg ||
            "Failed to fetch ferry schedules. Please try again.",
        });
        setSearchResults([]);
        setShowResults(true);
      } finally {
        setLoading(false);
      }
    };

    const handleSelectClass = (scheduleId, seatClass, passengers, travelDate, schedule) => {
      if (!user) {
        setAlert({
          type: "warning",
          message: "Please login to book a ferry.",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return;
      }

      const totalAmount = parseFloat(seatClass.price_per_seat) * passengers;
      setBookingModal({
        isOpen: true,
        scheduleId: scheduleId,
        seatClass: seatClass,
        passengers: passengers,
        travelDate: travelDate,
        totalAmount: totalAmount,
        schedule: schedule,
      });
    };

    const closeBookingModal = () => {
      setBookingModal({
        isOpen: false,
        scheduleId: null,
        seatClass: null,
        passengers: 0,
        travelDate: "",
        totalAmount: 0,
        schedule: null,
      });
    };

    return (
      <div className="w-full overflow-x-hidden">
        {/* Hero Section with Search */}
        <div className="relative min-h-screen w-full" style={{ overflowX: "hidden" }}>
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${heroBackgroundImage})`,
              filter: "brightness(1)",
              maxWidth: "100%",
            }}
          ></div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Main Content */}
          <div
            className="relative z-10 w-full min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 text-white"
            style={{ maxWidth: "100vw" }}
          >
            {/* Decorative Frame */}
            <div className="absolute inset-4 sm:inset-6 lg:inset-8 border-2 border-white/40 rounded-[40px] pointer-events-none"></div>

            <div className="absolute bottom-24 right-10 md:right-16 text-white/80 hidden sm:block">
              <div className="flex items-center gap-2">
                <Star className="text-yellow-300 fill-current" />
                <span className="font-bold text-3xl">4.9</span>
              </div>
              <p className="text-right">from 2,400+ trips</p>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
              <h1
                style={customFontStyle}
                className="text-4xl mt-8 sm:text-5xl lg:text-8xl font-extrabold tracking-tight drop-shadow-lg"
              >
                Find Your Perfect{" "}
                <span style={customFontStyle2} className="text-yellow-400">
                  Voyage
                </span>
              </h1>
              <p
                style={customFontStyle}
                className="mt-4 max-w-3xl text-sm sm:text-xl text-white/90 drop-shadow-md"
              >
                Discover Premier Ferry Services In Breathtaking Locations. Unplug,
                Unwind, And Reconnect With The Sea.
              </p>
            </div>

            {/* Search Bar */}
            <div
              className="w-full max-w-5xl mb-36 bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-2 sm:p-3 mt-auto"
              style={{ maxWidth: "90%" }}
            >
              <div className="flex flex-col sm:flex-row items-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200 text-gray-700">
                {/* From Port */}
                <div className="flex items-center gap-2 px-4 py-2 sm:py-0 w-full sm:w-auto flex-1 min-w-0">
                  <Ship className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div className="flex flex-col items-start w-full min-w-0">
                    <span className="text-xs font-semibold text-gray-500">
                      From
                    </span>
                    <Select
                      value={searchParams.from}
                      onValueChange={(value) =>
                        setSearchParams({ ...searchParams, from: value })
                      }
                    >
                      <SelectTrigger className="border-0 bg-transparent  focus:ring-0 w-full p-2 h-auto font-medium text-base text-left">
                        <SelectValue placeholder="Departure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Port Blair">Port Blair</SelectItem>
                        <SelectItem value="Havelock Island">
                          Havelock Island
                        </SelectItem>
                        <SelectItem value="Neil Island">Neil Island</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* To Port */}
                <div className="flex items-center gap-2 px-4 py-2 sm:py-0 w-full sm:w-auto flex-1 min-w-0">
                  <MapPin className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div className="flex flex-col items-start w-full min-w-0">
                    <span className="text-xs font-semibold text-gray-500">
                      To
                    </span>
                    <Select
                      value={searchParams.to}
                      onValueChange={(value) =>
                        setSearchParams({ ...searchParams, to: value })
                      }
                    >
                      <SelectTrigger className="border-0 bg-transparent focus:ring-0 w-full p-2 h-auto font-medium text-base text-left">
                        <SelectValue placeholder="Arrival" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Port Blair">Port Blair</SelectItem>
                        <SelectItem value="Havelock Island">
                          Havelock Island
                        </SelectItem>
                        <SelectItem value="Neil Island">Neil Island</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {/* Date */}
                <div className="flex items-center gap-2 px-4 py-2 sm:py-0 w-full sm:w-auto flex-1 min-w-0">
                  <Calendar className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div className="flex flex-col items-start w-full min-w-0">
                    <label
                      htmlFor="date"
                      className="text-xs font-semibold text-gray-500"
                    >
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      min={today}
                      value={searchParams.date}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, date: e.target.value })
                      }
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-2 h-auto font-medium text-base w-full"
                    />
                  </div>
                </div>
                {/* Guests */}
                <div className="flex items-center gap-2 px-4 py-2 sm:py-0 w-full sm:w-auto flex-1 min-w-0">
                  <User className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <div className="flex flex-col items-start w-full min-w-0">
                    <span className="text-xs font-semibold text-gray-500">
                      Guests
                    </span>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={searchParams.adults}
                      onChange={(e) =>
                        setSearchParams({
                          ...searchParams,
                          adults: parseInt(e.target.value) || 1,
                          infants: 0,
                        })
                      }
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-2 h-auto font-medium text-base w-full"
                      placeholder="Number of guests"
                    />
                  </div>
                </div>
                {/* Button */}
                <div className="pl-2 pr-1 w-full sm:w-auto">
                  <Button
                    type="button"
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full sm:w-auto h-12 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full flex items-center justify-center gap-2 text-base"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Page Content */}
        <div className="bg-gray-50 w-full" style={{ overflowX: "hidden", maxWidth: "100vw" }}>
          <div
            className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full"
            style={{ maxWidth: "100%" }}
          >
            {alert && (
              <div className="my-6">
                <Alert {...alert} onClose={() => setAlert(null)} />
              </div>
            )}

            {showResults && (
              <section id="search-results" className="py-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  Available Ferries
                </h2>
                {searchResults.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-md p-12 text-center text-gray-500">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      No results found
                    </h3>
                    <p>
                      Try adjusting your search criteria or choose a different
                      date.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 w-full">
                    {searchResults.map((schedule) => (
                      <ScheduleCard
                        key={schedule.schedule_id}
                        schedule={schedule}
                        passengers={searchParams.adults + searchParams.infants}
                        travelDate={searchParams.date}
                        onSelectClass={handleSelectClass}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            <section
              style={customFontStyle}
              className="text-center mt-16 sm:mt-24 md:mt-32 w-full md:p-20"
            >
              <p className="text-gray-500 font-semibold tracking-widest text-xs sm:text-sm">
                WHAT WE SERVE
              </p>
              <h2
                style={customFontStyle2}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mt-2"
              >
                What Will You Get?
              </h2>
              <p className="text-gray-500 mt-4 max-w-lg mx-auto text-sm sm:text-base px-4">
                In every single trip that you go, you will get serve like a king.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mt-8 sm:mt-12 px-4 w-full">
                <FeatureCard
                  icon={<MapPin className="h-6 w-6 text-[#6355B5]" />}
                  title="Lot of Travel Places"
                  description="We will provide a lot of places in every single trip that you pick."
                />
                <FeatureCard
                  icon={<Ticket className="h-6 w-6 text-[#6355B5]" />}
                  title="Cheap Travel Packet"
                  description="Every packet travel that you chooses, will not till you."
                />
                <FeatureCard
                  icon={<Gem className="h-6 w-6 text-[#6355B5]" />}
                  title="And More Bonus"
                  description="We will make sure that you happy in our trip, so you will get some bonus in your trip."
                />
              </div>
            </section>
          </div>
        </div>

        {/* Other Home Components - Wrapped for overflow control */}
        <div className="w-full">
          <Home2 />
          <Activities />
          <Home3 />
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={bookingModal.isOpen}
          onClose={closeBookingModal}
          scheduleId={bookingModal.scheduleId}
          seatClass={bookingModal.seatClass}
          passengers={bookingModal.passengers}
          travelDate={bookingModal.travelDate}
          totalAmount={bookingModal.totalAmount}
          schedule={bookingModal.schedule}
        />
      </div>
    );
  };

  export default Home;