// src/Pages/Header/Services.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function Services() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
      
      <Tabs defaultValue="ferry" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="ferry">Ferry Booking</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="transport">Transportation</TabsTrigger>
          <TabsTrigger value="info">Travel Info</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="ferry">
          <Card>
            <CardHeader>
              <CardTitle>Ferry Booking System (Primary Service)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Real-time availability checking</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Instant booking confirmation & ticket delivery</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Integrated with Nautika, Green Ocean & private operators</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Fare comparison & schedule info</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-green-500" /> Security screening & luggage policy guidance</li>
              </ul>
              <p className="mt-4">
                <Badge variant="outline">Note:</Badge> We also provide government ferry information (timetables, counter timings) but do not facilitate bookings for them.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Adventure & Sightseeing Experiences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Adventure Activities</h3>
                  <ul className="space-y-1 mt-2">
                    <li>Scuba diving packages</li>
                    <li>Night kayaking experiences</li>
                    <li>Water sports activities</li>
                    <li>Island hopping tours</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Sightseeing Services</h3>
                  <ul className="space-y-1 mt-2">
                    <li>Local guided tours</li>
                    <li>Beach exploration packages</li>
                    <li>Cultural experiences</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transport">
          <Card>
            <CardHeader>
              <CardTitle>Transportation Services</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>Car transfers</li>
                <li>Airport transfers</li>
                <li>Local transportation booking</li>
                <li>Inter-island transportation coordination</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Travel Information Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>Best beaches guide</li>
                <li>Thrilling adventures directory</li>
                <li>Authentic local experiences</li>
                <li>Travel maps & guides (helping 100,000+ travelers)</li>
                <li>Things to do listings, restaurant & hotel guides</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle>Customer Support</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li>24/7 customer support team</li>
                <li>Live chat support</li>
                <li>Email & phone assistance</li>
                <li>Transparent booking process</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}