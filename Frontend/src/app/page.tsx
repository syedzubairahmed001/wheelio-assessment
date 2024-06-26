"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import useUserStore from "@/store/main";
import { socket } from "@/socket";

export default function Component() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("explore");

  const fetchAllUsers = useUserStore((state: any) => state.fetchAllUsers);
  const isAllUsersLoading = useUserStore(
    (state: any) => state.isAllUsersLoading
  );
  const allUsers: any = useUserStore((state: any) => state.allUsers);
  const currentUser: any = useUserStore((state: any) => state.user);

  useEffect(() => {
    fetchAllUsers();
    function onConnect() {
      if (currentUser?.id) {
        socket.emit(
          "register",
          { ...currentUser },
          function (dataFromServer: any) {
            console.log(dataFromServer);
          }
        );
      }
    }
    function onDisconnect() {
      console.log("test");
    }
    function onGetFriendReq(value: any) {
      const fromUser = value?.username;
      toast(`@${fromUser} just sent you a friend request`);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("get_friend_request", onGetFriendReq);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("get_friend_request", onGetFriendReq);
    };
  }, []);
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
  ]);

  const handleCardClick = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const handleAcceptFriendRequest = (user: any) => {
    console.log("Accepted friend request for", user.name);
  };
  const handleRejectFriendRequest = (user: any) => {
    console.log("Rejected friend request for", user.name);
  };
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
          <span className="hidden md:inline">Requests</span>
        </Button>
      </div>
      <div className="flex-1 p-4 sm:p-8">
        {activeTab === "explore" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {allUsers.map((user: any, index: number) => {
              if (user.id !== currentUser?.id) {
                return (
                  <div
                    key={index}
                    className="bg-card p-4 rounded-lg shadow-md cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleCardClick(user)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">@{user.username}</div>
                        <div className="text-muted-foreground text-xs">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
        {activeTab === "friends" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allUsers.map((user: any, index: number) => {
              if (user.id !== currentUser?.id) {
                return (
                  <div
                    key={index}
                    className="bg-card p-4 rounded-lg shadow-md cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => handleCardClick(user)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback>
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-muted-foreground text-sm">
                          {user.email}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          Status: {user.status}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
        {activeTab === "requests" && currentUser && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FriendRequests
              friendRequests={friendRequests}
              currentUser={currentUser}
            />
          </div>
        )}

        <UserDetailsDialog
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedUser={selectedUser}
          currentUser={currentUser}
        />
      </div>
    </div>
  );
}

const UserDetailsDialog = ({
  isModalOpen,
  setIsModalOpen,
  selectedUser,
  currentUser,
}: any) => {
  const [relationStatus, setRelationStatus] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState<string>("Send Friend Request");
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  useEffect(() => {
    if (currentUser?.id && selectedUser?.id) {
      loadFriendRequest();
    }
    if (!currentUser) {
      setButtonText("Join To Request");
      setButtonDisabled(true);
    }
  }, [currentUser, selectedUser]);

  const loadFriendRequest = async () => {
    setIsLoading(true);
    try {
      const frReq = await fetchRelationStatus({
        fromUserId: currentUser?.id,
        toUserId: selectedUser?.id,
      });
      console.log(frReq);
      setRelationStatus(frReq);
    } catch (err) {
      setButtonText("Send Friend Request");
      setButtonDisabled(false);
    }
    setIsLoading(false);
  };
  const fetchSendFriendRequest: any = useUserStore(
    (state: any) => state.fetchSendFriendRequest
  );
  const fetchRelationStatus: any = useUserStore(
    (state: any) => state.fetchRelationStatus
  );

  useEffect(() => {
    if (relationStatus?.relationStatus === "ACCEPTED") {
      setButtonText("You Are Friends");
      setButtonDisabled(true);
    } else if (relationStatus?.relationStatus === "SENT") {
      setButtonText("Friend Request Sent");
      setButtonDisabled(true);
    } else {
      setButtonText("Send Friend Request");
      setButtonDisabled(false);
    }
  }, [relationStatus]);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 p-3">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>
                {selectedUser?.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">@{selectedUser?.username}</div>
              <div className="text-muted-foreground text-sm">
                {selectedUser?.email}
              </div>
              <div className="text-muted-foreground text-sm">
                Status: {selectedUser?.status}
              </div>
            </div>
          </div>
          {isLoading ? (
            <>
              <div className="w-full h-10 animate-pulse rounded-md bg-slate-300"></div>
            </>
          ) : (
            <Button
              disabled={buttonDisabled}
              onClick={async () => {
                if (currentUser && selectedUser) {
                  socket.emit(
                    "send_friend_request",
                    { from: currentUser.username, toUserId: selectedUser.id },
                    function (dataFromServer: any) {
                      console.log(dataFromServer);
                    }
                  );
                }
                setIsLoading(true);
                await fetchSendFriendRequest({
                  toUserId: selectedUser.id,
                  fromUserId: currentUser?.id,
                });
                setButtonText("Friend Request Sent");
                setButtonDisabled(true);
                setIsLoading(false);
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FriendRequests = ({ currentUser }: any) => {
  const fetchGetFriendRequests: any = useUserStore(
    (state: any) => state.fetchGetFriendRequests
  );
  const friendRequests: any = useUserStore(
    (state: any) => state.friendRequests
  );
  const fetchUpdateRelationStatus: any = useUserStore(
    (state: any) => state.fetchUpdateRelationStatus
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    const users = await fetchGetFriendRequests({ userId: currentUser?.id });
    setIsLoading(false);
  };

  return (
    <>
      {friendRequests?.users?.map((user: any, index: any) => {
        let relationStatus = friendRequests?.relations.filter(
          (e: any) => e.fromUserId === user.id
        )[0].relationStatus;
        return (
          <div key={index} className="bg-card p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-muted-foreground text-sm">
                  {user.email}
                </div>
                <div className="text-muted-foreground text-sm">
                  Status: {user.status}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              {isLoading && (
                <Button
                  variant="default"
                  disabled
                  // onClick={() => handleAcceptFriendRequest(user)}
                >
                  Loading
                </Button>
              )}
              {relationStatus === "SENT" && !isLoading && (
                <>
                  <Button
                    variant="default"
                    onClick={async () => {
                      await fetchUpdateRelationStatus({
                        fromUserId: user.id,
                        toUserId: currentUser.id,
                        relationStatus: "ACCEPTED",
                      });
                      await fetchUsers();
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await fetchUpdateRelationStatus({
                        fromUserId: user.id,
                        toUserId: currentUser.id,
                        relationStatus: "REJECTED",
                      });
                      await fetchUsers();
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
              {relationStatus === "ACCEPTED" && !isLoading && (
                <Button
                  variant="outline"
                  disabled
                  // onClick={() => handleRejectFriendRequest(user)}
                >
                  You accepted
                </Button>
              )}
              {relationStatus === "REJECTED" && !isLoading && (
                <Button
                  variant="outline"
                  disabled
                  // onClick={() => handleRejectFriendRequest(user)}
                >
                  You rejected
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

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
  );
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
  );
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
  );
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
  );
}
