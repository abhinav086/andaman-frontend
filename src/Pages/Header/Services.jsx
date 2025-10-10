import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Ship,
  MapPin,
  Car,
  Info,
  Headphones,
  CheckCircle,
  Waves,
  Plane,
  Compass,
  Star,
} from "lucide-react";

export default function Services() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
          Our Services
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          From seamless ferry bookings to curated island adventures, we provide end-to-end travel solutions
          designed to make your Andaman trip unforgettable. Explore our services below.
        </p>
      </div>

      <Tabs defaultValue="ferry" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-5 gap-2 mb-10">
          <TabsTrigger value="ferry" className="flex flex-col items-center gap-1 py-3">
            <Ship className="h-5 w-5 text-blue-500" />
            Ferry Booking
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex flex-col items-center gap-1 py-3">
            <Waves className="h-5 w-5 text-emerald-500" />
            Activities
          </TabsTrigger>
          <TabsTrigger value="transport" className="flex flex-col items-center gap-1 py-3">
            <Car className="h-5 w-5 text-amber-500" />
            Transportation
          </TabsTrigger>
          <TabsTrigger value="info" className="flex flex-col items-center gap-1 py-3">
            <Info className="h-5 w-5 text-purple-500" />
            Travel Info
          </TabsTrigger>
          <TabsTrigger value="support" className="flex flex-col items-center gap-1 py-3">
            <Headphones className="h-5 w-5 text-rose-500" />
            Support
          </TabsTrigger>
        </TabsList>

        {/* Ferry Booking */}
        <TabsContent value="ferry" className="mt-0">
          <Card className="shadow-lg border-l-4 border-blue-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Ship className="h-6 w-6 text-blue-500" />
                <CardTitle>Ferry Booking System (Primary Service)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span><strong>Real-time availability checking</strong> across all major operators including Nautika, Green Ocean, and private ferries.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span><strong>Instant booking confirmation</strong> with e-tickets delivered via email & WhatsApp.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span><strong>Fare comparison engine</strong> to help you choose the best option based on price, timing, and comfort.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Clear guidance on <strong>security screening, luggage limits, and boarding procedures</strong>.</span>
                </li>
              </ul>
              <p className="mt-6 text-sm text-muted-foreground">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Info className="mr-1.5 h-3.5 w-3.5 inline" />
                  Note
                </Badge>{" "}
                We provide schedules and counter info for government ferries but do not process bookings for them.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities */}
        <TabsContent value="activities" className="mt-0">
          <Card className="shadow-lg border-l-4 border-emerald-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Waves className="h-6 w-6 text-emerald-500" />
                <CardTitle>Adventure & Sightseeing Experiences</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                    <Compass className="h-5 w-5 text-emerald-600" />
                    Adventure Activities
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      Certified scuba diving packages with PADI instructors
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      Guided night kayaking through bioluminescent waters
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      Jet skiing, parasailing, and banana boat rides
                    </li>
                    <li className="flex items-start">
                      <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      Full-day island hopping tours (Havelock, Neil, Ross)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    Cultural & Sightseeing
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>Local village & tribal culture tours (with permissions)</li>
                    <li>Sunset beach walks with expert naturalists</li>
                    <li>Historical site visits (Cellular Jail, Chatham Saw Mill)</li>
                    <li>Photography-focused excursions for travelers</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transportation */}
        <TabsContent value="transport" className="mt-0">
          <Card className="shadow-lg border-l-4 border-amber-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Car className="h-6 w-6 text-amber-500" />
                <CardTitle>Seamless Transportation Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Plane className="mr-3 mt-0.5 h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span><strong>Airport/harbor pickups & drop-offs</strong> with AC cars and verified drivers.</span>
                </li>
                <li className="flex items-start">
                  <Car className="mr-3 mt-0.5 h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span><strong>Inter-island transfers</strong> coordinated with your ferry schedule for zero wait time.</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="mr-3 mt-0.5 h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>On-demand local transport for sightseeing or last-minute changes.</span>
                </li>
                <li className="flex items-start">
                  <Star className="mr-3 mt-0.5 h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>All vehicles sanitized and GPS-tracked for safety.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Travel Info */}
        <TabsContent value="info" className="mt-0">
          <Card className="shadow-lg border-l-4 border-purple-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Info className="h-6 w-6 text-purple-500" />
                <CardTitle>Travel Information Hub</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Trusted by over 100,000+ travelers, our info hub helps you plan every detail of your trip.
              </p>
              <ul className="space-y-3">
                <li>✅ Curated guides to the <strong>best beaches</strong> (Radhanagar, Elephant, Kalapathar)</li>
                <li>✅ <strong>Adventure directory</strong> with safety ratings & booking links</li>
                <li>✅ Local food, hidden gems, and cultural etiquette tips</li>
                <li>✅ Printable <strong>maps, tide charts, and weather forecasts</strong></li>
                <li>✅ Verified listings for <strong>restaurants, homestays, and eco-resorts</strong></li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support */}
        <TabsContent value="support" className="mt-0">
          <Card className="shadow-lg border-l-4 border-rose-500">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Headphones className="h-6 w-6 text-rose-500" />
                <CardTitle>24/7 Customer Support</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Headphones className="mr-3 mt-0.5 h-5 w-5 text-rose-500 flex-shrink-0" />
                  <span><strong>Round-the-clock assistance</strong> via live chat, phone (+91 XXXXX XXXXX), and email.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="mr-3 mt-0.5 h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>Real-time updates on ferry cancellations or weather disruptions.</span>
                </li>
                <li className="flex items-start">
                  <Star className="mr-3 mt-0.5 h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span>Transparent pricing with <strong>no hidden fees</strong>.</span>
                </li>
                <li className="flex items-start">
                  <Info className="mr-3 mt-0.5 h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>Post-trip feedback system to continuously improve our service.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Optional CTA Section */}
      <div className="mt-16 text-center">
        <p className="text-muted-foreground mb-4">
          Ready to plan your perfect Andaman getaway?
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg font-medium hover:opacity-90 transition">
          Book Your Trip Today
        </button>
      </div>
    </div>
  );
}