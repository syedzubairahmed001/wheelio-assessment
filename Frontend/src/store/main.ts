"use client";

import { create } from "zustand";
import axios from "axios";

import { BACKEND_URL } from "@/constants";

let localUser: any = localStorage.getItem("user");
localUser = localUser ? JSON.parse(localUser) : null;

const useUserStore = create((set) => ({
  user: localUser,
  allUsers: [],
  friendRequests: {},

  isUserLoading: false,
  isAllUsersLoading: false,

  logout: () => {
    set((state: any) => ({ user: null }));
    localStorage.removeItem("user");
  },

  fetchJoinUser: async ({ username, email }: any) => {
    set((state: any) => ({ isUserLoading: true }));
    const fetchUser = await axios.post(BACKEND_URL + "/user", {
      username,
      email,
      status: "",
    });
    set((state: any) => ({ user: fetchUser.data, isUserLoading: false }));
    localStorage.setItem("user", JSON.stringify(fetchUser.data));
  },
  fetchAllUsers: async () => {
    set((state: any) => ({ isAllUsersLoading: true }));
    const fetchUsers = await axios.get(BACKEND_URL + "/user");
    set((state: any) => ({
      allUsers: fetchUsers.data.users,
      isAllUsersLoading: false,
    }));
  },

  fetchSendFriendRequest: async ({ toUserId, fromUserId }: any) => {
    const fetchResult = await axios.post(BACKEND_URL + "/send-friend-request", {
      fromUserId,
      toUserId,
      isUserSeen: false,
      relationStatus: "SENT",
    });
    return fetchResult;
    // set((state: any) => ({allUsers: fetchUsers.data.users, isAllUsersLoading: false}))
  },

  fetchRelationStatus: async ({ toUserId, fromUserId }: any) => {
    const fetchResult = await axios.post(BACKEND_URL + "/relation-status", {
      fromUserId,
      toUserId,
    });
    return fetchResult.data;
  },

  fetchGetFriendRequests: async ({ userId }: any) => {
    const fetchResult = await axios.post(BACKEND_URL + "/friend-request", {
      userId,
    });
    set((state: any) => ({
      friendRequests: fetchResult.data,
    }));
    return fetchResult.data;
  },
  fetchUpdateRelationStatus: async ({
    fromUserId,
    toUserId,
    relationStatus,
  }: any) => {
    const fetchResult = await axios.post(
      BACKEND_URL + "/update-relation-status",
      {
        fromUserId,
        toUserId,
        relationStatus,
      }
    );
    return fetchResult.data;
  },
}));

export default useUserStore;
