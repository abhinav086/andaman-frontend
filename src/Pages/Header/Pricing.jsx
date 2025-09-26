// src/Pages/Header/Pricing.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Pricing() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pricing & Revenue Streams</h1>
      
      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          Our platform does not charge direct fees to users for booking. Instead, we earn commissions from partners. All prices shown below are indicative and may vary based on season, operator, and availability.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Commission-Based Services</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Commission Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Ferry Bookings</TableCell>
                  <TableCell>Percentage-based commission</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Activity & Tour Bookings</TableCell>
                  <TableCell>Fixed or percentage commission</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Transportation Services</TableCell>
                  <TableCell>Service fee per booking</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Accommodation Bookings</TableCell>
                  <TableCell>Commission from hotels/resorts</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Travel Package Sales</TableCell>
                  <TableCell>Bundled commission</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Affiliate Marketing</TableCell>
                  <TableCell>Performance-based earnings</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample Price Ranges (Per Person)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Low Season</TableHead>
                  <TableHead>Peak Season</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Port Blair → Havelock Ferry</TableCell>
                  <TableCell>₹500 - ₹800</TableCell>
                  <TableCell>₹900 - ₹1,200</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Scuba Diving Package</TableCell>
                  <TableCell>₹2,500 - ₹4,000</TableCell>
                  <TableCell>₹4,500 - ₹6,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Island Hopping Tour</TableCell>
                  <TableCell>₹1,500 - ₹2,500</TableCell>
                  <TableCell>₹3,000 - ₹4,500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Private Car Transfer</TableCell>
                  <TableCell>₹800 - ₹1,500</TableCell>
                  <TableCell>₹1,800 - ₹3,000</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <p className="mt-4 text-sm text-muted-foreground">
              *Prices are approximate and subject to change. Always check real-time pricing during booking.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Value Proposition</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We focus on delivering the <strong>best experiences only</strong>, ensuring you get maximum value for your travel budget. Whether you're traveling solo, as a couple, or with family, our curated options cater to every segment — from budget-conscious backpackers to luxury seekers.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Budget Travelers</Badge>
            <Badge variant="outline">Luxury Seekers</Badge>
            <Badge variant="outline">Adventure Enthusiasts</Badge>
            <Badge variant="outline">Romance Getaways</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}