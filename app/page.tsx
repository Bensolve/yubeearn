"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetTrigger } from "@/components/ui/sheet";

import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation - Responsive */}
      <nav className="border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Y</span>
            </div>
            <span className="text-2xl font-bold text-primary">YubeEarn</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle></SheetTitle>
                   <SheetDescription></SheetDescription>
                </SheetHeader>
                <div className="space-y-4 mt-8">
                  <Link href="/login" className="block">
                    <Button variant="ghost" className="w-full ">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
          Earn Money Watching Videos
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get real viewers for your YouTube videos. Creators pay, earners make
          money, platform profits.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/signup?role=earner" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Start Earning
            </Button>
          </Link>
          <Link href="/signup?role=creator" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">
              Create Campaign
            </Button>
          </Link>
        </div>

        {/* Stats - Using Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 py-12 border-y border-border">
          <Card className="p-6 bg-card border-border">
            <div className="text-4xl font-bold text-green-600">₵1.2M</div>
            <p className="text-muted-foreground mt-2">Paid Out</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="text-4xl font-bold text-blue-600">50K+</div>
            <p className="text-muted-foreground mt-2">Active Users</p>
          </Card>
          <Card className="p-6 bg-card border-border">
            <div className="text-4xl font-bold text-purple-600">100K+</div>
            <p className="text-muted-foreground mt-2">Videos Watched</p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            How It Works
          </h2>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Earners */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-600 h-8 w-8 flex items-center justify-center text-white">
                  💰
                </Badge>
                <h3 className="text-xl md:text-2xl font-bold text-green-600">
                  For Earners
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Badge className="bg-green-600 text-white shrink-0">
                    1
                  </Badge>
                  <div>
                    <h4 className="font-bold text-foreground">Sign Up Free</h4>
                    <p className="text-sm text-muted-foreground">
                      Create your account instantly
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Badge className="bg-green-600 text-white shrink-0">
                    2
                  </Badge>
                  <div>
                    <h4 className="font-bold text-foreground">Browse Tasks</h4>
                    <p className="text-sm text-muted-foreground">
                      View available video tasks
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Badge className="bg-green-600 text-white shrink-0">
                    3
                  </Badge>
                  <div>
                    <h4 className="font-bold text-foreground">
                      Earn & Withdraw
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Get ₵85 per video, withdraw anytime
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Creators */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 h-8 w-8 flex items-center justify-center text-white">
                  🎬
                </Badge>
                <h3 className="text-xl md:text-2xl font-bold text-blue-600">
                  For Creators
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Badge className="bg-blue-600 text-white shrink-0">
                    1
                  </Badge>
                  <div>
                    <h4 className="font-bold text-foreground">Buy Points</h4>
                    <p className="text-sm text-muted-foreground">
                      ₵100 = 1 real viewer
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Badge className="bg-blue-600 text-white shrink-0">
                    2
                  </Badge>
                  <div>
                    <h4 className="font-bold text-foreground">
                      Create Campaign
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Link your YouTube video
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Badge className="bg-blue-600 text-white shrink-0">
                    3
                  </Badge>
                  <div>
                    <h4 className="font-bold text-foreground">
                      Get Real Views
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Reach 4,000 watch hours faster
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Ready to Start?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Join thousands earning money on YubeEarn
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup?role=earner" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Sign Up as Earner
            </Button>
          </Link>
          <Link href="/signup?role=creator" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full">
              Sign Up as Creator
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            © 2026 YubeEarn. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
