import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Balances = {
    myDailys : Float;
    rewards : Float;
    available : Float;
    tit : Float;
    ben : Float;
  };

  public type User = {
    phoneNumber : Text;
    password : Text;
    balances : Balances;
  };

  public type Transaction = {
    id : Nat;
    fromUserId : Text;
    toUserId : Text;
    amount : Nat;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    phoneNumber : Text;
  };

  public type RegistrationError = {
    #phoneNumberInUse;
    #userNotRegistered;
    #incorrectPassword;
    #userNotFound;
    #unauthorized;
    #balanceOutOfRange;
  };

  var transactionsList = List.empty<Transaction>();
  var nextTransactionId = 0;

  let users = Map.empty<Principal, User>();
  let phoneToPrincipal = Map.empty<Text, Principal>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let defaultBalances : Balances = {
    myDailys = 20083.348;
    rewards = 0;
    available = 309623.895;
    tit = 18440.396;
    ben = 1642.952;
  };

  func checkFloatRange(value : Float) {
    if (value > 999_999_999 or value < 0) {
      Runtime.trap("Value must be between 0 and 999,999,999 Dly");
    };
  };

  public shared ({ caller }) func register(phoneNumber : Text, password : Text) : async {
    #ok : (); #err : RegistrationError;
  } {
    if (phoneToPrincipal.containsKey(phoneNumber)) {
      return #err(#phoneNumberInUse);
    };

    let user : User = {
      phoneNumber;
      password;
      balances = defaultBalances;
    };

    users.add(caller, user);
    phoneToPrincipal.add(phoneNumber, caller);

    let defaultProfile : UserProfile = {
      name = "";
      phoneNumber = phoneNumber;
    };
    userProfiles.add(caller, defaultProfile);

    #ok(());
  };

  public query func login(phoneNumber : Text, password : Text) : async {
    #ok : Principal;
    #err : RegistrationError;
  } {
    switch (phoneToPrincipal.get(phoneNumber)) {
      case (null) { #err(#userNotRegistered) };
      case (?userPrincipal) {
        switch (users.get(userPrincipal)) {
          case (null) { #err(#userNotFound) };
          case (?user) {
            if (user.password != password) {
              #err(#incorrectPassword);
            } else {
              #ok(userPrincipal);
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getCallerBalances() : async {
    #ok : Balances;
    #err : RegistrationError;
  } {
    switch (users.get(caller)) {
      case (null) { #err(#userNotFound) };
      case (?user) { #ok(user.balances) };
    };
  };

  public shared ({ caller }) func updateCallerBalances(balances : Balances) : async {
    #ok : (); #err : RegistrationError;
  } {
    checkFloatRange(balances.myDailys);
    checkFloatRange(balances.rewards);
    checkFloatRange(balances.available);
    checkFloatRange(balances.tit);
    checkFloatRange(balances.ben);

    switch (users.get(caller)) {
      case (null) { #err(#userNotFound) };
      case (?user) {
        let updatedUser : User = {
          phoneNumber = user.phoneNumber;
          password = user.password;
          balances;
        };
        users.add(caller, updatedUser);
        #ok(());
      };
    };
  };

  public shared ({ caller }) func transfer(fromUserId : Text, toPhoneNumber : Text, amount : Nat) : async {
    #ok : (); #err : RegistrationError;
  } {
    if (amount <= 0) {
      return #err(#balanceOutOfRange);
    };

    let callerUser = switch (users.get(caller)) {
      case (null) { return #err(#userNotFound) };
      case (?user) { user };
    };

    if (callerUser.phoneNumber != fromUserId) {
      return #err(#unauthorized);
    };

    let toPrincipal = switch (phoneToPrincipal.get(toPhoneNumber)) {
      case (null) { return #err(#userNotRegistered) };
      case (?principal) { principal };
    };

    let toUser = switch (users.get(toPrincipal)) {
      case (null) { return #err(#userNotFound) };
      case (?user) { user };
    };

    if (callerUser.balances.available < amount.toFloat()) {
      return #err(#balanceOutOfRange);
    };

    let updatedFromBalances : Balances = {
      callerUser.balances with available = callerUser.balances.available - amount.toFloat();
    };

    let updatedToBalances : Balances = {
      toUser.balances with available = toUser.balances.available + amount.toFloat();
    };

    users.add(caller, { callerUser with balances = updatedFromBalances });
    users.add(toPrincipal, { toUser with balances = updatedToBalances });

    let transaction : Transaction = {
      id = nextTransactionId;
      fromUserId;
      toUserId = toPhoneNumber;
      amount;
      timestamp = Time.now();
    };
    nextTransactionId += 1;

    transactionsList.add(transaction);

    #ok(());
  };

  public query ({ caller }) func getTransactionHistory(_userId : Text) : async [Transaction] {
    // Ignore passed userId to keep compatibility, only return caller's transactions
    let callerUser = switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };

    let transactionsArray = transactionsList.toArray();

    let filteredByUser = transactionsArray.filter(
      func(t) {
        t.fromUserId == callerUser.phoneNumber or t.toUserId == callerUser.phoneNumber;
      }
    );

    let sorted = filteredByUser.sort(
      func(a, b) {
        if (a.timestamp > b.timestamp) { return #less };
        if (a.timestamp < b.timestamp) { return #greater };
        #equal;
      }
    );
    sorted;
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };
};
