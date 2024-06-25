
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("explore")
  const [friendRequests, setFriendRequests] = useState([
    {
      name: "Olivia Davis",
      email: "olivia.davis@example.com",
      avatar: "/placeholder-user.jpg",
      status: "Online",
    },
    {
      name: "Liam Nguyen",
      email: "liam.nguyen@example.com",
      avatar: "/placeholder-user.jpg",
      status: "Offline",
    },
    {
      name: "Sophia Hernandez",
      email: "sophia.hernandez@example.com",
      avatar: "/placeholder-user.jpg",
      status: "Away",
    },
  ])
  const users = [
    {
      name: "Olivia Davis",
      email: "olivia.davis@example.com",
      avatar: "/placeholder-user.jpg",
      status: "Online",
    },
    {
      name: "Liam Nguyen",
      email: "liam.nguyen@example.com",
      avatar: "/placeholder-user.jpg",
      status: "Offline",
    },
    {
      name: "Sophia Hernandez",
      email: "sophia.hernandez@example.com",
      avatar: "/placeholder-user.jpg",
      status: "Away",
    },
    {
      name: "Lucas Gonzalez",
      email: "lucas.gonzalez@example.com",
      avatar: "/placeholder-user.jpg",
      status: "Online",
    },
  ]
  const handleCardClick = (user: any) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }
  const handleAcceptFriendRequest = (user: any) => {
    console.log("Accepted friend request for", user.name)
  }
  const handleRejectFriendRequest = (user: any) => {
    console.log("Rejected friend request for", user.name)
  }
  return (
    <div className="flex h-screen flex-col md:flex-row container">
      <div className="bg-card p-4 flex flex-row gap-4 md:flex-col md:w-[200px] lg:w-[240px]">
        <Button
          variant={activeTab === "explore" ? "default" : "ghost"}
          className="justify-start gap-2"
          onClick={() => setActiveTab("explore")}
        >
          <CompassIcon className="w-5 h-5" />
          <span className="hidden md:inline">Explore</span>
        </Button>
        <Button
          variant={activeTab === "friends" ? "default" : "ghost"}
          className="justify-start gap-2"
          onClick={() => setActiveTab("friends")}
        >
          <UsersIcon className="w-5 h-5" />
          <span className="hidden md:inline">Friends Feed</span>
        </Button>
        <Button
          variant={activeTab === "requests" ? "default" : "ghost"}
          className="justify-start gap-2"
          onClick={() => setActiveTab("requests")}
        >
          <InboxIcon className="w-5 h-5" />
          <span className="hidden md:inline">Incoming Requests</span>
        </Button>
      </div>
      <div className="flex-1 p-4 sm:p-8">
        {activeTab === "explore" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {users.map((user, index) => (
              <div
                key={index}
                className="bg-card p-4 rounded-lg shadow-md cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleCardClick(user)}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-xs">{user.email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "friends" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {users.map((user, index) => (
              <div
                key={index}
                className="bg-card p-4 rounded-lg shadow-md cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleCardClick(user)}
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-sm">{user.email}</div>
                    <div className="text-muted-foreground text-sm">Status: {user.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "requests" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friendRequests.map((user, index) => (
              <div key={index} className="bg-card p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-muted-foreground text-sm">{user.email}</div>
                    <div className="text-muted-foreground text-sm">Status: {user.status}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="default" onClick={() => handleAcceptFriendRequest(user)}>
                    Accept
                  </Button>
                  <Button variant="outline" onClick={() => handleRejectFriendRequest(user)}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{selectedUser?.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser?.name}</div>
                  <div className="text-muted-foreground text-sm">{selectedUser?.email}</div>
                  <div className="text-muted-foreground text-sm">Status: {selectedUser?.status}</div>
                </div>
              </div>
              <Button>Send Friend Request</Button>
            </div>
            <div>
              <Button variant="ghost" className="absolute top-4 right-4">
                <XIcon className="w-5 h-5" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function CompassIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}


function InboxIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  )
}


function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}


function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}