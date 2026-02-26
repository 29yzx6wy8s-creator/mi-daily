import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Balances {
    ben: number;
    tit: number;
    myDailys: number;
    available: number;
    rewards: number;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
    phoneNumber: string;
}
export interface Transaction {
    id: bigint;
    toUserId: string;
    fromUserId: string;
    timestamp: Time;
    amount: bigint;
}
export enum RegistrationError {
    phoneNumberInUse = "phoneNumberInUse",
    userNotFound = "userNotFound",
    balanceOutOfRange = "balanceOutOfRange",
    incorrectPassword = "incorrectPassword",
    unauthorized = "unauthorized",
    userNotRegistered = "userNotRegistered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerBalances(): Promise<{
        __kind__: "ok";
        ok: Balances;
    } | {
        __kind__: "err";
        err: RegistrationError;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getTransactionHistory(_userId: string): Promise<Array<Transaction>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    login(phoneNumber: string, password: string): Promise<{
        __kind__: "ok";
        ok: Principal;
    } | {
        __kind__: "err";
        err: RegistrationError;
    }>;
    register(phoneNumber: string, password: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: RegistrationError;
    }>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transfer(fromUserId: string, toPhoneNumber: string, amount: bigint): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: RegistrationError;
    }>;
    updateCallerBalances(balances: Balances): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "err";
        err: RegistrationError;
    }>;
}
