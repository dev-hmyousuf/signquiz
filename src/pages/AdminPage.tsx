import React from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import QuizForm from "../components/admin/QuizForm";
import EventForm from "../components/admin/EventForm";
import { Shield } from "lucide-react";
import { redirect } from "react-router-dom";


export default function AdminPage() {
  const { user } = useUser();

  // Check if user has admin role (you'll need to implement this based on your user data structure)
  const isAdmin = user?.publicMetadata?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="quizzes" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="quizzes">Manage Quizzes</TabsTrigger>
          <TabsTrigger value="events">Manage Events</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Quiz</h2>
              <QuizForm />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
              <EventForm
                onEventCreated={(eventId) => {
                  console.log(eventId)
                  redirect(`/event/${eventId}`)
                }}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>
            {/* Add user management component here */}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Analytics Dashboard</h2>
            {/* Add analytics component here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
